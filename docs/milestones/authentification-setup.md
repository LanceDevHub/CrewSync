# Authentifizierung – Benutzerregistrierung, Login und JWT-Cookie-Authentifizierung

Dieses Dokument beschreibt die Implementierung der Authentifizierungslogik der Anwendung.

Der vorherige Entwicklungsabschnitt endete mit:

- Implementierung der Datenbankmodelle
- Einführung von Alembic
- Erstellung der ersten Datenbankmigration
- Aufbau des initialen Datenbankschemas

In diesem Abschnitt wurden die Grundlagen für **Benutzerregistrierung, Login, JWT-basierte Authentifizierung und Logout** implementiert.

---

# 1. Ziel dieses Abschnitts

Ziel dieses Entwicklungsabschnitts war es, einen vollständigen ersten Authentifizierungszyklus zu implementieren.

Dazu gehören:

- Registrierung eines neuen Benutzers
- Login mit Passwortprüfung
- Erzeugung eines JWT
- Speicherung des JWT in einem **HttpOnly-Cookie**
- Abruf des aktuell eingeloggten Benutzers
- Logout durch Löschen des Cookies

Am Ende dieses Abschnitts existieren funktionierende Endpunkte für:

```
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout
```

---

# 2. Einführung von Pydantic-Schemas

Nach den SQLAlchemy-Modellen wurden **Pydantic-Schemas** eingeführt.

Schemas definieren die Datenstruktur für:

- eingehende API-Requests
- ausgehende API-Responses

Wichtig ist die Trennung zwischen:

| Ebene            | Zweck             |
| ---------------- | ----------------- |
| SQLAlchemy Model | Datenbankstruktur |
| Pydantic Schema  | API-Datenstruktur |

Diese Trennung verhindert, dass interne Datenbankfelder versehentlich über die API ausgegeben werden.

---

# 3. Benutzer-Schemas

Datei:

```
backend/app/schemas/user.py
```

Definierte Klassen:

```
class UserCreate(BaseModel)
class UserRead(BaseModel)
```

## UserCreate

Wird verwendet, wenn ein Benutzer sich registriert.

Beispiel-Request:

```
{
  "username": "max",
  "email": "max@example.com",
  "password": "secret123"
}
```

Dieses Schema validiert:

- Username-Länge
- korrektes E-Mail-Format
- Passwortlänge

Die E-Mail-Validierung erfolgt über:

```
EmailStr
```

---

## UserRead

Definiert die Daten, die an den Client zurückgegeben werden.

Beispiel-Response:

```
{
  "id": 1,
  "username": "max",
  "email": "max@example.com",
  "is_active": true
}
```

Wichtig:

- `password_hash` wird **nicht** zurückgegeben
- `password` wird ebenfalls **nie** gespeichert oder ausgegeben

---

# 4. Login-Schema

Datei:

```
backend/app/schemas/auth.py
```

Definierte Klasse:

```
class LoginRequest(BaseModel)
```

Beispiel-Request:

```
{
  "email": "max@example.com",
  "password": "secret123"
}
```

Dieses Schema wird für den Login-Endpunkt verwendet.

---

# 5. Passwort-Hashing

Datei:

```
backend/app/core/security.py
```

In dieser Datei wurde das sichere Hashing von Passwörtern implementiert.

Verwendete Bibliothek:

```
pwdlib
```

Installation:

```
pip install pwdlib[argon2]
```

Verwendeter Algorithmus:

```
Argon2
```

Argon2 ist ein moderner Passwort-Hashing-Algorithmus und gilt als sehr sicher gegenüber Brute-Force- und GPU-Angriffen.

---

## Implementierte Funktionen

```
get_password_hash(password)
verify_password(plain_password, hashed_password)
```

### get_password_hash

Wandelt ein Klartext-Passwort in einen sicheren Hash um.

Beispiel:

```
secret123
↓
$argon2id$v=19$m=65536,t=3,p=4$...
```

Nur dieser Hash wird in der Datenbank gespeichert.

---

### verify_password

Vergleicht ein eingegebenes Passwort mit einem gespeicherten Hash.

Diese Funktion wird beim Login verwendet.

---

# 6. Einführung von JWT

Zusätzlich zum Passwort-Hashing wurde eine tokenbasierte Authentifizierungslogik mit **JWT (JSON Web Token)** eingeführt.

JWT wird verwendet, um nach erfolgreichem Login eine signierte Nutzeridentität bereitzustellen.

Ein JWT enthält in diesem Projekt insbesondere:

- `sub` → die Benutzer-ID
- `exp` → Ablaufzeitpunkt des Tokens

Das Token wird nicht im Frontend-Speicher wie `localStorage` gehalten, sondern als **HttpOnly-Cookie** gesetzt.

---

# 7. JWT-Konfiguration

Die JWT-Konfiguration erfolgt über `.env` und `config.py`.

Datei:

```
backend/.env
```

Beispiel:

```
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SECRET_KEY=dev-secret
```

Datei:

```
backend/app/core/config.py
```

Dort werden diese Werte in der zentralen `Settings`-Klasse definiert.

