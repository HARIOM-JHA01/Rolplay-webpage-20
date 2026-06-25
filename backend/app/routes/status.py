import logging
from datetime import datetime
from typing import List

from fastapi import APIRouter
from app.database import get_db
from app.models import StatusCheck, StatusCheckCreate

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    db = get_db()
    status_obj = StatusCheck(**payload.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    logger.info("Status check created client=%s id=%s", status_obj.client_name, status_obj.id)
    return status_obj


@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    db = get_db()
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    logger.debug("Status checks fetched count=%d", len(checks))
    return checks
