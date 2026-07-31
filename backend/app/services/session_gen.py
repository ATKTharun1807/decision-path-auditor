import sys
import os
import time
from uuid import uuid4

# Allow running from project root or backend directory
app_dir = os.path.dirname(os.path.abspath(__file__))          # .../backend/app/services
backend_app_dir = os.path.dirname(app_dir)                     # .../backend/app
backend_dir = os.path.dirname(backend_app_dir)                 # .../backend
root_dir = os.path.dirname(backend_dir)                        # .../AuditAI

for p in [root_dir, backend_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.database.database import get_engine, get_session_factory
from app.services.logger import EventLogger
from app.services.wrapper import InstrumentedAgent

def run_financial_agent(prompt: str):
    print(f"Executing Agent with prompt: '{prompt}'")
    engine = get_engine()
    SessionFactory = get_session_factory(engine)
    logger = EventLogger(SessionFactory)
    
    session_id = f"sess-{uuid4().hex[:12]}"
    agent = InstrumentedAgent(logger, session_id=session_id, user_id="user-44102")

    agent.log_input({"prompt": prompt, "customer_id": "cust-44102"})

    agent.log_reasoning_step("Loaded context documents: Customer Credit History 2025 (relevance: 0.95), Enterprise Risk Guidelines v4 (relevance: 0.89)")

    with agent.tool_call("QueryCustomerDatabase", {"customer_id": "cust-44102"}) as call:
        time.sleep(0.05)
        call.set_response({"customer_id": "cust-44102", "name": "Jane Doe", "account_status": "ACTIVE_EXCELLENT", "defaults": 0})

    agent.log_reasoning_step("Customer 'Jane Doe' has 0 defaults over 5 years active status. Credit ratio low.")

    with agent.tool_call("CalculateRiskScore", {"credit_score": 780, "debt_ratio": 0.18}) as call:
        time.sleep(0.03)
        call.set_response({"risk_score": 0.753})

    agent.log_decision(decision="APPROVE", reasoning="Credit limit expanded to $50,000 based on risk score 0.753", rule_id="RULE-CS-700")

    final_decision = "APPROVED: Credit limit expanded to $50,000 for customer cust-44102."
    agent.log_output(final_decision)
    return final_decision

if __name__ == "__main__":
    result = run_financial_agent(prompt="Evaluate credit limit increase request for user cust-44102")
    print(f"\n[SUCCESS] Agent Execution Completed Successfully!\nOutput: {result}")
