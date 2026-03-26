from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Music Events Platform"
    debug: bool = True
    database_url: str
    secret_key: str
    master_password: str
    frontend_url: str = "https://crewsyncr.de"

    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    mail_from: str = "webmaster@crewsyncr.de"
    mailtrap_smtp_host: str
    mailtrap_smtp_port: int = 587
    mailtrap_smtp_username: str
    mailtrap_smtp_password: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()