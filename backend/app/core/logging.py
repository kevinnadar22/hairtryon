#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: logging.py
Author: Maria Kevin
Created: 2025-11-21
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


import logging
import sys

from loguru import logger


class InterceptHandler(logging.Handler):
    """A logging handler that intercepts standard logging messages and redirects them to Loguru."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        frame, depth = logging.currentframe(), 2
        # find caller where logging was called
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back  # type: ignore
            depth += 1
        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging():
    """Set up logging configuration."""
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(logging.INFO)

    for name in (
        "uvicorn",
        "uvicorn.access",
        "uvicorn.error",
        "fastapi",
        "starlette",
    ):
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    logger.remove()

    logger.add("log/app.log", rotation="10 MB", retention="10 days", level="INFO")
    logger.add("log/error.log", rotation="10 MB", retention="30 days", level="ERROR")
    logger.add(sys.stdout, level="INFO", backtrace=True, diagnose=True)

    # add a Logfire sink

    logger.info("Logging is set up.")