---

# 8. JWT-Funktionen in security.py

Zusätzlich zum Passwort-Hashing wurden JWT-Hilfsfunktionen implementiert.

Verwendete Bibliothek:

```
python-jose[cryptography]
```

Installation:

```
pip install "python-jose[cryptography]"
```

Implementierte Funktionen:

```
create_access_token(subject)
decode_access_token(token)
```

---

# 9. Aufbau der Auth-API

Die Authentifizierungslogik wurde in einem separaten Router implementiert.

Datei:

```
backend/app/api/auth.py
```

Router-Definition:

```
router = APIRouter(prefix="/auth", tags=["auth"])
```

Alle Auth-Endpunkte werden unter `/auth` gruppiert.

---

# 10. Implementierung des Register-Endpunkts

Endpunkt:

```
POST /auth/register
```

Funktion:

1. Eingabedaten validieren (`UserCreate`)
2. prüfen, ob Username existiert
3. prüfen, ob E-Mail existiert
4. Passwort hashen
5. User speichern
6. `UserRead` zurückgeben

---

# 11. Implementierung des Login-Endpunkts

Endpunkt:

```
POST /auth/login
```

Ablauf:

```
Client Request
↓
Pydantic Validation
↓
User anhand E-Mail suchen
↓
Passwortprüfung
↓
JWT erzeugen
↓
JWT als Cookie setzen
↓
UserRead Response
```

---

# 12. Speicherung des Tokens im Cookie

Der Access Token wird als Cookie gespeichert.

Verwendete Cookie-Einstellungen:

- `key="access_token"`
- `httponly=True`
- `samesite="lax"`
- `secure=False` (lokale Entwicklung)

---

## Bedeutung dieser Einstellungen

### httponly=True

Das Cookie kann nicht durch JavaScript gelesen werden.

### samesite="lax"

Reduziert Risiko von Cross-Site Requests.

### secure=False

Nur für lokale Entwicklung.

In Produktion muss gelten:

```
secure=True
```

---

# 13. Authentifizierter Benutzer (`/auth/me`)

Endpunkt:

```
GET /auth/me
```

Ablauf:

```
Cookie auslesen
↓
JWT dekodieren
↓
User-ID aus sub lesen
↓
User aus Datenbank laden
↓
UserRead zurückgeben
```

---

# 14. Auth-Dependency

Datei:

```
backend/app/api/deps/auth.py
```

Zentrale Funktion:

```
get_current_user()
```

Diese Funktion:

- liest das Cookie
- validiert das JWT
- lädt den User aus der DB

Sie wird später auch für andere geschützte Endpunkte genutzt.

---

# 15. Logout

Endpunkt:

```
POST /auth/logout
```

Funktion:

- löscht das Cookie `access_token`
- beendet die aktuelle Session

Nach Logout sollte:

```
GET /auth/me
```

mit `401 Unauthorized` antworten.

---

# 16. Datenbankzugriff

Der Datenbankzugriff erfolgt über:

```
Depends(get_db)
```

Datei:

```
backend/app/core/database.py
```

Diese Funktion stellt eine SQLAlchemy-Session bereit.

---

# 17. Speicherung der Benutzer

Aktuell wird SQLite verwendet.

Datenbankdatei:

```
backend/app.db
```

Diese wird später durch **PostgreSQL** ersetzt.

---

# 18. Test der Endpunkte

Test über:

```
http://localhost:8000/docs
```

Testbare Endpunkte:

```
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout
```

---

# 19. Sicherheitsaspekte

Diese Implementierung bildet eine solide Grundlage, ist aber noch nicht vollständig produktionsreif.

## CSRF-Schutz

Da Cookies automatisch gesendet werden, muss später ein CSRF-Schutz implementiert werden.

Mögliche Strategien:

- CSRF Token
- Double Submit Cookie Pattern
- zusätzliche Header-Prüfungen

---

## secure=True in Produktion

In Produktion müssen Cookies nur über HTTPS übertragen werden:

```
secure=True
```

---

## Starker SECRET_KEY

Der Secret Key muss in Produktion:

- lang
- zufällig
- sicher generiert

sein.

---

## Token-Laufzeit

Die aktuelle Tokenlaufzeit ist für Entwicklung geeignet.

Später kann ergänzt werden:

- Refresh Tokens
- kürzere Access Token Laufzeiten

---

# 20. Ergebnis dieses Abschnitts

Nach diesem Abschnitt besitzt das Backend:

✔ Benutzer-Schemas
✔ Login-Schema
✔ Passwort-Hashing
✔ JWT-Erzeugung
✔ JWT-Validierung
✔ Cookie-basierte Authentifizierung
✔ `/auth/me`
✔ `/auth/logout`
✔ vollständigen Auth-Flow

---

# 21. Nächste Entwicklungsschritte

Der nächste logische Schritt ist die Implementierung der Event-Funktionalität:

```
POST /events
GET /events
POST /events/{id}/join
```

Diese Endpunkte können nun den aktuell eingeloggten Benutzer über `get_current_user()` bestimmen.
