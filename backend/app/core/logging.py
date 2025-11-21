"""
Logging configuration for the application.

This module sets up structured logging for the FastAPI application,
including formatters for default and access logs.
"""

from logging.config import dictConfig

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d] — %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "access": {
            "format": "%(asctime)s — %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "access": {
            "class": "logging.StreamHandler",
            "formatter": "access",
        },
    },
    "loggers": {
        "uvicorn": {"handlers": ["default"], "level": "INFO"},
        "uvicorn.error": {"handlers": ["default"], "level": "INFO"},
        "uvicorn.access": {"handlers": ["access"], "level": "INFO"},
        "app": {"handlers": ["default"], "level": "DEBUG", "propagate": False},
    },
    "root": {"handlers": ["default"], "level": "INFO"},
}


def setup_logging():
    dictConfig(LOGGING_CONFIG)
