import re
from pathlib import Path

import aiohttp
from core.config import settings
from loguru import logger
from pydantic import EmailStr


async def send_mail_async(
    subject: str, email: EmailStr, body: dict, template_name: str
):
    html_content = render_template(template_name, **body)

    brevo_api_key = settings.BREVO_API_KEY  # Assuming BREVO_API_KEY is in settings
    sender_email = settings.MAIL_FROM

    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {
            "name": settings.MAIL_FROM_NAME,  # Assuming MAIL_FROM_NAME is in settings
            "email": sender_email,
        },
        "to": [
            {
                "email": email,
                "name": str(email).split("@")[0],  # Simple way to get a name from email
            }
        ],
        "subject": subject,
        "htmlContent": html_content,
    }
    headers = {
        "api-key": brevo_api_key,
        "accept": "application/json",
        "content-type": "application/json",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers) as response:
            # log properly
            logger.info(f"Email sent to {email} with subject {subject}")
            logger.info(f"Response: {response.status}")
            logger.info(f"Response body: {await response.json()}")


def render_template(template_name: str, **kwargs: dict) -> str:
    template_path = Path("app/templates/" + template_name)
    if not template_path.is_file():
        raise FileNotFoundError(f"Template file not found: {template_path}")

    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()

    # Replace template variables using regex to handle varying whitespace
    # Pattern matches: {{ key }}, {{key}}, {{  key  }}, etc.
    for key, value in kwargs.items():
        pattern = r"{{\s*" + re.escape(key) + r"\s*}}"
        template_content = re.sub(pattern, str(value), template_content)

    return template_content
