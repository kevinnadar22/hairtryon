#!/bin/sh
set -e

cd /app/app
alembic upgrade head
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
