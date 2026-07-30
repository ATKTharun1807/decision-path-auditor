"""
A small demo "agent" for a loan application decision. It's not a real LLM
agent -- it's a stand-in that calls two mock tools (credit bureau lookup,
income verification) and applies a simple decision rule. The point is to
exercise the InstrumentedAgent wrapper across a realistic retrieve -> reason
-> decide flow, including a PII-bearing tool response that the redaction
layer must scrub before persistence.

Swap `run_loan_decision` internals for a real LLM-driven agent (e.g. one
that calls the Anthropic API with tool use) and the wrapper/logging code
does not need to change.
"""
from __future__ import annotations

import uuid

from app.wrapper import InstrumentedAgent


# ---- mock external tools --------------------------------------------------

def credit_bureau_lookup(applicant_id: str) -> dict:
    """Pretend external API call. Returns PII-bearing data on purpose,
    so we can verify the redaction layer catches it."""
    return {
        "applicant_id": applicant_id,
        "full_name": "Jordan Alvarez",
        "ssn": "412-88-2317",
        "email": "jordan.alvarez@example.com",
        "phone": "512-555-0199",
        "credit_score": 610,
        "open_delinquencies": 2,
    }


def income_verification(applicant_id: str) -> dict:
    return {
        "applicant_id": applicant_id,
        "annual_income_usd": 48000,
        "employment_status": "employed_full_time",
        "employer": "Acme Logistics",
    }


# ---- decision rule ----------------------------------------------------------

CREDIT_SCORE_THRESHOLD = 640
MAX_ALLOWED_DELINQUENCIES = 1


def evaluate_application(credit_data: dict, income_data: dict) -> tuple[str, str, str]:
    if credit_data["credit_score"] < CREDIT_SCORE_THRESHOLD:
        return (
            "DECLINE",
            f"Credit score {credit_data['credit_score']} is below the required "
            f"threshold of {CREDIT_SCORE_THRESHOLD} for this loan product.",
            "RULE-CS-640",
        )
    if credit_data["open_delinquencies"] > MAX_ALLOWED_DELINQUENCIES:
        return (
            "DECLINE",
            f"Applicant has {credit_data['open_delinquencies']} open delinquencies, "
            f"exceeding the maximum allowed ({MAX_ALLOWED_DELINQUENCIES}).",
            "RULE-DELINQ-MAX",
        )
    return ("APPROVE", "Applicant meets credit score and delinquency requirements.", "RULE-APPROVE-DEFAULT")


# ---- the instrumented agent run --------------------------------------------

def run_loan_decision(agent: InstrumentedAgent, application_id: str) -> dict:
    # Step 0: input
    agent.log_input({"application_id": application_id, "request_type": "personal_loan"})

    # Step 1: RETRIEVE - two tool calls
    with agent.tool_call("credit_bureau_lookup", {"applicant_id": application_id}) as call:
        credit_data = credit_bureau_lookup(application_id)
        call.set_response(credit_data)

    with agent.tool_call("income_verification", {"applicant_id": application_id}) as call:
        income_data = income_verification(application_id)
        call.set_response(income_data)

    agent.log_context_retrieved(
        source="internal_policy_db",
        data={
            "credit_score_threshold": CREDIT_SCORE_THRESHOLD,
            "max_allowed_delinquencies": MAX_ALLOWED_DELINQUENCIES,
            "product": "personal_loan",
        },
    )

    # Step 2: REASON
    agent.log_reasoning_step(
        f"Applicant credit score is {credit_data['credit_score']}; policy threshold is "
        f"{CREDIT_SCORE_THRESHOLD}. Score is below threshold -> this alone is sufficient "
        f"grounds for decline under RULE-CS-640, independent of income."
    )
    agent.log_reasoning_step(
        f"Applicant also has {credit_data['open_delinquencies']} open delinquencies "
        f"against a limit of {MAX_ALLOWED_DELINQUENCIES}, a secondary risk factor."
    )

    # Step 3: DECIDE
    decision, reasoning, rule_id = evaluate_application(credit_data, income_data)
    agent.log_decision(
        decision=decision,
        reasoning=reasoning,
        rule_id=rule_id,
        factors={
            "credit_score": credit_data["credit_score"],
            "open_delinquencies": credit_data["open_delinquencies"],
            "annual_income_usd": income_data["annual_income_usd"],
        },
    )

    output_text = (
        "Based on your application, we are unable to approve this request at this time."
        if decision == "DECLINE"
        else "Congratulations, your loan application has been approved."
    )
    agent.log_output(output_text)

    return {"decision": decision, "output": output_text}


def new_session_id() -> str:
    return f"sess-{uuid.uuid4().hex[:12]}"
