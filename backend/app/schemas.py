from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field


class ShortenRequest(BaseModel):
    url: AnyHttpUrl
    custom_alias: str | None = Field(default=None, min_length=3, max_length=32)


class ShortURLResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    long_url: str
    short_url: str
    created_at: datetime


class ShortURLInfoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    long_url: str
    short_url: str
    created_at: datetime
    total_clicks: int


class ClickEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    clicked_at: datetime
    ip_address: str | None
    user_agent: str | None
    referrer: str | None


class URLAnalyticsResponse(BaseModel):
    id: str
    short_url: str
    long_url: str
    total_clicks: int
    events: list[ClickEventResponse]
