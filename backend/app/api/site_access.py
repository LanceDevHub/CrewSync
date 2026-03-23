from fastapi import APIRouter, HTTPException, Response, status

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
        samesite="lax",
        secure=False,
    )

    return {"message": "Site access granted."}


@router.post("/lock", response_model=SiteAccessResponse, status_code=status.HTTP_200_OK)
def lock_site_access(response: Response):
    response.delete_cookie(key="site_access")

    return {"message": "Site access removed."}