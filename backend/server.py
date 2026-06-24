from fastapi import FastAPI, APIRouter, HTTPException, Header, BackgroundTasks, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import math
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _slugify(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

def _calc_reading_time(html: str) -> int:
    text = re.sub(r'<[^>]+>', '', html)
    word_count = len(text.split())
    return max(1, math.ceil(word_count / 200))

def _serialize_doc(doc: dict) -> dict:
    doc.pop('_id', None)
    return doc

async def _unique_slug(base: str) -> str:
    pattern = f"^{re.escape(base)}(-\\d+)?$"
    existing = await db.blogs.find({"slug": {"$regex": pattern}}, {"slug": 1}).to_list(None)
    if not existing:
        return base
    taken = {d['slug'] for d in existing}
    i = 1
    while f"{base}-{i}" in taken:
        i += 1
    return f"{base}-{i}"

async def _ensure_indexes():
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


# ── Pydantic models ───────────────────────────────────────────────────────────

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class BlogCreate(BaseModel):
    title: str = Field(..., max_length=200)
    summary: str = Field(..., max_length=500)
    content: str
    coverImage: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    source: Optional[str] = None
    published: bool = True

class SubscriberCreate(BaseModel):
    email: EmailStr
    locale: str = "en"
    source: str = "footer"

class CommentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    body: str = Field(..., min_length=1, max_length=2000)

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    company: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=5000)


# ── Email helpers (fire-and-forget) ──────────────────────────────────────────

def _send_welcome_email(email: str, locale: str):
    try:
        import resend
        resend.api_key = os.environ.get('RESEND_API_KEY', '')
        site_url = os.environ.get('SITE_URL', 'https://rolplay.ai')
        subjects = {
            "es": "¡Gracias por suscribirte al blog de RolPlay!",
            "fr": "Merci de vous être abonné au blog RolPlay !",
        }
        subject = subjects.get(locale, "Thanks for subscribing to the RolPlay blog!")
        resend.Emails.send({
            "from": "RolPlay <noreply@rolplay.ai>",
            "to": email,
            "subject": subject,
            "html": f"""
<div style="background:#0A0A0E;padding:40px 20px;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#111115;border:1px solid #222;border-radius:12px;padding:40px;">
    <h1 style="color:#fff;margin:0 0 8px;">
      <span style="color:#C0392B;">Rol</span>Play
    </h1>
    <p style="color:#A1A1AA;margin:0 0 24px;">{subject}</p>
    <a href="{site_url}/blog" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
      Read the Blog →
    </a>
  </div>
</div>
""",
        })
    except Exception:
        logger.exception("Welcome email failed for %s", email)


def _send_new_post_emails(title: str, summary: str, slug: str, cover_image: Optional[str], reading_time: int):
    try:
        import resend
        resend.api_key = os.environ.get('RESEND_API_KEY', '')
        site_url = os.environ.get('SITE_URL', 'https://rolplay.ai')
        post_url = f"{site_url}/blog/{slug}"

        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient as _Client
        _c = _Client(os.environ['MONGO_URL'])
        _db = _c[os.environ['DB_NAME']]

        async def _fetch():
            return await _db.subscribers.find({"confirmed": True}, {"email": 1, "locale": 1, "unsubscribeToken": 1}).to_list(None)

        loop = asyncio.new_event_loop()
        try:
            subs = loop.run_until_complete(_fetch())
        finally:
            loop.close()
            _c.close()

        subjects_en = f"New on the RolPlay Blog: {title}"
        subjects_es = f"Nuevo en el Blog de RolPlay: {title}"
        subjects_fr = f"Nouveau sur le Blog RolPlay : {title}"

        def _subject(locale):
            if locale == 'es':
                return subjects_es
            if locale == 'fr':
                return subjects_fr
            return subjects_en

        def _cta(locale):
            if locale == 'es':
                return "Leer artículo →"
            if locale == 'fr':
                return "Lire l'article →"
            return "Read article →"

        cover_html = f'<img src="{cover_image}" style="width:100%;border-radius:8px;margin-bottom:20px;" />' if cover_image else ''

        def _body(sub):
            unsub_url = f"{post_url}?unsubscribe={sub.get('unsubscribeToken','')}"
            locale = sub.get('locale', 'en')
            return f"""
<div style="background:#0A0A0E;padding:40px 20px;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#111115;border:1px solid #222;border-radius:12px;padding:40px;">
    <h1 style="color:#fff;margin:0 0 20px;font-size:13px;letter-spacing:.15em;text-transform:uppercase;">
      <span style="color:#C0392B;">Rol</span>Play
    </h1>
    {cover_html}
    <p style="color:#C0392B;font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px;">New Post</p>
    <h2 style="color:#fff;margin:0 0 12px;font-size:22px;line-height:1.3;">{title}</h2>
    <p style="color:#A1A1AA;font-size:13px;margin:0 0 20px;">{reading_time} min read</p>
    <p style="color:#A1A1AA;margin:0 0 28px;line-height:1.6;">{summary}</p>
    <a href="{post_url}" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
      {_cta(locale)}
    </a>
    <p style="color:#52525B;font-size:11px;margin:32px 0 0;">
      <a href="{unsub_url}" style="color:#52525B;">Unsubscribe</a>
    </p>
  </div>
</div>
"""

        BATCH = 100
        for i in range(0, len(subs), BATCH):
            batch = subs[i:i + BATCH]
            messages = [
                {
                    "from": "RolPlay <noreply@rolplay.ai>",
                    "to": sub['email'],
                    "subject": _subject(sub.get('locale', 'en')),
                    "html": _body(sub),
                }
                for sub in batch
            ]
            resend.Batch.send(messages)
    except Exception:
        logger.exception("New-post email broadcast failed for slug=%s", slug)


