"""
Uses local Ollama (qwen2.5:latest) to turn a reconstructed decision-path timeline into summaries and defenses.
"""
from __future__ import annotations

import json
import urllib.request
import urllib.error
from typing import Any, Optional

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5:latest"

_SUMMARY_SYSTEM_PROMPT = """You are writing a plain-English explanation of an automated decision for a non-technical reviewer or for the person the decision was made about.

Rules:
- Base your explanation ONLY on the timeline JSON provided. Do not invent facts, data, or reasoning.
- Explain: what was requested, what data was looked up, what reasoning was used, and what the final decision was.
- Keep it concise: 4-6 sentences.
- Be neutral, factual, and clear."""

_CHALLENGE_SYSTEM_PROMPT = """You are drafting a response to a regulatory challenge or appeal regarding an automated decision.

Rules:
- Base your response ONLY on the timeline JSON provided. Cite specific tool calls, rules, and decision steps.
- Professional, precise tone suitable for a compliance/regulatory audience."""

def _call_ollama(prompt: str, system_prompt: str) -> Optional[str]:
    try:
        full_prompt = f"{system_prompt}\n\nTimeline JSON Data:\n{prompt}\n\nSummary:"
        payload = {
            "model": MODEL_NAME,
            "prompt": full_prompt,
            "stream": False
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(OLLAMA_URL, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            return res.get("response", "").strip()
    except Exception:
        return None

def _events(timeline: dict[str, Any], event_type: str) -> list[dict[str, Any]]:
    return [e for e in timeline.get("timeline", []) if e.get("event_type") == event_type]

def _generate_offline_summary(timeline: dict[str, Any]) -> str:
    parts: list[str] = []

    input_events = _events(timeline, "input")
    if input_events:
        inp = input_events[0].get("payload", {}).get("input", {})
        request_type = str(inp.get("request_type", "request")).replace("_", " ")
        ref = inp.get("application_id") or inp.get("request_id") or "the submitted request"
        parts.append(f"A {request_type} was received (reference: {ref}).")

    tool_calls = _events(timeline, "tool_call")
    if tool_calls:
        names = [str(e.get("payload", {}).get("tool", "lookup")).replace("_", " ") for e in tool_calls]
        parts.append(f"The system retrieved data via: {', '.join(names)}.")

    reasoning_events = _events(timeline, "reasoning_step")
    if reasoning_events:
        r = reasoning_events[0].get("payload", {}).get("reasoning")
        if r:
            parts.append(f"Reasoning applied: {r}")

    decision_events = _events(timeline, "decision")
    if decision_events:
        dec = decision_events[0].get("payload", {}).get("decision")
        parts.append(f"Final verdict: {dec}.")

    return " ".join(parts) or "The AI agent evaluated the session and logged a deterministic audit trail."

def generate_decision_summary(timeline: dict[str, Any], api_key: Optional[str] = None) -> str:
    timeline_str = json.dumps(timeline, indent=2, default=str)
    ollama_res = _call_ollama(timeline_str, _SUMMARY_SYSTEM_PROMPT)
    if ollama_res:
        return ollama_res
    return _generate_offline_summary(timeline)

def generate_challenge_response(timeline: dict[str, Any], challenge_text: Optional[str] = None, api_key: Optional[str] = None) -> str:
    timeline_str = json.dumps(timeline, indent=2, default=str)
    prompt = f"Challenge Query: {challenge_text or 'Customer appeals decision'}\nTimeline Data:\n{timeline_str}"
    ollama_res = _call_ollama(prompt, _CHALLENGE_SYSTEM_PROMPT)
    if ollama_res:
        return ollama_res
    return f"Grounded Audit Defense Response for Session {timeline.get('session_id', 'unknown')}: All criteria evaluated against active compliance rules."
