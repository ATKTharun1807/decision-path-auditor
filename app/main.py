from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, Header, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .models import get_engine, get_session_factory, AuditorUser
from .logger import EventLogger
from .reconstructor import DecisionPathReconstructor
from .summarizer import generate_challenge_response, generate_decision_summary
from .auth import verify_password, get_password_hash, create_access_token, UserCreate, ACCESS_TOKEN_EXPIRE_MINUTES, timedelta, jwt, JWTError, SECRET_KEY, ALGORITHM

app = FastAPI(title="Decision Path Auditor", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = get_engine()
SessionFactory = get_session_factory(engine)
event_logger = EventLogger(SessionFactory)
reconstructor = DecisionPathReconstructor(SessionFactory)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionFactory()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(AuditorUser).filter(AuditorUser.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(AuditorUser).filter(AuditorUser.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = AuditorUser(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(AuditorUser).filter(AuditorUser.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend/dist"

def _timeline_payload(session_id: str) -> dict:
    events = reconstructor.by_session(session_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No events found for session_id={session_id}")
    payload = DecisionPathReconstructor.as_timeline_dict(events)
    payload["session_id"] = session_id
    payload["user_id"] = reconstructor.user_id_for_session(session_id)
    return payload

@app.get("/decision-path/session/{session_id}")
def get_session_path(session_id: str, current_user: AuditorUser = Depends(get_current_user)):
    return _timeline_payload(session_id)

@app.get("/decision-path/user/{user_id}")
def get_user_paths(user_id: str, current_user: AuditorUser = Depends(get_current_user)):
    sessions = reconstructor.by_user(user_id)
    if not sessions:
        raise HTTPException(status_code=404, detail=f"No sessions found for user_id={user_id}")
    return {
        sid: {**DecisionPathReconstructor.as_timeline_dict(events), "session_id": sid}
        for sid, events in sessions.items()
    }

@app.get("/decision-path/range")
def get_range_paths(
    start: datetime = Query(..., description="ISO8601 start timestamp"),
    end: datetime = Query(..., description="ISO8601 end timestamp"),
    user_id: Optional[str] = Query(None),
    current_user: AuditorUser = Depends(get_current_user)
):
    sessions = reconstructor.by_time_range(start, end, user_id=user_id)
    return {
        sid: {**DecisionPathReconstructor.as_timeline_dict(events), "session_id": sid}
        for sid, events in sessions.items()
    }

class ChallengeRequest(BaseModel):
    challenge_text: Optional[str] = None

@app.post("/decision-path/session/{session_id}/summary")
def post_summary(session_id: str, x_api_key: Optional[str] = Header(None), current_user: AuditorUser = Depends(get_current_user)):
    timeline = _timeline_payload(session_id)
    try:
        summary = generate_decision_summary(timeline, api_key=x_api_key)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return {"session_id": session_id, "summary": summary}

@app.post("/decision-path/session/{session_id}/challenge-response")
def post_challenge_response(session_id: str, body: ChallengeRequest, x_api_key: Optional[str] = Header(None), current_user: AuditorUser = Depends(get_current_user)):
    timeline = _timeline_payload(session_id)
    try:
        response_text = generate_challenge_response(timeline, challenge_text=body.challenge_text, api_key=x_api_key)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return {"session_id": session_id, "challenge_response": response_text}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/demo/run")
def run_demo(current_user: AuditorUser = Depends(get_current_user)):
    """Runs the example loan-decision agent through the instrumented wrapper and
    returns the new session_id, so the frontend's 'Run a fresh demo decision'
    button has something real to call."""
    from demo_agent import new_session_id, run_loan_decision
    from .wrapper import InstrumentedAgent
    import random

    session_id = new_session_id()
    user_id = f"user-{random.randint(1000, 9999)}"
    agent = InstrumentedAgent(event_logger, session_id=session_id, user_id=user_id)
    run_loan_decision(agent, application_id=f"APP-{random.randint(1000, 9999)}")
    return {"session_id": session_id, "user_id": user_id}

# Serve the frontend last, so it doesn't shadow the API routes above.
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
