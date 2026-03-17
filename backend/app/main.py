from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base, engine
from app.models import User, Event

app = FastAPI(title=settings.app_name)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "API running",
        "app_name": settings.app_name,
        "debug": settings.debug,
    }