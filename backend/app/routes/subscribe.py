import logging
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.database import get_db
from app.models import SubscriberCreate
from app.services import subscriber_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/subscribe")


@router.post("", status_code=201)
async def subscribe(payload: SubscriberCreate, background_tasks: BackgroundTasks):
    db = get_db()
    email = payload.email.lower()
    locale = payload.locale if payload.locale in ("en", "es", "fr") else "en"
    source = payload.source if payload.source in ("footer", "blog", "homepage") else "footer"

    existing = await db.subscribers.find_one({"email": email})
    if existing:
        logger.info("Duplicate subscribe attempt email=%s", email)
        raise HTTPException(status_code=409, detail="already_subscribed")

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "email":            email,
        "locale":           locale,
        "source":           source,
        "confirmed":        True,
        "unsubscribeToken": secrets.token_hex(32),
        "createdAt":        now,
        "updatedAt":        now,
    }
    await db.subscribers.insert_one(doc)
    logger.info("New subscriber email=%s locale=%s source=%s", email, locale, source)

    background_tasks.add_task(subscriber_email.send_welcome_email, email, locale)
    return {"success": True}
