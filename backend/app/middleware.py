#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: middleware.py
Author: Maria Kevin
Created: 2025-11-22
Description: Middleware for FastAPI application
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.config import settings
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware


def setup_middlewares(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.SECRET_KEY,
        same_site="lax",
        https_only=False,  # use config
    )
