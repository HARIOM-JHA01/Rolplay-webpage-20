import logging
import math
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Query
from app.config import ADMIN_API_KEY, SITE_URL
from app.database import get_db
from app.helpers import slugify, calc_reading_time, unique_slug
from app.models import BlogCreate, CommentCreate
from app.services import subscriber_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/blogs")


@router.get("/tags")
async def get_blog_tags():
    db = get_db()
    pipeline = [
        {"$match": {"published": True}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$project": {"_id": 0, "tag": "$_id", "count": 1}},
    ]
    tags = await db.blogs.aggregate(pipeline).to_list(None)
    logger.debug("Blog tags fetched count=%d", len(tags))
    return tags


@router.get("")
async def list_blogs(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    tags: Optional[str] = None,
):
    db = get_db()
    query: dict = {"published": True}
    if search:
        query["$text"] = {"$search": search}
    if tags:
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
        if tag_list:
            query["tags"] = {"$in": tag_list}

    total = await db.blogs.count_documents(query)
    total_pages = max(1, math.ceil(total / limit))
    skip = (page - 1) * limit

    docs = await db.blogs.find(query, {"_id": 0, "content": 0}).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
    logger.debug("Blogs listed page=%d limit=%d total=%d search=%r tags=%r", page, limit, total, search, tags)
    return {"success": True, "data": docs, "pagination": {"page": page, "limit": limit, "total": total, "totalPages": total_pages}}


@router.get("/{slug}/related")
async def get_related_blogs(slug: str, limit: int = Query(3, ge=1, le=10)):
    db = get_db()
    post = await db.blogs.find_one({"slug": slug, "published": True}, {"tags": 1})
    if not post:
        return []
    post_tags = post.get("tags", [])
    if not post_tags:
        return []
    docs = await db.blogs.find(
        {"published": True, "slug": {"$ne": slug}, "tags": {"$in": post_tags}},
        {"_id": 0, "title": 1, "slug": 1, "tags": 1, "createdAt": 1},
    ).sort("createdAt", -1).limit(limit).to_list(limit)
    logger.debug("Related blogs fetched for slug=%s count=%d", slug, len(docs))
    return docs


@router.post("/{slug}/view")
async def increment_view(slug: str):
    db = get_db()
    await db.blogs.update_one({"slug": slug}, {"$inc": {"views": 1}})
    logger.info("View incremented slug=%s", slug)
    return {"success": True}


@router.post("/{slug}/like")
async def like_blog(slug: str):
    db = get_db()
    result = await db.blogs.find_one_and_update(
        {"slug": slug, "published": True},
        {"$inc": {"likes": 1}},
        return_document=True,
        projection={"likes": 1},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    likes = result.get("likes", 1)
    logger.info("Blog liked slug=%s total_likes=%d", slug, likes)
    return {"success": True, "likes": likes}


@router.get("/{slug}/comments")
async def get_comments(slug: str):
    db = get_db()
    docs = await db.comments.find({"slug": slug}, {"_id": 0, "slug": 0}).sort("createdAt", 1).to_list(200)
    logger.debug("Comments fetched slug=%s count=%d", slug, len(docs))
    return {"success": True, "data": docs}


@router.post("/{slug}/comments", status_code=201)
async def add_comment(slug: str, payload: CommentCreate):
    db = get_db()
    exists = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 1})
    if not exists:
        raise HTTPException(status_code=404, detail="Not found")
    doc = {
        "slug":      slug,
        "name":      payload.name.strip(),
        "email":     payload.email.strip() if payload.email else None,
        "body":      payload.body.strip(),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.comments.insert_one(doc)
    doc.pop("_id", None)
    doc.pop("slug", None)
    logger.info("Comment added slug=%s author=%r", slug, doc["name"])
    return {"success": True, "data": doc}


@router.get("/{slug}")
async def get_blog(slug: str):
    db = get_db()
    doc = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    logger.debug("Blog fetched slug=%s", slug)
    return {"success": True, "data": doc}


@router.post("/create", status_code=201)
async def create_blog(
    payload: BlogCreate,
    background_tasks: BackgroundTasks,
    x_api_key: Optional[str] = Header(default=None),
):
    if not ADMIN_API_KEY or x_api_key != ADMIN_API_KEY:
        logger.warning("Unauthorized blog create attempt")
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = get_db()
    base = slugify(payload.title)
    if not base:
        raise HTTPException(status_code=400, detail="Title produces an empty slug")

    slug = await unique_slug(base)
    reading_time = calc_reading_time(payload.content)
    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "title":       payload.title,
        "slug":        slug,
        "summary":     payload.summary,
        "content":     payload.content,
        "coverImage":  payload.coverImage,
        "tags":        payload.tags,
        "source":      payload.source,
        "published":   payload.published,
        "views":       0,
        "readingTime": reading_time,
        "createdAt":   now,
        "updatedAt":   now,
    }
    await db.blogs.insert_one(doc)
    logger.info("Blog created slug=%s title=%r published=%s", slug, payload.title, payload.published)

    if payload.published:
        background_tasks.add_task(
            subscriber_email.send_new_post_emails,
            payload.title, payload.summary, slug, payload.coverImage, reading_time,
        )

    return {"success": True, "data": {"slug": slug, "url": f"{SITE_URL}/blog/{slug}"}}
