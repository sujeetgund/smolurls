from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    DATABASE_URL: str
    BASE_URL: str


try:
    settings = Settings()
except ValidationError as exc:
    raise RuntimeError(
        "DATABASE_URL and BASE_URL are required. Example: DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/smolurls BASE_URL=https://short.example.com"
    ) from exc


DATABASE_URL = settings.DATABASE_URL
BASE_URL = settings.BASE_URL.rstrip("/")
