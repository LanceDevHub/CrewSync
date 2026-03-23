from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Music Events Platform"
    debug: bool = True
    database_url: str
    secret_key: str
    master_password: str
    frontend_url: str = "http://localhost:5173"

    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()