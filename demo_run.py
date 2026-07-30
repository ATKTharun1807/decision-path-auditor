"""
End-to-end demo:
  1. Runs the instrumented loan-decision agent (retrieve -> reason -> decide).
  2. Reconstructs the decision path from storage by session_id.
  3. Prints the timeline and verifies PII was redacted.
  4. Generates a plain-English summary (Claude if ANTHROPIC_API_KEY is set;
     otherwise a local timeline-based summary — no API key needed).
  5. (Bonus) Generates a draft regulatory challenge response.

Run with: python demo_run.py
"""
import json

from app.logger import EventLogger
from app.models import get_engine, get_session_factory
from app.reconstructor import DecisionPathReconstructor
from demo_agent import new_session_id, run_loan_decision
from app.wrapper import InstrumentedAgent

DB_URL = "sqlite:///demo_decision_audit.db"


def main():
    engine = get_engine(DB_URL)
    SessionFactory = get_session_factory(engine)
    event_logger = EventLogger(SessionFactory)
    reconstructor = DecisionPathReconstructor(SessionFactory)

    session_id = new_session_id()
    user_id = "user-7781"

    agent = InstrumentedAgent(event_logger, session_id=session_id, user_id=user_id)

    print(f"=== Running instrumented agent | session_id={session_id} user_id={user_id} ===\n")
    result = run_loan_decision(agent, application_id="APP-2026-0042")
    print(f"Agent result: {result}\n")

    # --- reconstruct ---------------------------------------------------
    events = reconstructor.by_session(session_id)
    timeline = DecisionPathReconstructor.as_timeline_dict(events)
    timeline["session_id"] = session_id

    print(f"=== Reconstructed decision path ({timeline['step_count']} steps) ===")
    for e in timeline["timeline"]:
        redacted_flag = " [REDACTED]" if e["redacted"] else ""
        print(f"  [{e['step_index']}] {e['event_type']:<20} {e['summary']}{redacted_flag}")
    print()

    # --- verify redaction ------------------------------------------------
    raw_json = json.dumps(timeline)
    pii_markers = ["Jordan Alvarez", "412-88-2317", "jordan.alvarez@example.com", "512-555-0199"]
    leaked = [m for m in pii_markers if m in raw_json]
    if leaked:
        print(f"!! PII LEAK DETECTED: {leaked}\n")
    else:
        print("PII check passed: no raw PII found in stored timeline.\n")

    print("--- Full timeline JSON ---")
    print(json.dumps(timeline, indent=2))
    print()

    # --- summary generation ------------------------------------------------
    from app.summarizer import generate_challenge_response, generate_decision_summary

    print("=== Decision summary (plain English) ===")
    summary = generate_decision_summary(timeline)
    print(summary)
    print()

    print("=== Bonus: draft regulatory challenge response ===")
    challenge_response = generate_challenge_response(
        timeline,
        challenge_text="The applicant disputes the decline and asks for the specific "
        "reasons and data used.",
    )
    print(challenge_response)


if __name__ == "__main__":
    main()
