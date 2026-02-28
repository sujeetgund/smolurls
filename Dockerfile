FROM python:3.13-slim-bookworm

RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip \
	&& pip install --no-cache-dir uv

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PORT=8080

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .

RUN uv sync --frozen --no-dev

EXPOSE 8080

CMD ["sh", "-c", "uv run uvicorn main:app --log-level info --host 0.0.0.0 --port ${PORT}"]
