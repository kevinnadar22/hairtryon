"""
Application entry point for running the Hair Try-On backend server.

This module configures the Python path and provides a CLI command to start
the Uvicorn development server with customizable host, port, and
reload options.
"""

import sys
from pathlib import Path

import click
import uvicorn

# Add app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))


@click.command()
@click.option("--host", default="127.0.0.1", help="Host to bind to")
@click.option("--port", default=8000, help="Port to bind to")
@click.option("--reload", is_flag=True, help="Enable auto-reload")
@click.option("--workers", default=1, help="Number of worker processes")
def run(host, port, reload, workers):
    """Run the development server"""
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,  # Changed from "app.main:app"
        workers=workers,
    )


if __name__ == "__main__":
    run()
