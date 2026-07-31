"""
Database Connection & Engine Factory for AuditAI Backend.
"""
from __future__ import annotations

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

def get_db_path() -> str:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    default_db = os.path.join(base_dir, "decision_audit.db")
    return os.getenv("DATABASE_URL", f"sqlite:///{default_db}")

def get_engine(db_url: str = None):
    if db_url is None:
        db_url = get_db_path()
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    engine = create_engine(db_url, connect_args=connect_args)
    Base.metadata.create_all(engine)
    return engine

def get_session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)
