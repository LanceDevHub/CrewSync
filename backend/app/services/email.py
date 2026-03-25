import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    message = EmailMessage()
    message["Subject"] = "CrewSync – Passwort zurücksetzen"
    message["From"] = settings.mail_from
    message["To"] = to_email

    message.set_content(
        f"""
Hallo,

du hast angefordert, dein Passwort zurückzusetzen.

Klicke auf den folgenden Link:
{reset_link}

Dieser Link ist 30 Minuten gültig.

Falls du das nicht warst, kannst du diese E-Mail ignorieren.

Viele Grüße
CrewSyncr
""".strip()
    )

    with smtplib.SMTP(
        settings.mailtrap_smtp_host,
        settings.mailtrap_smtp_port,
    ) as server:
        server.starttls() 
        server.login(
            settings.mailtrap_smtp_username,
            settings.mailtrap_smtp_password,
        )
        server.send_message(message)