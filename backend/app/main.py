"""
FastAPI application for Hair Try-On API.

This module serves as the main entry point for the FastAPI application.
It configures middleware, sets up logging, and includes API routers.

Routes included:
- /: HTML welcome page with Google authentication button
- /api/v1/*: All API v1 routes (auth, files upload, image generation, user
management)
"""

import logging

from admin import admin_authentication, admin_views
from api.router import router as api_router
from db import Base, engine
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from middleware import setup_middlewares
from sqladmin import Admin

from app.core.logging import setup_logging

setup_logging()

logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI()
admin = Admin(app, engine, authentication_backend=admin_authentication)

for view in admin_views:
    admin.add_view(view)


setup_middlewares(app)
app.include_router(api_router)


@app.get("/", response_class=HTMLResponse)
def read_root():
    # return a html which redirects to /api/v1/auth/google upon clicking a
    return """
    <html>
        <head>
            <title>Welcome</title>
        </head>
        <body>
            <h1>Welcome to the Hair Try-On API</h1>
            <p>Click the button below to authenticate with Google:</p>
            <form action="/api/v1/auth/google" method="get">
                <button type="submit">Login with Google</button>
            </form>
        </body>
    </html>
    """
