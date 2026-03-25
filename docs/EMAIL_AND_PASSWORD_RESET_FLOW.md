# Email Versand & Passwort-Reset (Crewsyncr)

## Übersicht

In diesem Schritt wurde ein vollständiger E-Mail-Versand für den Passwort-Reset implementiert.

Der Flow umfasst:

- Passwort vergessen Anfrage
- Token-Generierung im Backend
- Versand einer E-Mail mit Reset-Link
- Reset-Form im Frontend
- Passwort neu setzen

---

## Architektur

### Backend

- Token wird generiert (`secrets.token_urlsafe`)
- Token + Ablaufdatum werden im User gespeichert
- E-Mail wird über SMTP versendet (Mailtrap)

### Frontend

- Forgot Password Page
- Reset Password Page (Token aus URL)
- UX Feedback + Redirect

---

## Verwendeter Service

Aktuell wird **Mailtrap (Sandbox)** genutzt:

- SMTP Server: `sandbox.smtp.mailtrap.io`
- Mails werden **nicht wirklich verschickt**
- Nur sichtbar in Mailtrap Inbox

---

## Environment Variablen

```env
MAIL_FROM=noreply@crewsyncr.local

MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=587
MAILTRAP_SMTP_USERNAME=...
MAILTRAP_SMTP_PASSWORD=...
```

---

## Backend Implementierung

### Datei: `app/services/email.py`

Verantwortlich für den Versand:

- SMTP Verbindung
- HTML + Plain Text Mail
- Versand via `smtplib`

Wichtige Punkte:

- `server.starttls()` muss verwendet werden
- `EmailMessage` mit `add_alternative()` für HTML

---

### Datei: `app/api/auth.py`

Neue Endpoints:

#### `/auth/forgot-password`

- prüft ob User existiert
- erstellt Token + Ablaufzeit
- speichert Token
- sendet E-Mail

#### `/auth/reset-password`

- validiert Token
- prüft Ablauf
- setzt neues Passwort
- löscht Token (One-Time Use)

---

### User Model Erweiterung

```python
password_reset_token: Mapped[str | None]
password_reset_expires_at: Mapped[datetime | None]
```

---

## Frontend Implementierung

### ForgotPasswordPage

- Eingabe: E-Mail
- Call: `/auth/forgot-password`
- zeigt immer gleiche Success Message (Security)

---

### ResetPasswordPage

Features:

- Token aus URL (`useSearchParams`)
- Passwort + Bestätigung
- Validierung:
  - Match Check
  - Token vorhanden

- Success:
  - Redirect zu `/login`

---

## HTML E-Mail

E-Mail enthält:

- Titel + Erklärung
- Button „Passwort zurücksetzen“
- Fallback-Link
- Ablaufzeit Hinweis

Vorteile:

- bessere UX
- mobil optimiert
- professioneller Look

---

## Aktueller Status (Sandbox)

Der Versand erfolgt aktuell über:

```env
sandbox.smtp.mailtrap.io
```

Das bedeutet:

- keine echten Mails
- nur Testing
- kein Spam Risiko
- keine Domain notwendig

---

## Wechsel zu echten E-Mails (Production)

Um echte E-Mails zu verschicken, muss Mailtrap gewechselt werden:

### 1. SMTP Host ändern

```env
MAILTRAP_SMTP_HOST=live.smtp.mailtrap.io
```

---

### 2. Sending Domain erstellen

In Mailtrap:

- Email Sending → Sending Domains
- Domain hinzufügen (z. B. `crewsyncr.app`)

---

### 3. DNS Records setzen

Mailtrap gibt dir:

- SPF
- DKIM

Diese müssen im Domain-DNS gesetzt werden.

Warum:

- verhindert Spam
- erhöht Zustellbarkeit
- authentifiziert Absender

---

### 4. MAIL_FROM anpassen

```env
MAIL_FROM=noreply@crewsyncr.app
```

Wichtig:

- Domain muss identisch zur Sending Domain sein

---

## Welche Dateien müssen angepasst werden

Beim Wechsel zu Production:

### `.env`

- SMTP Host
- Credentials
- MAIL_FROM

---

### `email.py`

- bleibt unverändert ✅

---

### Mailtrap Dashboard

- Domain hinzufügen
- DNS konfigurieren

---

## Unterschiede Sandbox vs Production

| Feature       | Sandbox | Production |
| ------------- | ------- | ---------- |
| echte Mails   | ❌      | ✅         |
| Domain nötig  | ❌      | ✅         |
| Spam Risiko   | ❌      | ⚠️         |
| Setup Aufwand | niedrig | mittel     |

---

## Best Practices

- Token Ablaufzeit: 30 Minuten
- Token nach Nutzung löschen
- gleiche Response bei unbekannter E-Mail
- HTML + Plain Text Mail kombinieren
- `.env` niemals committen

---

## Fazit

Der komplette Passwort-Reset Flow ist jetzt:

- funktional
- sicher
- UX optimiert
- production-ready (mit Domain Setup)

Der Wechsel auf echte E-Mails ist mit minimalem Aufwand möglich.
