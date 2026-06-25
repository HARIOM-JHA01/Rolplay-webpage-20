import logging
import requests
from app.config import MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM

logger = logging.getLogger(__name__)


def send(to: list[str], subject: str, html: str) -> None:
    if not MAILGUN_API_KEY or not MAILGUN_DOMAIN:
        logger.warning("Mailgun not configured (MAILGUN_API_KEY / MAILGUN_DOMAIN missing) — skipping send")
        return

    for recipient in to:
        resp = requests.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={"from": MAILGUN_FROM, "to": recipient, "subject": subject, "html": html},
            timeout=10,
        )
        if resp.ok:
            logger.info("Mailgun email sent to=%s subject=%r", recipient, subject)
        else:
            logger.error(
                "Mailgun send failed to=%s status=%s body=%s",
                recipient, resp.status_code, resp.text,
            )
