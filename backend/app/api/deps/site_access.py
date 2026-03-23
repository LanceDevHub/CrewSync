from fastapi import Cookie, HTTPException, status


def require_site_access(site_access: str | None = Cookie(default=None)):
    if site_access != "granted":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access to this site is restricted.",
        )