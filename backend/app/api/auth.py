from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.api.deps.site_access import require_site_access
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate, UserRead

from datetime import datetime, timedelta
from secrets import token_urlsafe
from app.services.email import send_password_reset_email


from app.schemas.user import (
    UserCreate,
    UserRead,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)



router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(require_site_access)],
)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user_by_username = db.scalar(
        select(User).where(User.username == user_data.username)
    )
    if existing_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken."
        )

    existing_user_by_email = db.scalar(
        select(User).where(User.email == user_data.email)
    )
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    hashed_password = get_password_hash(user_data.password)

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=UserRead, status_code=status.HTTP_200_OK)
def login_user(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == login_data.email)
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(subject=str(user.id))

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * settings.access_token_expire_minutes,
        path="/",
    )

    return user


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout_user(response: Response):
    response.delete_cookie(
    key="access_token",
    path="/",
    samesite="none",
    secure=True,
    )
    return {"message": "Logout successful."}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == payload.email)
    )

    if not user:
        return {
            "message": "Falls ein Konto existiert, wurde ein Reset-Link erstellt."
        }

    reset_token = token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    user.password_reset_token = reset_token
    user.password_reset_expires_at = expires_at

    db.commit()

    reset_link = f"{settings.frontend_url}/reset-password?token={reset_token}"

    send_password_reset_email(
        to_email=user.email,
        reset_link=reset_link,
    )

    return {
        "message": "Falls ein Konto existiert, wurde ein Reset-Link erstellt."
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.password_reset_token == payload.token)
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ungültiger oder abgelaufener Reset-Token.",
        )

    if (
        user.password_reset_expires_at is None
        or user.password_reset_expires_at < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ungültiger oder abgelaufener Reset-Token.",
        )

    user.password_hash = get_password_hash(payload.new_password)
    user.password_reset_token = None
    user.password_reset_expires_at = None

    db.commit()

    return {"message": "Passwort erfolgreich zurückgesetzt."}