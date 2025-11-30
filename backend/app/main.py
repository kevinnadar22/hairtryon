"""
FastAPI application for Hair Try-On API.

This module serves as the main entry point for the FastAPI application.
It configures middleware, sets up logging, and includes API routers.

Routes included:
- /api/v1/*: All API v1 routes (auth, files upload, image generation, user
management)
"""

from fastapi import FastAPI
from sqladmin import Admin

from admin import admin_authentication, admin_views
from api.router import router as api_router
from core.config import settings
from core.exceptions import setup_exception_handler
from core.lifespan import lifespan
from core.logging import setup_logging
from core.middleware import setup_middlewares
from core.ratelimiting import setup_ratelimiting
from core.telementry import init_telemetry
from db import engine

setup_logging()


app = FastAPI(
    responses={429: {"error": "Too Many Requests - Rate limit exceeded"}},
    debug=not settings.IS_PROD,
    title="Hair Try-On API",
    description="API for Hair Try-On",
    version="1.0.0",
    openapi_url=None if settings.IS_PROD else "/openapi.json",
    docs_url=None if settings.IS_PROD else "/docs",
    redoc_url=None if settings.IS_PROD else "/redoc",
    lifespan=lifespan,
)
admin = Admin(app, engine, authentication_backend=admin_authentication)

for view in admin_views:
    admin.add_view(view)


init_telemetry(app, engine=engine, logfire_token=settings.LOGFIRE_TOKEN)
setup_ratelimiting(app)
setup_middlewares(app)
setup_exception_handler(app, is_production=settings.IS_PROD)
app.include_router(api_router)
