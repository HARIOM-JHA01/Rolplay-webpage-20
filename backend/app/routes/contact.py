import logging
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks
from app.config import NOTIFICATION_EMAILS
from app.database import get_db
from app.models import ContactCreate
from app.services import mailgun, hubspot

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact")


@router.post("", status_code=201)
async def contact(payload: ContactCreate, background_tasks: BackgroundTasks):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "name":      payload.name,
        "email":     payload.email.lower(),
        "company":   payload.company or "",
        "message":   payload.message,
        "createdAt": now,
    }
    await db.contacts.insert_one(doc)
    logger.info("Contact saved name=%r email=%s company=%r", payload.name, payload.email, payload.company)

    background_tasks.add_task(_notify_team, payload.name, payload.email, payload.company or "", payload.message)
    background_tasks.add_task(hubspot.push_contact, payload.name, payload.email, payload.company or "", payload.message)
    return {"success": True}


def _notify_team(name: str, email: str, company: str, message: str) -> None:
    if not NOTIFICATION_EMAILS:
        logger.debug("No NOTIFICATION_EMAILS configured — skipping team notification")
        return
    company_row = (
        f"<tr><td style='color:#71717A;padding:6px 0;'>Company</td>"
        f"<td style='color:#fff;padding:6px 0;'>{company}</td></tr>"
        if company else ""
    )
    html = f"""
<div style="background:#0A0A0E;padding:40px 20px;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#111115;border:1px solid #222;border-radius:12px;padding:40px;">
    <h1 style="color:#fff;margin:0 0 4px;font-size:13px;letter-spacing:.15em;text-transform:uppercase;">
      <span style="color:#C0392B;">Rol</span>Play
    </h1>
    <p style="color:#C0392B;font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 24px;">New Contact Form Submission</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="color:#71717A;padding:6px 0;">Name</td><td style="color:#fff;padding:6px 0;">{name}</td></tr>
      <tr><td style="color:#71717A;padding:6px 0;">Email</td><td style="color:#fff;padding:6px 0;">{email}</td></tr>
      {company_row}
    </table>
    <div style="margin-top:20px;padding:16px;background:#0A0A0E;border:1px solid #222;border-radius:8px;">
      <p style="color:#71717A;font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px;">Message</p>
      <p style="color:#A1A1AA;margin:0;line-height:1.6;">{message}</p>
    </div>
    <p style="color:#52525B;font-size:11px;margin:24px 0 0;">Sent via rolplay.ai contact form</p>
  </div>
</div>
"""
    try:
        mailgun.send(NOTIFICATION_EMAILS, f"New contact from {name} — RolPlay", html)
    except Exception:
        logger.exception("Team notification email failed for contact from email=%s", email)
