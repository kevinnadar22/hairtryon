"""
Helper utilities for file and image operations.

This module provides utility functions for downloading images from URLs
and extracting file metadata.
"""

import mimetypes
import os
import tempfile
import uuid

import aiohttp


async def save_image_from_url(image_url: str) -> str:
    """
    Downloads an image from the given URL and saves it to a temporary file.
    Returns the path to the temporary file.
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(image_url) as response:
            if response.status != 200:
                raise Exception(f"Failed to download image: {response.status}")
            img_data = await response.read()

    temp_dir  = tempfile.gettempdir()
    ext = get_extension_from_url(image_url, default=".jpg")
    filename = str(uuid.uuid4()) + ext

    temp_file_path = os.path.join(temp_dir, filename)
    with open(temp_file_path, "wb") as f:
        f.write(img_data)
    return temp_file_path


def get_extension_from_url(url: str, default: str = ".jpg") -> str:
    """
    Extracts the file extension from a given URL.
    Input:
    - url: The URL string to extract the extension from.
    - default: The default extension to return if none is found.
    Returns the file extension including the dot (e.g., '.jpg').
    """
    parsed_url = url.split("?")[0]  # Remove query parameters
    _, ext = os.path.splitext(parsed_url)
    return ext if ext else default


def get_file_info(file_path: str) -> dict:
    """
    Returns basic information about the file such as size and name.
    """

    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"No such file: {file_path}")

    file_info = {
        "name": os.path.basename(file_path),
        "size": os.path.getsize(file_path),
        "path": file_path,
        "data": open(file_path, "rb").read(),
        "mime": mimetypes.guess_type(file_path)[0],
    }
    return file_info
