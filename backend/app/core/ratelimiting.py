#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: ratelimiting.py
Author: Maria Kevin
Created: 2025-11-21
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["40/minute"])


def setup_ratelimiting(app):
    app.state.limiter = limiter
    app.add_exception_handler(429, handler=_rate_limit_exceeded_handler)  # type: ignore
    app.add_middleware(SlowAPIMiddleware)
    logger.info("Rate limiting has been set up.")
