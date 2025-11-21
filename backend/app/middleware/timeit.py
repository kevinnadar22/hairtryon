#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: timeit.py
Author: Maria Kevin
Created: 2025-11-08
Description: Middleware to log the time taken for each request.
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"

import time

from fastapi import Request
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware


class TimeItMiddleware(BaseHTTPMiddleware):
    """Middleware to log the time taken for each request."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request: {request.url.path} completed in {process_time:.4f}s")
        return response
