from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.events import router as events_router
from app.api.users import router as users_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)


@app.get("/")
def root():
    return {
        "message": "API running",
        "app_name": settings.app_name,
        "debug": settings.debug,
    }


app.include_router(auth_router)
app.include_router(events_router)
app.include_router(users_router)