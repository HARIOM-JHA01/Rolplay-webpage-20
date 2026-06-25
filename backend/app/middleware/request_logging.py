import logging
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("api.access")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())[:8]
        start = time.perf_counter()

        logger.info(
            "→ %s %s request_id=%s client=%s",
            request.method,
            request.url.path,
            request_id,
            request.client.host if request.client else "unknown",
        )

        response = await call_next(request)

        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "← %s %s status=%d duration=%.1fms request_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            request_id,
        )

        response.headers["X-Request-ID"] = request_id
        return response
