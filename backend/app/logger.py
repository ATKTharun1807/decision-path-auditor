"""
EventLogger: the single choke point every event passes through before
persistence. This is where redaction is enforced -- callers cannot bypass it.
"""
from __future__ import annotations

import json
from typing import Any, Optional

from .models import DecisionEvent, EventType
from .redaction import redact_payload


class EventLogger:
    def __init__(self, session_factory):
        self._session_factory = session_factory
        self._step_counters: dict[str, int] = {}

    def _next_step(self, session_id: str) -> int:
        n = self._step_counters.get(session_id, 0)
        self._step_counters[session_id] = n + 1
        return n

    def log(
        self,
        session_id: str,
        user_id: str,
        event_type: EventType,
        payload: dict[str, Any],
        summary: Optional[str] = None,
    ) -> DecisionEvent:
        redacted_payload, was_redacted = redact_payload(payload)

        row = DecisionEvent(
            session_id=session_id,
            user_id=user_id,
            step_index=self._next_step(session_id),
            event_type=event_type,
            payload_json=json.dumps(redacted_payload, default=str),
            summary=summary,
            redacted=1 if was_redacted else 0,
        )

        db = self._session_factory()
        try:
            db.add(row)
            db.commit()
            db.refresh(row)
        finally:
            db.close()

        return row
