"""SMTP mailer (best-effort: no-op if SMTP not configured)."""
from __future__ import annotations

import smtplib
from email.message import EmailMessage

from app.core.config import settings
from app.core.logging import log


def send_email(*, to: list[str] | str, subject: str, body: str, html: str | None = None) -> bool:
    if not settings.SMTP_HOST:
        log.info("mailer.skipped", reason="SMTP not configured", to=to, subject=subject)
        return False
    recipients = [to] if isinstance(to, str) else list(to)
    msg = EmailMessage()
    msg["From"] = settings.SMTP_FROM
    msg["To"] = ", ".join(recipients)
    msg["Subject"] = subject
    msg.set_content(body)
    if html:
        msg.add_alternative(html, subtype="html")
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as s:
            if settings.SMTP_USE_TLS:
                s.starttls()
            if settings.SMTP_USER:
                s.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            s.send_message(msg)
        log.info("mailer.sent", to=recipients, subject=subject)
        return True
    except Exception as e:  # noqa: BLE001 - best effort, never block API on email
        log.warning("mailer.failed", error=str(e), to=recipients, subject=subject)
        return False
