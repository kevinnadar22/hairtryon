"""
Style category enumeration.

This module defines the category values for hairstyle classification.
"""

from enum import Enum


class StyleCategory(str, Enum):
    standard = "standard"
    celebrity = "celebrity"
