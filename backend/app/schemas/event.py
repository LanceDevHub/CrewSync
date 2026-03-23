from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator


class EventParticipantPreview(BaseModel):
    username: str
    first_name: str
    last_name: str

    @property
    def display_name(self) -> str:
        last_initial = f"{self.last_name[0]}." if self.last_name else ""
        return f"{self.first_name} {last_initial}".strip()


class EventCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    lineup: str = Field(min_length=3, max_length=5000)
    location: str = Field(min_length=2, max_length=255)
    official_link: str | None = Field(default=None, max_length=500)
    start_datetime: datetime
    end_datetime: datetime | None = None

    @field_validator("official_link")
    @classmethod
    def normalize_official_link(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        if not value:
            return None

        if value.startswith("www."):
            value = f"https://{value}"
        elif not value.startswith(("http://", "https://")):
            value = f"https://{value}"

        return value

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
    participants_preview: list[EventParticipantPreview]
    participants: list[EventParticipantPreview]
    is_joined: bool


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=150)
    lineup: str | None = Field(default=None, min_length=3, max_length=5000)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    official_link: str | None = Field(default=None, max_length=500)
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None

    @field_validator("official_link")
    @classmethod
    def normalize_official_link(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        if not value:
            return None

        if value.startswith("www."):
            value = f"https://{value}"
        elif not value.startswith(("http://", "https://")):
            value = f"https://{value}"

        return value

    @model_validator(mode="after")
    def validate_datetimes(self):
        if (
            self.start_datetime is not None
            and self.end_datetime is not None
            and self.end_datetime < self.start_datetime
        ):
            raise ValueError("end_datetime must be after or equal to start_datetime.")
        return self