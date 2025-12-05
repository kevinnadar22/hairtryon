#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: prompt_builder.py
Author: Maria Kevin
Created: 2025-12-06
Description:
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from typing import Literal

VIEW_CONFIG = {
    "left": (
        "Portrait of the same person shown in the input headshot, rendered in matching age, "
        "skin tone, facial structure, hairstyle, and lighting. Show a clean left-profile view "
        "at 90 degrees. Preserve all identifiable features accurately without introducing new "
        "traits. Neutral background. High-resolution photorealism."
    ),
    "right": (
        "Portrait of the same person shown in the input headshot, matching all facial geometry, "
        "proportions, and hair details. Show a clean right-profile view at 90 degrees. Maintain "
        "the same lighting direction and photographic style. Neutral background. High-resolution "
        "photorealism."
    ),
    "back": (
        "Back-of-head portrait of the same person shown in the input headshot, matching hair "
        "length, density, shape, color, and neckline pattern. Show a straight back view at "
        "180 degrees. Preserve lighting and style consistency with the input. Neutral background. "
        "High-resolution photorealism."
    ),
}


def get_view_prompt(view: Literal["right", "left", "back"]):
    return VIEW_CONFIG[view]
