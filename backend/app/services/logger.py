"""
Append-only EventLogger service for recording decision steps with PII redaction.
"""
from __future__ import annotations

import logging
from typing import Any, Callable

from app.models.models import DecisionEvent, EventType
from app.services.redaction import redact_payload

logger = logging.getLogger("decision_auditor")


class EventLogger:
    def __init__(self, session_factory: Callable[[], Any]):
        self.session_factory = session_factory

    def log(
        self,
        session_id: str,
        user_id: str,
        event_type: EventType | str,
        payload: dict[str, Any] | list[Any],
        summary: str | None = None,
        step_index: int | None = None,
    ) -> DecisionEvent:
        if isinstance(event_type, str):
            event_type = EventType(event_type)

        payload_json, was_redacted = redact_payload(payload)

        db = self.session_factory()
        try:
            if step_index is None:
                max_step = (
                    db.query(DecisionEvent.step_index)
                    .filter(DecisionEvent.session_id == session_id)
                    .order_by(DecisionEvent.step_index.desc())
                    .first()
                )
                step_index = (max_step[0] + 1) if max_step else 0

            event = DecisionEvent(
                session_id=session_id,
                user_id=user_id,
                step_index=step_index,
                event_type=event_type,
                payload_json=payload_json,
                summary=summary,
                redacted=1 if was_redacted else 0,
            )
            db.add(event)
            db.commit()
            db.refresh(event)
            return event
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()
