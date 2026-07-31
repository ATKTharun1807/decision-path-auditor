"""
50-Session Enterprise Demo Data Generator for AuditAI.
Creates realistic audit timelines across 5 domain agents.
"""
from __future__ import annotations

import random
from uuid import uuid4
from app.models.models import EventType
from app.services.logger import EventLogger

DOMAINS = [
    {
        "agent": "LoanEvaluator-v4",
        "domain": "Financial Credit",
        "policy": "RULE-CS-640",
        "tool": "credit_bureau_verifier_v2",
        "pass_reason": "Credit score meets or exceeds minimum 640 requirement.",
        "fail_reason": "Credit score is below minimum threshold 640."
    },
    {
        "agent": "HiringAgent-v2",
        "domain": "HR Screening",
        "policy": "RULE-HR-101",
        "tool": "resume_parser_v3",
        "pass_reason": "Candidate satisfies 4+ years required experience.",
        "fail_reason": "Candidate does not meet 4+ years experience threshold."
    },
    {
        "agent": "InsuranceAI-v1",
        "domain": "Underwriting Claims",
        "policy": "RULE-INS-210",
        "tool": "claims_history_analyzer",
        "pass_reason": "Prior claims ratio is within 15% risk tolerance.",
        "fail_reason": "Prior claims ratio exceeds safety threshold 15%."
    },
    {
        "agent": "FraudDetector-v3",
        "domain": "Transaction Fraud",
        "policy": "RULE-FR-500",
        "tool": "geo_ip_velocity_checker",
        "pass_reason": "Transaction velocity and IP geolocation score normal.",
        "fail_reason": "High-velocity IP geographic anomaly detected."
    },
    {
        "agent": "MedicalAssistant-v2",
        "domain": "Clinical Diagnostics",
        "policy": "RULE-MED-330",
        "tool": "drug_interaction_checker",
        "pass_reason": "No adverse drug-drug contraindications identified.",
        "fail_reason": "Severe allergy contraindication flagged."
    }
]


def generate_50_demo_sessions(logger: EventLogger) -> dict:
    session_ids = []

    for i in range(50):
        domain = random.choice(DOMAINS)
        sid = f"sess-{uuid4().hex[:12]}"
        uid = f"user-{random.randint(1000, 9999)}"
        session_ids.append(sid)

        is_passed = random.random() > 0.3
        decision = "APPROVE" if is_passed else "DECLINE"
        credit = random.randint(640, 820) if is_passed else random.randint(520, 630)

        # 1. Input
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.INPUT,
            payload={
                "application_id": f"APP-{random.randint(1000, 9999)}",
                "agent": domain["agent"],
                "domain": domain["domain"],
                "credit_score": credit,
                "ssn": f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}",
                "email": f"applicant_{i}@enterprise-client.com"
            },
            summary=f"Received application input for {domain['agent']}"
        )

        # 2. Context
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.CONTEXT_RETRIEVED,
            payload={"user_id": uid, "status": "ACTIVE", "policy": domain["policy"]},
            summary=f"Retrieved policy context: {domain['policy']}"
        )

        # 3. Tool Call
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.TOOL_CALL,
            payload={"tool": domain["tool"], "parameters": {"user_id": uid}},
            summary=f"Executed tool: {domain['tool']}"
        )

        # 4. Tool Response
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.TOOL_RESPONSE,
            payload={"tool": domain["tool"], "passed": is_passed, "score": credit},
            summary=f"Tool response: {domain['tool']} ({'Passed' if is_passed else 'Failed'})"
        )

        # 5. Reasoning Step
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.REASONING_STEP,
            payload={"reasoning": domain["pass_reason"] if is_passed else domain["fail_reason"]},
            summary=f"Synthesized verdict: {decision}"
        )

        # 6. Decision
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.DECISION,
            payload={"decision": decision, "policy_applied": domain["policy"]},
            summary=f"Final Decision: {decision}"
        )

        # 7. Output
        logger.log(
            session_id=sid,
            user_id=uid,
            event_type=EventType.OUTPUT,
            payload={"output": f"Application {decision}", "session_id": sid},
            summary=f"Output persisted for {sid}"
        )

    return {
        "status": "SUCCESS",
        "sessions_generated": len(session_ids),
        "sample_session_id": session_ids[0],
        "message": f"Successfully generated {len(session_ids)} enterprise demo audit sessions!"
    }
