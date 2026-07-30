"""
Database schema for the Decision Path Auditor.

Design notes
------------
- Events are append-only. Nothing is ever updated or deleted (audit integrity).
- Each event belongs to a session (one agent run == one session_id).
- `step_index` gives a strict ordering within a session, independent of
  wall-clock timestamp resolution.
- `payload_json` holds the event-type-specific data (already redacted by the
  time it reaches this layer -- see app/redaction.py).
"""
from __future__ import annotations

import enum
import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()


class AuditorUser(Base):
    __tablename__ = "auditor_users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Integer, default=1)


class EventType(str, enum.Enum):
    INPUT = "input"
    CONTEXT_RETRIEVED = "context_retrieved"
    TOOL_CALL = "tool_call"
    TOOL_RESPONSE = "tool_response"
    REASONING_STEP = "reasoning_step"
    DECISION = "decision"
    OUTPUT = "output"


class DecisionEvent(Base):
    __tablename__ = "decision_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String, default=lambda: str(uuid.uuid4()), nullable=False, unique=True)

    session_id = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)

    step_index = Column(Integer, nullable=False)
    event_type = Column(Enum(EventType), nullable=False)

    # Redacted, JSON-serialized payload. Kept as text for storage-engine
    # portability (SQLite / Postgres) without needing native JSON columns.
    payload_json = Column(Text, nullable=False)

    # Free-text summary of what this step did, for quick scanning without
    # deserializing the payload (e.g. "called tool: credit_bureau_lookup").
    summary = Column(String, nullable=True)

    # Was anything redacted in this event's payload?
    redacted = Column(Integer, default=0)  # 0/1 boolean, portable across engines

    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)


def get_engine(db_url: str = None):
    if db_url is None:
        db_url = os.getenv("DATABASE_URL", "sqlite:///decision_audit.db")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    engine = create_engine(db_url, connect_args=connect_args)
    Base.metadata.create_all(engine)
    return engine


def get_session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)
