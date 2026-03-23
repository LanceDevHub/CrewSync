from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl, model_validator


class EventCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    lineup: str = Field(min_length=3, max_length=5000)
    location: str = Field(min_length=2, max_length=255)
    official_link: HttpUrl | None = None
    start_datetime: datetime
    end_datetime: datetime | None = None

    @model_validator(mode="after")
    def validate_datetimes(self):
        if self.end_datetime is not None and self.end_datetime < self.start_datetime:
            raise ValueError("end_datetime must be after or equal to start_datetime.")
        return self


class EventRead(BaseModel):
    id: int
    creator_id: int
    creator_username: str
    title: str
    lineup: str
    location: str
    official_link: str | None
    start_datetime: datetime
    end_datetime: datetime | None
    created_at: datetime
    updated_at: datetime

    participants_count: int
    participants_preview: list[str]
    participants: list[str]
    is_joined: bool


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=150)
    lineup: str | None = Field(default=None, min_length=3, max_length=5000)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    official_link: HttpUrl | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None

    @model_validator(mode="after")
    def validate_datetimes(self):
        if (
            self.start_datetime is not None
            and self.end_datetime is not None
            and self.end_datetime < self.start_datetime
        ):
            raise ValueError("end_datetime must be after or equal to start_datetime.")
        return self