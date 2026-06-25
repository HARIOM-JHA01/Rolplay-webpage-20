import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")


def _require(key: str) -> str:
    value = os.environ.get(key, "")
    if not value:
        raise RuntimeError(f"Required environment variable '{key}' is not set")
    return value


MONGO_URL: str = _require("MONGO_URL")
DB_NAME: str = _require("DB_NAME")

ADMIN_API_KEY: str = os.environ.get("ADMIN_API_KEY", "")
CORS_ORIGINS: list[str] = os.environ.get("CORS_ORIGINS", "*").split(",")
SITE_URL: str = os.environ.get("SITE_URL", "https://rolplay.ai")

MAILGUN_API_KEY: str = os.environ.get("MAILGUN_API_KEY", "")
MAILGUN_DOMAIN: str = os.environ.get("MAILGUN_DOMAIN", "")
MAILGUN_FROM: str = os.environ.get("MAILGUN_FROM", "RolPlay <noreply@rolplay.ai>")

HUBSPOT_ACCESS_TOKEN: str = os.environ.get("HUBSPOT_ACCESS_TOKEN", "")

NOTIFICATION_EMAILS: list[str] = [
    r.strip()
    for r in os.environ.get("NOTIFICATION_EMAILS", "").split(",")
    if r.strip()
]
