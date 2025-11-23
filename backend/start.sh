#!/bin/sh
set -e

# Run migrations
uv run alembic -c app/alembic.ini upgrade head
