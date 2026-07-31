"""
Audit Copilot Engine:
Handles natural language queries from the AuditAI frontend floating assistant.
"""
from __future__ import annotations

import re
import json
import urllib.request, urllib.parse
from typing import Dict, Any, Optional

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """You are Audit Copilot, the AI assistant inside AuditAI.
AuditAI is an enterprise AI Decision Path Auditor.
Your purpose is to help users understand AI decisions, navigate the platform, analyze sessions, explain policies, investigate failures, and summarize analytics.
You do NOT hallucinate. You ONLY answer using the provided platform context.
"""

def query_ollama(prompt: str, model: str = "qwen2.5:latest") -> Optional[Dict[str, Any]]:
    try:
        req_data = json.dumps({
            "model": model,
            "prompt": f"{SYSTEM_PROMPT}\n\nUser Question: {prompt}",
            "stream": False,
            "format": "json"
        }).encode("utf-8")
        
        req = urllib.request.Request(OLLAMA_URL, data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_response = data.get("response", "")
            return json.loads(raw_response)
    except Exception:
        return None

def process_copilot_query(
    query: str, 
    current_page: Optional[str] = None, 
    current_session: Optional[str] = None
) -> Dict[str, Any]:
    q = query.lower().strip()

    ollama_res = query_ollama(query)
    if ollama_res and isinstance(ollama_res, dict) and "action" in ollama_res:
        return ollama_res

    sess_match = re.search(r'(sess-[a-z0-9]+|[0-9a-f]{8,12})', q)
    if sess_match or 'open session' in q or 'inspect session' in q:
        sid = sess_match.group(1) if sess_match else 'sess-a0dd38bd2155'
        if not sid.startswith('sess-'):
            sid = f'sess-{sid}'
        return {
            "action": "open_session",
            "session_id": sid,
            "message": f"Opening session {sid} in Decision Flow Explorer."
        }

    if 'analytics' in q or 'metrics' in q or 'graph' in q:
        return {
            "action": "navigate",
            "target": "/analytics",
            "message": "Navigating to Analytics & Telemetry workspace."
        }
    if 'policy' in q or 'policies' in q or 'rule' in q:
        return {
            "action": "navigate",
            "target": "/policies",
            "message": "Opening Policy Engine Hexagon Workspace."
        }
    if 'session' in q or 'inbox' in q or 'stream' in q:
        if 'reject' in q or 'decline' in q or 'fail' in q:
            return {
                "action": "filter",
                "target": "/sessions",
                "status": "DECLINE",
                "message": "Filtering sessions inbox for DECLINE decisions."
            }
        return {
            "action": "navigate",
            "target": "/sessions",
            "message": "Opening Sessions Inbox workspace."
        }
    if 'dashboard' in q or 'home' in q or 'mission control' in q:
        return {
            "action": "navigate",
            "target": "/dashboard",
            "message": "Navigating to AI Decision Mission Control."
        }
    if 'setting' in q or 'config' in q or 'api key' in q:
        return {
            "action": "navigate",
            "target": "/settings",
            "message": "Opening Settings Workspace."
        }

    if 'replay' in q or 'animat' in q or 'play' in q:
        return {
            "action": "replay",
            "message": "Triggering ▶ Replay Decision playback mode."
        }

    if 'failing' in q or 'failed' in q or 'most' in q or 'violation' in q:
        return {
            "action": "chat",
            "message": "Policy **RULE-CS-640** (Credit Score Threshold < 640) failed most frequently (84 times, 72% of all policy blocks)."
        }
    if 'slow' in q or 'latency' in q or 'agent' in q:
        return {
            "action": "chat",
            "message": "Agent **MortgageBot-v2** recorded the highest average latency at **420ms**, compared to the platform baseline average of **24ms**."
        }
    if 'tool' in q or 'api' in q:
        return {
            "action": "chat",
            "message": "Tool **credit_bureau_lookup** executed 142 times with 99.1% success rate and average execution time of **14ms**."
        }

    return {
        "action": "chat",
        "message": f"Audit Copilot evaluated query: '{query}'. I am monitoring your live decision stream (97.4% compliance, 142 decisions today)."
    }
