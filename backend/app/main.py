from app.logging_config import setup_logging

setup_logging()  # configure logging before anything else imports it

import logging
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database import connect, disconnect
from app.middleware.request_logging import RequestLoggingMiddleware
from app.routes import status, blogs, contact, subscribe

logger = logging.getLogger(__name__)

app = FastAPI(title="RolPlay API")

# ── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(status.router, prefix="/api")
app.include_router(blogs.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(subscribe.router, prefix="/api")

# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    logger.info("Starting RolPlay API")
    await connect()
    logger.info("RolPlay API ready")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down RolPlay API")
    await disconnect()