# ── Mailgun helper ───────────────────────────────────────────────────────────

def _mailgun_send(to: list[str], subject: str, html: str):
    api_key = os.environ.get('MAILGUN_API_KEY', '')
    domain  = os.environ.get('MAILGUN_DOMAIN', '')
    from_   = os.environ.get('MAILGUN_FROM', 'RolPlay <noreply@rolplay.ai>')
    if not api_key or not domain:
        logger.warning("Mailgun not configured — skipping email send")
        return
    import requests as _req
    for recipient in to:
        resp = _req.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            auth=("api", api_key),
            data={"from": from_, "to": recipient, "subject": subject, "html": html},
            timeout=10,
        )
        if not resp.ok:
            logger.error("Mailgun error %s for %s: %s", resp.status_code, recipient, resp.text)


# ── Contact helpers (fire-and-forget) ────────────────────────────────────────

def _notify_team_contact(name: str, email: str, company: str, message: str):
    recipients = [
        r.strip()
        for r in os.environ.get('NOTIFICATION_EMAILS', '').split(',')
        if r.strip()
    ]
    if not recipients:
        return
    company_row = f"<tr><td style='color:#71717A;padding:6px 0;'>Company</td><td style='color:#fff;padding:6px 0;'>{company}</td></tr>" if company else ""
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
        _mailgun_send(recipients, f"New contact from {name} — RolPlay", html)
    except Exception:
        logger.exception("Team notification email failed for contact from %s", email)


def _push_contact_to_hubspot(name: str, email: str, company: str, message: str):
    token = os.environ.get('HUBSPOT_ACCESS_TOKEN', '')
    if not token:
        logger.warning("HUBSPOT_ACCESS_TOKEN not set — skipping HubSpot sync")
        return
    import requests as _req

    first, *rest = name.strip().split(' ', 1)
    last = rest[0] if rest else ''

    properties = {
        "email": email,
        "firstname": first,
        "lastname": last,
        "company": company or '',
        "message": message,
        "hs_lead_status": "NEW",
    }

    resp = _req.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"properties": properties},
        timeout=10,
    )

    if resp.status_code == 409:
        # Contact already exists — update instead
        contact_id = resp.json().get("message", "").split(" ")[-1]
        if not contact_id:
            existing = _req.get(
                f"https://api.hubapi.com/crm/v3/objects/contacts/{email}?idProperty=email",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
            if existing.ok:
                contact_id = existing.json().get("id")
        if contact_id:
            _req.patch(
                f"https://api.hubapi.com/crm/v3/objects/contacts/{contact_id}",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json={"properties": {k: v for k, v in properties.items() if k != "email"}},
                timeout=10,
            )
    elif not resp.ok:
        logger.error("HubSpot contact push failed %s: %s", resp.status_code, resp.text)


# ── Status routes (existing) ──────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ── Blog routes ───────────────────────────────────────────────────────────────

@api_router.get("/blogs/tags")
async def get_blog_tags():
    pipeline = [
        {"$match": {"published": True}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$project": {"_id": 0, "tag": "$_id", "count": 1}},
    ]
    tags = await db.blogs.aggregate(pipeline).to_list(None)
    return tags


@api_router.get("/blogs")
async def list_blogs(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    tags: Optional[str] = None,
):
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

    exclude = {"_id": 0, "content": 0}
    cursor = db.blogs.find(query, exclude).sort("createdAt", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)

    return {
        "success": True,
        "data": docs,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": total_pages,
        },
    }


@api_router.get("/blogs/{slug}/related")
async def get_related_blogs(slug: str, limit: int = Query(3, ge=1, le=10)):
    post = await db.blogs.find_one({"slug": slug, "published": True}, {"tags": 1})
    if not post:
        return []
    tags = post.get("tags", [])
    if not tags:
        return []
    query = {"published": True, "slug": {"$ne": slug}, "tags": {"$in": tags}}
    projection = {"_id": 0, "title": 1, "slug": 1, "tags": 1, "createdAt": 1}
    docs = await db.blogs.find(query, projection).sort("createdAt", -1).limit(limit).to_list(limit)
    return docs


@api_router.post("/blogs/{slug}/view")
async def increment_view(slug: str):
    await db.blogs.update_one({"slug": slug}, {"$inc": {"views": 1}})
    return {"success": True}


@api_router.post("/blogs/{slug}/like")
async def like_blog(slug: str):
    result = await db.blogs.find_one_and_update(
        {"slug": slug, "published": True},
        {"$inc": {"likes": 1}},
        return_document=True,
        projection={"likes": 1},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True, "likes": result.get("likes", 1)}


@api_router.get("/blogs/{slug}/comments")
async def get_comments(slug: str):
    docs = await db.comments.find(
        {"slug": slug}, {"_id": 0, "slug": 0}
    ).sort("createdAt", 1).to_list(200)
    return {"success": True, "data": docs}


@api_router.post("/blogs/{slug}/comments", status_code=201)
async def add_comment(slug: str, payload: CommentCreate):
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
    return {"success": True, "data": doc}


@api_router.get("/blogs/{slug}")
async def get_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True, "data": doc}


