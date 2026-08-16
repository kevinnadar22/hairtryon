FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN pip install uv
RUN uv sync

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]