from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.events import router as events_router
from app.api.users import router as users_router
from app.api.site_access import router as site_access_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://crewsyncr.de",
        "http://crewsyncr.de",
        "https://www.crewsyncr.de",
        "http://www.crewsyncr.de",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(site_access_router)