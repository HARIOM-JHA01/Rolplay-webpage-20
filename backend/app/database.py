import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import MONGO_URL, DB_NAME

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialised — call connect() first")
    return db


async def connect() -> None:
    global _client, db
    logger.info("Connecting to MongoDB (db=%s)", DB_NAME)
    _client = AsyncIOMotorClient(MONGO_URL)
    db = _client[DB_NAME]
    await _ensure_indexes()
    logger.info("MongoDB connected and indexes ensured")


async def disconnect() -> None:
    global _client, db
    if _client:
        logger.info("Closing MongoDB connection")
        _client.close()
        _client = None
        db = None


async def _ensure_indexes() -> None:
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("tags")
    await db.blogs.create_index([("published", 1), ("createdAt", -1)])
    await db.blogs.create_index([("createdAt", -1)])
    await db.blogs.create_index([("title", "text"), ("summary", "text")])
    await db.subscribers.create_index("email", unique=True)
    await db.subscribers.create_index([("createdAt", -1)])
    await db.contacts.create_index([("createdAt", -1)])
    await db.contacts.create_index("email")
    await db.comments.create_index([("slug", 1), ("createdAt", -1)])
    await db.comments.create_index("slug")
