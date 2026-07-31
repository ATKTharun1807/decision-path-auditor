"""
DecisionPathReconstructor service for assembling session timelines.
"""
from __future__ import annotations

import json
from typing import Any, Callable

from app.models.models import DecisionEvent


class DecisionPathReconstructor:
    def __init__(self, session_factory: Callable[[], Any]):
        self.session_factory = session_factory

    def by_session(self, session_id: str) -> list[DecisionEvent]:
        db = self.session_factory()
        try:
            return (
                db.query(DecisionEvent)
                .filter(DecisionEvent.session_id == session_id)
                .order_by(DecisionEvent.step_index.asc())
                .all()
            )
        finally:
            db.close()

    def by_user(self, user_id: str) -> dict[str, list[DecisionEvent]]:
        db = self.session_factory()
        try:
            events = (
                db.query(DecisionEvent)
                .filter(DecisionEvent.user_id == user_id)
                .order_by(DecisionEvent.session_id.asc(), DecisionEvent.step_index.asc())
                .all()
            )

            result: dict[str, list[DecisionEvent]] = {}
            for e in events:
                result.setdefault(e.session_id, []).append(e)
            return result
        finally:
            db.close()

    def user_id_for_session(self, session_id: str) -> str | None:
        db = self.session_factory()
        try:
            first = (
                db.query(DecisionEvent.user_id)
                .filter(DecisionEvent.session_id == session_id)
                .first()
            )
            return first[0] if first else None
        finally:
            db.close()

    @staticmethod
    def as_timeline_dict(events: list[DecisionEvent]) -> dict[str, Any]:
        steps: list[dict[str, Any]] = []

        for e in events:
            try:
                payload = json.loads(e.payload_json)
            except Exception:
                payload = {"raw": e.payload_json}

            steps.append({
                "step_index": e.step_index,
                "event_type": e.event_type.value if hasattr(e.event_type, "value") else str(e.event_type),
                "summary": e.summary,
                "redacted": bool(e.redacted),
                "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                "payload": payload,
            })

        return {"timeline": steps, "total_steps": len(steps)}