@api_router.post("/blogs/create", status_code=201)
async def create_blog(
    payload: BlogCreate,
    background_tasks: BackgroundTasks,
    x_api_key: Optional[str] = Header(default=None),
):
    admin_key = os.environ.get('ADMIN_API_KEY', '')
    if not admin_key or x_api_key != admin_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    base_slug = _slugify(payload.title)
    if not base_slug:
        raise HTTPException(status_code=400, detail="Title produces an empty slug")

    slug = await _unique_slug(base_slug)
    reading_time = _calc_reading_time(payload.content)
    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "title": payload.title,
        "slug": slug,
        "summary": payload.summary,
        "content": payload.content,
        "coverImage": payload.coverImage,
        "tags": payload.tags,
        "source": payload.source,
        "published": payload.published,
        "views": 0,
        "readingTime": reading_time,
        "createdAt": now,
        "updatedAt": now,
    }
    await db.blogs.insert_one(doc)

    site_url = os.environ.get('SITE_URL', 'https://rolplay.ai')
    if payload.published:
        background_tasks.add_task(
            _send_new_post_emails,
            payload.title,
            payload.summary,
            slug,
            payload.coverImage,
            reading_time,
        )

    return {"success": True, "data": {"slug": slug, "url": f"{site_url}/blog/{slug}"}}


# ── Contact route ────────────────────────────────────────────────────────────

@api_router.post("/contact", status_code=201)
async def contact(payload: ContactCreate, background_tasks: BackgroundTasks):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "name":    payload.name,
        "email":   payload.email.lower(),
        "company": payload.company or '',
        "message": payload.message,
        "createdAt": now,
    }
    await db.contacts.insert_one(doc)

    background_tasks.add_task(
        _notify_team_contact,
        payload.name, payload.email, payload.company or '', payload.message,
    )
    background_tasks.add_task(
        _push_contact_to_hubspot,
        payload.name, payload.email, payload.company or '', payload.message,
    )
    return {"success": True}


# ── Subscribe route ───────────────────────────────────────────────────────────

@api_router.post("/subscribe", status_code=201)
async def subscribe(payload: SubscriberCreate, background_tasks: BackgroundTasks):
    email = payload.email.lower()
    locale = payload.locale if payload.locale in ("en", "es", "fr") else "en"
    source = payload.source if payload.source in ("footer", "blog", "homepage") else "footer"

    existing = await db.subscribers.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="already_subscribed")

    token = secrets.token_hex(32)
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "email": email,
        "locale": locale,
        "source": source,
        "confirmed": True,
        "unsubscribeToken": token,
        "createdAt": now,
        "updatedAt": now,
    }
    await db.subscribers.insert_one(doc)
    background_tasks.add_task(_send_welcome_email, email, locale)
    return {"success": True}


# ── App wiring ────────────────────────────────────────────────────────────────

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("startup")
async def startup():
    await _ensure_indexes()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
