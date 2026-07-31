"""
Demo Data Generator for AuditAI.
Generates 50 realistic enterprise AI audit sessions across 5 domains (Loan, HR, Insurance, Fraud, Medical)
and persists all events into the SQLite database.
"""
from __future__ import annotations

import random
from uuid import uuid4
from datetime import datetime, timezone
from typing import Dict, Any, List

from .models import EventType
from .logger import EventLogger

AGENTS = [
    {"name": "LoanEvaluator-v4",   "type": "Loan",      "policy": "RULE-CS-640",  "rule_desc": "Credit Score Threshold (min 640)"},
    {"name": "HiringAgent-v2",     "type": "HR",        "policy": "RULE-HR-101",  "rule_desc": "Degree & Experience Requirement (min 3 yrs)"},
    {"name": "InsuranceAI-v1",     "type": "Insurance", "policy": "RULE-INS-210", "rule_desc": "Risk Rating & Claim Limit ($50,000 max)"},
    {"name": "FraudDetector-v3",   "type": "Fraud",     "policy": "RULE-FR-500",  "rule_desc": "Velocity & IP Anomaly Threshold"},
    {"name": "MedicalAssistant-v2","type": "Medical",  "policy": "RULE-MED-330", "rule_desc": "Prescription Dosage & Allergy Crosscheck"},
]

def generate_50_demo_sessions(event_logger: EventLogger) -> Dict[str, Any]:
    created_sessions: List[Dict[str, Any]] = []

    for i in range(50):
        agent_info = random.choice(AGENTS)
        sid = f"sess-{uuid4().hex[:12]}"
        user_id = f"user-{random.randint(1000, 9999)}"
        decision = random.choices(["APPROVE", "DECLINE", "REVIEW"], weights=[55, 35, 10])[0]

        # 1. Input Event
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.INPUT,
            payload={
                "application_id": f"APP-{random.randint(1000,9999)}", 
                "domain": agent_info["type"], 
                "ssn": f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}"
            },
            summary=f"Received {agent_info['type']} evaluation request for {user_id}"
        )

        # 2. Context Retrieval
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.CONTEXT_RETRIEVED,
            payload={
                "user_id": user_id, 
                "historical_records": random.randint(1, 8), 
                "risk_profile": "Standard Enterprise"
            },
            summary=f"Retrieved user context & history for {user_id}"
        )

        # 3. Tool Call
        tool_name = f"{agent_info['type'].lower()}_verification_api"
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.TOOL_CALL,
            payload={
                "tool": tool_name, 
                "parameters": {"user_id": user_id, "amount": random.randint(5000, 75000)},
                "latency_ms": random.randint(4, 28)
            },
            summary=f"Executed tool: {tool_name}"
        )

        # 4. Tool Response
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.TOOL_RESPONSE,
            payload={
                "policy_id": agent_info["policy"], 
                "rule": agent_info["rule_desc"], 
                "passed": decision == "APPROVE"
            },
            summary=f"Evaluated policy {agent_info['policy']}: {'Passed' if decision == 'APPROVE' else 'Triggered Decline'}"
        )

        # 5. Reasoning Step
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.REASONING_STEP,
            payload={
                "agent": agent_info["name"], 
                "confidence": f"{random.randint(90, 99)}%", 
                "reasoning": f"Evaluated criteria against policy {agent_info['policy']}"
            },
            summary=f"{agent_info['name']} synthesized decision: {decision}"
        )

        # 6. Decision Event
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.DECISION,
            payload={
                "decision": decision, 
                "status": "COMPLETED", 
                "policy_applied": agent_info["policy"]
            },
            summary=f"Final Decision: {decision}"
        )

        # 7. Output Event
        event_logger.log(
            session_id=sid,
            user_id=user_id,
            event_type=EventType.OUTPUT,
            payload={
                "output": f"Application {decision}", 
                "session_id": sid
            },
            summary=f"Persisted output for session {sid}"
        )

        created_sessions.append({
            "session_id": sid,
            "user_id": user_id,
            "agent": agent_info["name"],
            "policy": agent_info["policy"],
            "decision": decision
        })

    return {
        "message": "50 Enterprise Demo Sessions Created & Persisted to SQLite Database",
        "count": len(created_sessions),
        "sample_sessions": created_sessions[:5]
    }
