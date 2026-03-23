from pydantic import BaseModel, Field


class SiteAccessRequest(BaseModel):
    password: str = Field(min_length=1, max_length=255)


class SiteAccessResponse(BaseModel):
    message: str