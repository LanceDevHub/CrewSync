from datetime import datetime

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=10, max_length=2000)
    location: str = Field(min_length=2, max_length=255)
    genre: str | None = Field(default=None, max_length=100)
    event_date: datetime
    max_participants: int | None = Field(default=None, gt=0)


class EventRead(BaseModel):
    id: int
    creator_id: int
    title: str
    description: str
    location: str
    genre: str | None
    event_date: datetime
    max_participants: int | None
    created_at: datetime
    updated_at: datetime

class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=150)
    description: str | None = Field(default=None, min_length=10, max_length=2000)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    genre: str | None = Field(default=None, max_length=100)
    event_date: datetime | None = None
    max_participants: int | None = Field(default=None, gt=0)