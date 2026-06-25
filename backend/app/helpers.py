import math
import re
from app.database import get_db


def slugify(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def calc_reading_time(html: str) -> int:
    text = re.sub(r"<[^>]+>", "", html)
    word_count = len(text.split())
    return max(1, math.ceil(word_count / 200))


async def unique_slug(base: str) -> str:
    db = get_db()
    pattern = f"^{re.escape(base)}(-\\d+)?$"
    existing = await db.blogs.find({"slug": {"$regex": pattern}}, {"slug": 1}).to_list(None)
    if not existing:
        return base
    taken = {d["slug"] for d in existing}
    i = 1
    while f"{base}-{i}" in taken:
        i += 1
    return f"{base}-{i}"
