from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.core.config import settings
from app.schemas.site_access import SiteAccessRequest, SiteAccessResponse

router = APIRouter(prefix="/site-access", tags=["site-access"])


@router.post("/unlock", response_model=SiteAccessResponse, status_code=status.HTTP_200_OK)
def unlock_site_access(payload: SiteAccessRequest, response: Response):
    if payload.password != settings.master_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid master password.",
        )

    response.set_cookie(
        key="site_access",
        value="granted",
        httponly=True,
        samesite="none",
        secure=True,
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    return {"message": "Site access granted."}


@router.post("/lock", response_model=SiteAccessResponse, status_code=status.HTTP_200_OK)
def lock_site_access(response: Response):
    response.delete_cookie(
    key="site_access",
    path="/",
    samesite="none",
    secure=True,
    )
    return {"message": "Site access removed."}


@router.get("/status", status_code=status.HTTP_200_OK)
def get_site_access_status(site_access: str | None = Cookie(default=None)):
    return {"has_access": site_access == "granted"}