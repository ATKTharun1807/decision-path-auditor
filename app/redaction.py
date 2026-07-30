"""
Redaction layer.

Runs on every event payload BEFORE it is written to storage. This is
deliberately conservative: it's better to over-redact in an audit log than
to leak PII, since the whole point of this system is to be a safe artifact
you can hand to a regulator or the customer themselves.

Two passes:
  1. Regex pass for structured / high-confidence PII (SSN, email, phone,
     card numbers, IBAN-ish account numbers, DOB patterns).
  2. Heuristic name pass for free-text fields (e.g. "applicant_name": "Jane Doe")
     using key-based detection -- if a dict key looks like a name/address/PII
     field, its value is redacted regardless of pattern match. This catches
     things regex can miss (e.g. a name that doesn't match any pattern).

A production system would likely swap step 2 for a proper NER model; the
key-based heuristic is a fast, dependency-light stand-in that still gives
good coverage over structured tool responses (which is most of what an
agent's tool calls look like).
"""
from __future__ import annotations

import re
from typing import Any

# --- Regex patterns for structured PII -------------------------------------------------

_PATTERNS = {
    "SSN": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    "EMAIL": re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"),
    "PHONE": re.compile(r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"),
    "CARD": re.compile(r"\b(?:\d[ -]*?){13,16}\b"),
    "ACCOUNT_NUM": re.compile(r"\b\d{8,17}\b"),  # bank account / routing-ish numbers
    "DOB": re.compile(r"\b\d{4}-\d{2}-\d{2}\b"),  # ISO dates - conservative, may over-match
}

# Keys whose *values* should always be redacted, regardless of pattern match.
_SENSITIVE_KEYS = {
    "name", "full_name", "applicant_name", "customer_name", "first_name", "last_name",
    "address", "street_address", "home_address",
    "email", "email_address",
    "phone", "phone_number", "mobile",
    "ssn", "social_security_number",
    "dob", "date_of_birth",
    "account_number", "account_no", "card_number",
    "ip_address",
}

REDACTION_TOKEN = "[REDACTED:{kind}]"


def _redact_string(value: str) -> tuple[str, bool]:
    redacted = False
    out = value
    for kind, pattern in _PATTERNS.items():
        def _sub(m, kind=kind):
            nonlocal redacted
            redacted = True
            return REDACTION_TOKEN.format(kind=kind)

        out = pattern.sub(_sub, out)
    return out, redacted


def redact_payload(payload: Any) -> tuple[Any, bool]:
    """
    Recursively redact a JSON-serializable structure (dict/list/str/scalar).
    Returns (redacted_payload, was_anything_redacted).
    """
    any_redacted = False

    def _walk(node: Any, parent_key: str | None = None) -> Any:
        nonlocal any_redacted
        if isinstance(node, dict):
            new = {}
            for k, v in node.items():
                if isinstance(k, str) and k.lower() in _SENSITIVE_KEYS and v is not None:
                    any_redacted = True
                    new[k] = REDACTION_TOKEN.format(kind=k.upper())
                else:
                    new[k] = _walk(v, parent_key=k)
            return new
        if isinstance(node, list):
            return [_walk(item, parent_key=parent_key) for item in node]
        if isinstance(node, str):
            new_str, was_redacted = _redact_string(node)
            if was_redacted:
                any_redacted = True
            return new_str
        return node

    return _walk(payload), any_redacted
