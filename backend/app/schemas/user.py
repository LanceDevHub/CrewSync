from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True


class UsernameUpdateRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)


class PasswordChangeRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=255)
    new_password: str = Field(min_length=8, max_length=255)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=1, max_length=255)
    new_password: str = Field(min_length=8, max_length=255)