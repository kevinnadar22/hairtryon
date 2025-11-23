#!/bin/sh
set -e

cd app
uv run alembic upgrade head
