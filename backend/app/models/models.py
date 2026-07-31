"""
Database schema for the Decision Path Auditor & Enterprise Multi-Model AI Governance OS.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Integer,
    String,
    Text,
    Float,
    Boolean,
)

from app.database.database import Base


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

    payload_json = Column(Text, nullable=False)
    summary = Column(String, nullable=True)
    redacted = Column(Integer, default=0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)


class LLMProvider(Base):
    __tablename__ = "llm_providers"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    status = Column(String, default="Connected")
    api_key_status = Column(String, nullable=True)
    latency_ms = Column(Integer, default=18)
    total_requests = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    est_cost = Column(Float, default=0.0)
    version = Column(String, nullable=True)
    enabled = Column(Boolean, default=True)


class LLMModel(Base):
    __tablename__ = "llm_models"

    id = Column(String, primary_key=True)
    provider_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    context_length = Column(String, nullable=False)
    avg_latency_ms = Column(Integer, default=20)
    cost_per_1k = Column(String, nullable=False)
    status = Column(String, default="Active")
    recommended = Column(Text, nullable=True)


class AgentConfig(Base):
    __tablename__ = "agent_configurations"

    agent_name = Column(String, primary_key=True)
    provider_id = Column(String, nullable=False, default="ollama")
    model_id = Column(String, nullable=False, default="qwen2.5:latest")
    temperature = Column(Float, default=0.2)
    top_p = Column(Float, default=0.9)
    max_tokens = Column(Integer, default=3000)
    streaming = Column(Boolean, default=True)
    audit_logging = Column(Boolean, default=True)
    pii_redaction = Column(Boolean, default=True)
    policy_engine = Column(Boolean, default=True)
    retriever = Column(Boolean, default=True)
    system_prompt = Column(Text, nullable=True)
    tools = Column(Text, nullable=True)
    bound_policies = Column(Text, nullable=True)


class ModelCallMetric(Base):
    __tablename__ = "model_call_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, index=True, nullable=False)
    provider_id = Column(String, nullable=False)
    model_id = Column(String, nullable=False)
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
