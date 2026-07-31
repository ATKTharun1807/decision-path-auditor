"""
InstrumentedAgent: wraps an arbitrary agent so every step of its run is
logged, without the agent needing to know about the audit system.

Usage pattern
-------------
    agent = InstrumentedAgent(logger, session_id="sess-1", user_id="user-42")

    agent.log_input({"application_id": "APP-001", "request": "loan application"})

    with agent.tool_call("credit_bureau_lookup", {"applicant_id": "APP-001"}) as call:
        response = credit_bureau_api.lookup("APP-001")
        call.set_response(response)

    agent.log_reasoning_step("Credit score 610 is below the 640 threshold for this product.")

    agent.log_decision(decision="DECLINE", reasoning="Score below threshold", rule_id="RULE-CS-640")

    agent.log_output("We are unable to approve this application at this time.")

Every one of these calls produces exactly one DecisionEvent row via the
EventLogger (which enforces redaction). The wrapper itself holds no PII
handling logic -- that's intentionally centralized in EventLogger/redaction.py
so there is exactly one place to audit for correctness.
"""
from __future__ import annotations

import time
from contextlib import contextmanager
from typing import Any, Optional

from .logger import EventLogger
from .models import EventType


class ToolCallHandle:
    """Returned by `tool_call()` context manager so the caller can attach the response."""

    def __init__(self, agent: "InstrumentedAgent", tool_name: str, parameters: dict[str, Any]):
        self._agent = agent
        self.tool_name = tool_name
        self.parameters = parameters
        self.response: Any = None
        self._start = time.monotonic()

    def set_response(self, response: Any) -> None:
        self.response = response


class InstrumentedAgent:
    def __init__(self, logger: EventLogger, session_id: str, user_id: str):
        self.logger = logger
        self.session_id = session_id
        self.user_id = user_id

    # ---- step 1: input --------------------------------------------------
    def log_input(self, input_data: dict[str, Any]) -> None:
        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.INPUT,
            {"input": input_data},
            summary=f"Received input: {list(input_data.keys())}",
        )

    def log_context_retrieved(self, source: str, data: dict[str, Any]) -> None:
        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.CONTEXT_RETRIEVED,
            {"source": source, "data": data},
            summary=f"Retrieved context from {source}",
        )

    # ---- step 2: tool calls ---------------------------------------------
    @contextmanager
    def tool_call(self, tool_name: str, parameters: dict[str, Any]):
        handle = ToolCallHandle(self, tool_name, parameters)

        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.TOOL_CALL,
            {"tool_name": tool_name, "parameters": parameters},
            summary=f"Called tool: {tool_name}",
        )

        try:
            yield handle
        finally:
            latency_ms = round((time.monotonic() - handle._start) * 1000, 2)
            self.logger.log(
                self.session_id,
                self.user_id,
                EventType.TOOL_RESPONSE,
                {
                    "tool_name": tool_name,
                    "response": handle.response,
                    "latency_ms": latency_ms,
                },
                summary=f"Response from tool: {tool_name} ({latency_ms}ms)",
            )

    # ---- step 3: reasoning ------------------------------------------------
    def log_reasoning_step(self, thought: str, meta: Optional[dict[str, Any]] = None) -> None:
        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.REASONING_STEP,
            {"thought": thought, "meta": meta or {}},
            summary=f"Reasoning: {thought[:80]}",
        )

    # ---- step 4: decision + output ----------------------------------------
    def log_decision(self, decision: str, reasoning: str, rule_id: Optional[str] = None,
                      factors: Optional[dict[str, Any]] = None) -> None:
        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.DECISION,
            {
                "decision": decision,
                "reasoning": reasoning,
                "rule_id": rule_id,
                "factors": factors or {},
            },
            summary=f"Decision: {decision}",
        )

    def log_output(self, output_text: str) -> None:
        self.logger.log(
            self.session_id,
            self.user_id,
            EventType.OUTPUT,
            {"output": output_text},
            summary="Final output produced",
        )
