# Decision Path Auditor

A decision-path auditor for AI agents making consequential decisions (e.g. loan
approvals, claim denials, eligibility checks). Instead of storing just the
final text an agent produced, it captures the full causal chain — input,
tool calls and responses, reasoning steps, and the decision itself — as a
structured, queryable, PII-redacted audit trail.

## Why

> "Based on your application, we are unable to approve this request."

That's a transcript, not an audit trail. This project captures **what data
was considered, what tools were called, what the model's intermediate
reasoning was, and what the final decision logic was** — so a decision can
actually be explained and defended later.

## Project structure

```
decision-path-auditor/
├── app/
│   ├── models.py         # SQLAlchemy event schema (append-only event log)
│   ├── redaction.py       # PII redaction layer (regex + key-based heuristics)
│   ├── logger.py           # EventLogger — single choke point, enforces redaction
│   ├── wrapper.py           # InstrumentedAgent — wraps any agent, logs every step
│   ├── reconstructor.py      # Rebuilds structured timelines; query by session/user/time
│   ├── summarizer.py          # LLM (Claude) plain-English summary + challenge response
│   └── main.py                 # FastAPI service exposing it all
├── demo_agent.py           # Example 3-step agent: loan decline (retrieve/reason/decide)
├── demo_run.py             # End-to-end CLI demo script
├── requirements.txt
└── ARCHITECTURE.md
```

The frontend is plain HTML/CSS/JS — no build step, no framework, no bundler.
It's served directly by FastAPI (`StaticFiles` mount) so opening
`http://127.0.0.1:8000` gives you the dashboard talking to the same process
that serves the API.

## Setup

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # optional, needed for summary/challenge-response
```

## Run the demo (no server needed)

```bash
python demo_run.py
```

This runs a simulated loan-decline agent through the instrumented wrapper,
reconstructs its decision path, verifies no raw PII leaked into storage, and
(if `ANTHROPIC_API_KEY` is set) generates a plain-English summary and a draft
regulatory challenge response.

## Run the full app (frontend + backend)

```bash
uvicorn app.main:app --reload
```

Then open **http://127.0.0.1:8000** in a browser. You'll see the dashboard:

- **Query panel** — search by session ID, user ID, or a time range.
- **"Run a fresh demo decision"** — runs the instrumented loan-decision agent
  live and immediately loads its decision path, so you don't need any prior
  data to try it.
- **Timeline tab** — the reconstructed path, step by step, with redacted
  fields shown as blacked-out bars, matching what's actually stored.
- **Plain-English summary tab** — click "Generate summary" to call
  `/decision-path/session/{id}/summary` (needs `ANTHROPIC_API_KEY`).
- **Regulatory response tab** — optionally paste a challenge/dispute, then
  click "Draft response" to call the bonus challenge-response endpoint.

The frontend is a static site calling the same-origin API, so no separate
server or CORS setup is needed (CORS is enabled anyway in case you split
them later).

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/decision-path/session/{session_id}` | Reconstructed timeline for one session |
| GET | `/decision-path/user/{user_id}` | All sessions for a user |
| GET | `/decision-path/range?start=...&end=...` | Sessions in a time range |
| POST | `/decision-path/session/{session_id}/summary` | Plain-English decision summary (LLM) |
| POST | `/decision-path/session/{session_id}/challenge-response` | Draft regulatory response (LLM, bonus) |
| GET | `/health` | Health check |

## Instrumenting your own agent

```python
from app.wrapper import InstrumentedAgent
from app.logger import EventLogger
from app.models import get_engine, get_session_factory

engine = get_engine()
event_logger = EventLogger(get_session_factory(engine))

agent = InstrumentedAgent(event_logger, session_id="sess-1", user_id="user-42")

agent.log_input({"request": "..."})

with agent.tool_call("some_tool", {"param": "value"}) as call:
    response = some_tool(param="value")
    call.set_response(response)

agent.log_reasoning_step("Because X and Y, Z follows.")
agent.log_decision(decision="DECLINE", reasoning="...", rule_id="RULE-1")
agent.log_output("Final text shown to the user.")
```

Every call above produces exactly one append-only, redacted event row. No
other code path can write to the audit store — redaction is enforced inside
`EventLogger.log()`, not left to callers to remember.

## PII redaction

Two layers, applied to every payload before it is written:
1. **Regex pass** — catches SSNs, emails, phone numbers, card/account numbers
   embedded anywhere in text.
2. **Key-based heuristic pass** — any dict key like `name`, `ssn`, `address`,
   `email`, `dob`, etc. is redacted regardless of whether its value happens to
   match a pattern.

This is intentionally conservative: over-redacting in an audit log is a far
smaller problem than leaking PII into a compliance artifact.

## Notes / limitations

- The key-based heuristic pass is a fast, dependency-light stand-in for a
  proper NER model. For production use with unstructured free text (e.g. a
  customer's raw message containing a name in prose that isn't in a
  known key), swap in a real NER pipeline.
- SQLite is used for simplicity; `get_engine()` accepts any SQLAlchemy URL,
  so pointing at Postgres is a one-line change (`get_engine("postgresql://...")`).
- The demo agent is a scripted stand-in for a real LLM-driven agent. Swapping
  in a real agent (e.g. one that calls the Anthropic API with tool use) does
  not require changing the wrapper, logger, redaction, or reconstruction code
  — only `demo_agent.py`'s internals change.
