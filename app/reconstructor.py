"""
Reconstructs a structured decision-path timeline from stored events, and
provides the query surface: by session_id, user_id, and time range.
"""
from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Optional

from .models import DecisionEvent


class TimelineEvent:
    def __init__(self, row: DecisionEvent):
        self.event_id = row.event_id
        self.step_index = row.step_index
        self.event_type = row.event_type.value if hasattr(row.event_type, "value") else row.event_type
        self.timestamp = row.timestamp.isoformat() if isinstance(row.timestamp, datetime) else row.timestamp
        self.summary = row.summary
        self.redacted = bool(row.redacted)
        self.payload = json.loads(row.payload_json)

    def to_dict(self) -> dict[str, Any]:
        return {
            "event_id": self.event_id,
            "step_index": self.step_index,
            "event_type": self.event_type,
            "timestamp": self.timestamp,
            "summary": self.summary,
            "redacted": self.redacted,
            "payload": self.payload,
        }


class DecisionPathReconstructor:
    def __init__(self, session_factory):
        self._session_factory = session_factory

    def by_session(self, session_id: str) -> list[TimelineEvent]:
        db = self._session_factory()
        try:
            rows = (
                db.query(DecisionEvent)
                .filter(DecisionEvent.session_id == session_id)
                .order_by(DecisionEvent.step_index.asc())
                .all()
            )
            return [TimelineEvent(r) for r in rows]
        finally:
            db.close()

    def by_user(self, user_id: str) -> dict[str, list[TimelineEvent]]:
        """Returns {session_id: [events...]} for all sessions belonging to a user."""
        db = self._session_factory()
        try:
            rows = (
                db.query(DecisionEvent)
                .filter(DecisionEvent.user_id == user_id)
                .order_by(DecisionEvent.session_id.asc(), DecisionEvent.step_index.asc())
                .all()
            )
        finally:
            db.close()

        sessions: dict[str, list[TimelineEvent]] = {}
        for r in rows:
            sessions.setdefault(r.session_id, []).append(TimelineEvent(r))
        return sessions

    def by_time_range(
        self, start: datetime, end: datetime, user_id: Optional[str] = None
    ) -> dict[str, list[TimelineEvent]]:
        db = self._session_factory()
        try:
            q = db.query(DecisionEvent).filter(
                DecisionEvent.timestamp >= start, DecisionEvent.timestamp <= end
            )
            if user_id:
                q = q.filter(DecisionEvent.user_id == user_id)
            rows = q.order_by(DecisionEvent.session_id.asc(), DecisionEvent.step_index.asc()).all()
        finally:
            db.close()

        sessions: dict[str, list[TimelineEvent]] = {}
        for r in rows:
            sessions.setdefault(r.session_id, []).append(TimelineEvent(r))
        return sessions

    def user_id_for_session(self, session_id: str) -> Optional[str]:
        db = self._session_factory()
        try:
            row = (
                db.query(DecisionEvent)
                .filter(DecisionEvent.session_id == session_id)
                .first()
            )
            return row.user_id if row else None
        finally:
            db.close()

    @staticmethod
    def as_timeline_dict(events: list[TimelineEvent]) -> dict[str, Any]:
        """Structured timeline view: input -> context -> tools -> reasoning -> decision -> output."""
        if not events:
            return {}
        return {
            "session_id": None,  # filled by caller if desired
            "user_id": None,  # filled by caller if desired
            "step_count": len(events),
            "timeline": [e.to_dict() for e in events],
        }
