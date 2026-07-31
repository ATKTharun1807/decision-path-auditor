"""
PII Redaction Engine for AuditAI.
Sanitizes Social Security Numbers, Credit Cards, Emails, and sensitive keys.
"""
from __future__ import annotations

import json
import re
from typing import Any

# Regex patterns for common PII
SSN_PATTERN = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
CREDIT_CARD_PATTERN = re.compile(r"\b(?:\d[ -]*?){13,16}\b")
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")

# Dict keys whose values must always be redacted
SENSITIVE_KEY_SUBSTRINGS = (
    "password",
    "ssn",
    "social_security",
    "secret",
    "credit_card",
    "card_number",
    "tax_id",
    "api_key",
    "auth_token",
)


def redact_text(text: str) -> tuple[str, bool]:
    redacted = False

    new_text = SSN_PATTERN.sub("[REDACTED_SSN]", text)
    if new_text != text:
        redacted = True
        text = new_text

    new_text = CREDIT_CARD_PATTERN.sub("[REDACTED_CREDIT_CARD]", text)
    if new_text != text:
        redacted = True
        text = new_text

    new_text = EMAIL_PATTERN.sub("[REDACTED_EMAIL]", text)
    if new_text != text:
        redacted = True
        text = new_text

    return text, redacted


def _redact_obj(obj: Any) -> tuple[Any, bool]:
    redacted = False

    if isinstance(obj, str):
        return redact_text(obj)

    if isinstance(obj, dict):
        new_dict: dict[str, Any] = {}
        for key, val in obj.items():
            key_lower = str(key).lower()
            if any(s in key_lower for s in SENSITIVE_KEY_SUBSTRINGS):
                new_dict[key] = "[REDACTED_KEY_VALUE]"
                redacted = True
            else:
                cleaned_val, was_red = _redact_obj(val)
                new_dict[key] = cleaned_val
                if was_red:
                    redacted = True
        return new_dict, redacted

    if isinstance(obj, list):
        new_list: list[Any] = []
        for item in obj:
            cleaned_item, was_red = _redact_obj(item)
            new_list.append(cleaned_item)
            if was_red:
                redacted = True
        return new_list, redacted

    return obj, False


def redact_payload(payload: dict[str, Any] | list[Any]) -> tuple[str, bool]:
    cleaned_obj, was_redacted = _redact_obj(payload)
    return json.dumps(cleaned_obj, default=str), was_redacted
