"""
Image status enumeration.

This module defines the status values for image generation workflow tracking.
"""

from enum import Enum


class ImageStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
