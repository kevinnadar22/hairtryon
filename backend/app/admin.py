#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: admin.py
Author: Maria Kevin
Created: 2025-11-08
Description: Admin interface for managing application data using SQLAdmin.
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.config import settings
from models import BlackListTokens, GeneratedImage, Styles, User
from sqladmin import ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from utils import create_access_token, decode_access_token


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        if username != settings.ADMIN_USERNAME or password != settings.ADMIN_PASSWORD:
            return False

        token_data = {"sub": username}
        token = create_access_token(
            token_data, expires_delta_minutes=60 * 60
        )  # 1 hour validity
        request.session.update({"token": token})
        return True

    async def logout(self, request: Request) -> bool:
        # Usually you'd want to just clear the session
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token:
            return False
        payload = decode_access_token(token)
        if not payload:
            return False
        if payload.get("sub") != settings.ADMIN_USERNAME:
            return False
        # Check the token in depth
        return True


class UserAdmin(ModelView, model=User):  # type: ignore
    column_list = [User.id, User.name, User.email, User.userpic]
    column_searchable_list = [User.name, User.email]
    column_sortable_list = [User.id, User.name, User.email]


class StylesAdmin(ModelView, model=Styles):  # type: ignore
    column_list = [
        Styles.id,
        Styles.name,
        # Styles.prompt,
        # Styles.image_url,
        Styles.category,
        Styles.description,
    ]
    column_searchable_list = [Styles.name, Styles.category]


class GeneratedImageAdmin(ModelView, model=GeneratedImage):  # type: ignore
    column_list = [
        GeneratedImage.id,
        GeneratedImage.description,
        GeneratedImage.user_id,
        GeneratedImage.style_id,
        # GeneratedImage.input_image_url,
        # GeneratedImage.output_image_url,
        GeneratedImage.created_at,
        GeneratedImage.status,
        GeneratedImage.time_taken,
        GeneratedImage.liked,
    ]

    column_searchable_list = [GeneratedImage.description]
    column_sortable_list = [
        GeneratedImage.id,
        GeneratedImage.created_at,
        GeneratedImage.status,
    ]
    column_default_sort = (GeneratedImage.created_at, True)


class BlackListTokensAdmin(ModelView, model=BlackListTokens):  # type: ignore
    column_list = [
        BlackListTokens.id,
        BlackListTokens.jti,
        BlackListTokens.blacklisted_on,
    ]


admin_views = [UserAdmin, StylesAdmin, GeneratedImageAdmin, BlackListTokensAdmin]
admin_authentication = AdminAuth(secret_key=settings.SECRET_KEY)
