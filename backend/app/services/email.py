import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    message = EmailMessage()
    message["Subject"] = "Crewsyncr – Passwort zurücksetzen"
    message["From"] = settings.mail_from
    message["To"] = to_email

    plain_text_content = f"""
Hallo,

du hast angefordert, dein Passwort zurückzusetzen.

Nutze dafür diesen Link:
{reset_link}

Dieser Link ist 30 Minuten gültig.

Falls du das nicht warst, kannst du diese E-Mail ignorieren.

Viele Grüße
Crewsyncr
""".strip()

    html_content = f"""
<!DOCTYPE html>
<html lang="de">
  <body style="margin:0; padding:0; background-color:#0f172a; font-family:Arial, sans-serif; color:#e5e7eb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#111827; border:1px solid #374151; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px; font-size:24px; line-height:1.3; color:#ffffff;">
                  Passwort zurücksetzen
                </h1>

                <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#d1d5db;">
                  Hallo,
                </p>

                <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#d1d5db;">
                  du hast angefordert, dein Passwort für <strong>Crewsyncr</strong> zurückzusetzen.
                </p>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                  <tr>
                    <td align="center" bgcolor="#14b8a6" style="border-radius:10px;">
                      <a
                        href="{reset_link}"
                        style="display:inline-block; padding:14px 24px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;"
                      >
                        Passwort zurücksetzen
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#9ca3af;">
                  Dieser Link ist <strong>30 Minuten</strong> gültig.
                </p>

                <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#9ca3af;">
                  Falls der Button nicht funktioniert, kannst du auch diesen Link in deinen Browser kopieren:
                </p>

                <p style="margin:0 0 24px; font-size:14px; line-height:1.6; word-break:break-all;">
                  <a href="{reset_link}" style="color:#2dd4bf; text-decoration:none;">
                    {reset_link}
                  </a>
                </p>

                <p style="margin:0; font-size:14px; line-height:1.6; color:#9ca3af;">
                  Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:16px 0 0; font-size:12px; color:#6b7280;">
            Crewsyncr
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
""".strip()

    message.set_content(plain_text_content)
    message.add_alternative(html_content, subtype="html")

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