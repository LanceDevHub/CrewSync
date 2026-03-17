from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base, engine
from app.models import User, Event, EventParticipant

app = FastAPI(title=settings.app_name)


@app.get("/")
def root():
    return {
        "message": "API running",
        "app_name": settings.app_name,
        "debug": settings.debug,
    }