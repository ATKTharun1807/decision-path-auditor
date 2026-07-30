# Architecture

## Design goals

1. **Causal chain, not just a transcript.** Every step of an agent's run —
   input, tool calls with parameters and raw responses, reasoning steps,
   decision logic, final output — is captured as a discrete, ordered event.
2. **Audit integrity.** Events are append-only. Redaction happens exactly
   once, at write time, in a single enforced code path (`EventLogger.log`) —
   no caller can accidentally persist raw PII.
3. **Reconstructability.** Given only a `session_id`, the full path can be
   rebuilt as a structured object, independent of how it was originally
   produced (works for any agent that uses the wrapper).
4. **Explainability for two audiences.** A machine-reconstructed timeline is
   not readable by a customer or a non-technical reviewer. An LLM turns it
   into plain English (or, for the bonus, a formal regulatory draft) —
   constrained to only use facts present in the timeline, to avoid
   post-hoc rationalization that doesn't match what actually happened.

## Data model

Each event is one row:

| field | purpose |
|---|---|
| `event_id` | unique ID for the event itself |
| `session_id` | groups events into one agent run |
| `user_id` | the customer/subject the decision is about |
| `step_index` | strict ordering within a session |
| `event_type` | input / context_retrieved / tool_call / tool_response / reasoning_step / decision / output |
| `payload_json` | redacted, event-specific data |
| `summary` | short human-readable line for scanning without deserializing payload |
| `redacted` | whether this event's payload had anything scrubbed |
| `timestamp` | wall-clock time, indexed for range queries |

This is deliberately a single flat event table rather than one table per
event type: it keeps the append-only/ordering guarantees simple, keeps
querying by session/user/time trivial (one table, three indexes), and mirrors
how the events actually arrive — as a stream, not as pre-categorized records.

## Data flow

```
Agent code
   │
   │ calls agent.log_input() / agent.tool_call() / agent.log_reasoning_step()
   │ / agent.log_decision() / agent.log_output()
   ▼
InstrumentedAgent (wrapper.py)
   │ builds a structured payload for each event type
   ▼
EventLogger.log() (logger.py)
   │ 1. redact_payload(payload)   <- redaction.py, always runs
   │ 2. assign step_index
   │ 3. write DecisionEvent row
   ▼
Storage (models.py — SQLite/Postgres via SQLAlchemy)
   │
   │ queried by session_id / user_id / time range
   ▼
DecisionPathReconstructor (reconstructor.py)
   │ orders events by step_index, returns structured timeline dict
   ▼
   ├─→ generate_decision_summary()      (summarizer.py, Claude API)
   └─→ generate_challenge_response()    (summarizer.py, Claude API, bonus)
```

## Why redaction happens where it does

Redaction is applied inside `EventLogger.log()`, not in the wrapper and not
at query time. Three reasons:

- **Single enforcement point.** Every event, from every call site, goes
  through `EventLogger.log()`. There's exactly one place to audit and test
  for redaction correctness.
- **Never persist raw PII, even transiently.** Redacting at query/read time
  would mean raw PII sits in the database in the meantime — a data-retention
  and breach-surface risk. Redacting at write time means raw PII never
  touches disk.
- **Redaction state is recorded, not inferred.** Each event stores whether it
  was redacted (`redacted` flag), so downstream consumers (e.g. the summary
  generator) know a field was scrubbed rather than silently missing.

## Why the summarizer is prompt-constrained

Both `generate_decision_summary` and `generate_challenge_response` are
instructed to use *only* facts present in the timeline JSON. An audit tool
that lets an LLM "fill in" plausible-sounding reasoning would be actively
dangerous — it would produce a confident-sounding explanation that might not
match what the agent actually did. The constraint trades some fluency for
grounding, which is the right tradeoff for a compliance artifact.

## Extending to a real LLM agent

`InstrumentedAgent` has no dependency on how the agent itself is implemented.
To wrap a real Claude-powered agent (e.g. one using tool use / extended
thinking):

- Call `agent.log_input()` with the incoming request.
- Wrap each Anthropic API tool-call round-trip in `agent.tool_call(...)`.
- If the model exposes extended thinking / reasoning blocks, feed each into
  `agent.log_reasoning_step()`.
- Call `agent.log_decision()` once the agent's control logic settles on a
  final decision (this is often separate from the LLM call itself, e.g. a
  rules engine consuming the LLM's output).
- Call `agent.log_output()` with the exact text shown to the user.

No changes to `logger.py`, `redaction.py`, `models.py`, or `reconstructor.py`
are needed to support this.

## Known limitations / next steps

- PII detection for unstructured free text relies on regex + key-based
  heuristics, not a trained NER model. Good enough for structured tool
  responses (most of what agents pass around); a real NER/LLM-based pass
  would be the natural upgrade for prose fields.
- No authentication/authorization is implemented on the FastAPI service —
  in production, access to decision paths (even redacted ones) should be
  role-gated, since the story of *why* someone was declined is itself
  sensitive.
- Redaction is not currently reversible even for authorized reviewers who
  need the underlying values (e.g. a compliance officer verifying the SSN
  used). A production version would likely pair redaction with a separate,
  tightly access-controlled vault + reference token, rather than one-way
  destruction of the value.
