"""
InstrumentedAgent: wraps an arbitrary agent so every step of its run is logged.
"""
from __future__ import annotations

import time
from contextlib import contextmanager
from typing import Any, Optional

from app.models.models import EventType
from app.services.logger import EventLogger


class ToolCallHandle:
    def __init__(self, agent: "InstrumentedAgent", tool_name: str, parameters: dict[str, Any]):
        self._agent = agent
        self._tool_name = tool_name
        self._parameters = parameters
        self._response: Any = None
        self._start_time = time.time()

    def set_response(self, response: Any) -> None:
        self._response = response


class InstrumentedAgent:
    def __init__(self, logger: EventLogger, session_id: str, user_id: str):
        self.logger = logger
        self.session_id = session_id
        self.user_id = user_id
        self._step_counter = 0

    def _next_step(self) -> int:
        idx = self._step_counter
        self._step_counter += 1
        return idx

    def log_input(self, payload: dict[str, Any], summary: Optional[str] = None):
        return self.logger.log(
            session_id=self.session_id,
            user_id=self.user_id,
            event_type=EventType.INPUT,
            payload=payload,
            summary=summary or "Received initial input",
            step_index=self._next_step(),
        )

    def log_reasoning_step(self, reasoning: str, payload: Optional[dict[str, Any]] = None):
        body = {"reasoning": reasoning}
        if payload:
            body.update(payload)
        return self.logger.log(
            session_id=self.session_id,
            user_id=self.user_id,
            event_type=EventType.REASONING_STEP,
            payload=body,
            summary=f"Reasoning: {reasoning[:60]}...",
            step_index=self._next_step(),
        )

    @contextmanager
    def tool_call(self, tool_name: str, parameters: dict[str, Any]):
        handle = ToolCallHandle(self, tool_name, parameters)
        self.logger.log(
            session_id=self.session_id,
            user_id=self.user_id,
            event_type=EventType.TOOL_CALL,
            payload={"tool": tool_name, "parameters": parameters},
            summary=f"Called tool: {tool_name}",
            step_index=self._next_step(),
        )

        try:
            yield handle
        finally:
            elapsed_ms = int((time.time() - handle._start_time) * 1000)
            self.logger.log(
                session_id=self.session_id,
                user_id=self.user_id,
                event_type=EventType.TOOL_RESPONSE,
                payload={
                    "tool": tool_name,
                    "response": handle._response,
                    "latency_ms": elapsed_ms,
                },
                summary=f"Tool response: {tool_name} ({elapsed_ms}ms)",
                step_index=self._next_step(),
            )

    def log_decision(
        self,
        decision: str,
        reasoning: str,
        rule_id: Optional[str] = None,
        confidence: Optional[float] = None,
    ):
        payload = {
            "decision": decision,
            "reasoning": reasoning,
            "rule_applied": rule_id,
            "confidence": confidence,
        }
        return self.logger.log(
            session_id=self.session_id,
            user_id=self.user_id,
            event_type=EventType.DECISION,
            payload=payload,
            summary=f"Decision: {decision} (rule: {rule_id or 'none'})",
            step_index=self._next_step(),
        )

    def log_output(self, output: Any, summary: Optional[str] = None):
        return self.logger.log(
            session_id=self.session_id,
            user_id=self.user_id,
            event_type=EventType.OUTPUT,
            payload={"output": output},
            summary=summary or "Generated final output",
            step_index=self._next_step(),
        )
