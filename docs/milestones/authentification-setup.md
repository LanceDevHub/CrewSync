# Authentifizierung – Benutzerregistrierung

Dieses Dokument beschreibt die Implementierung der ersten Authentifizierungslogik der Anwendung.

Der vorherige Entwicklungsabschnitt endete mit:

- Implementierung der Datenbankmodelle
- Einführung von Alembic
- Erstellung der ersten Datenbankmigration
- Aufbau des initialen Datenbankschemas

In diesem Abschnitt wurden die Grundlagen für **Benutzerregistrierung und Passwortsicherheit** implementiert.

---

# 1. Ziel dieses Abschnitts

Ziel dieses Entwicklungsabschnitts war es, den ersten vollständigen Backend-Use-Case zu implementieren:

**Registrierung eines neuen Benutzers**

Dazu mussten mehrere Komponenten ergänzt werden:

- API-Datenstrukturen (Schemas)
- Passwort-Hashing
- Authentifizierungsrouter
- Datenbankzugriff für Benutzer

Am Ende dieses Abschnitts existiert ein funktionierender Endpunkt:

```text
POST /auth/register
```

Dieser ermöglicht es, neue Benutzerkonten zu erstellen.

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

```text
backend/app/schemas/user.py
```

Definierte Klassen:

```python
class UserCreate(BaseModel)
class UserRead(BaseModel)
```

## UserCreate

Wird verwendet, wenn ein Benutzer sich registriert.

Beispiel-Request:

```json
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

```python
EmailStr
```

---

## UserRead

Definiert die Daten, die an den Client zurückgegeben werden.

Beispiel-Response:

```json
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

# 4. Passwort-Hashing

Datei:

```text
backend/app/core/security.py
```

In dieser Datei wurde das sichere Hashing von Passwörtern implementiert.

Verwendete Bibliothek:

```text
pwdlib
```

Installation:

```bash
pip install pwdlib[argon2]
```

Verwendeter Algorithmus:

```text
Argon2
```

Argon2 ist ein moderner Passwort-Hashing-Algorithmus und gilt als sehr sicher gegenüber Brute-Force- und GPU-Angriffen.

---

## Implementierte Funktionen

```python
get_password_hash(password)
verify_password(plain_password, hashed_password)
```

### get_password_hash

Wandelt ein Klartext-Passwort in einen sicheren Hash um.

Beispiel:

```text
secret123
↓
$argon2id$v=19$m=65536,t=3,p=4$...
```

Nur dieser Hash wird in der Datenbank gespeichert.

---

### verify_password

Vergleicht ein eingegebenes Passwort mit einem gespeicherten Hash.

Diese Funktion wird später beim Login verwendet.

---

# 5. Aufbau der Auth-API

Die Authentifizierungslogik wurde in einem separaten Router implementiert.

Datei:

```text
backend/app/api/auth.py
```

Router-Definition:

```python
router = APIRouter(prefix="/auth", tags=["auth"])
```

Alle Auth-Endpunkte werden unter `/auth` gruppiert.

---

# 6. Implementierung des Register-Endpunkts

Endpunkt:

```text
POST /auth/register
```

Funktion des Endpunkts:

1. Eingabedaten validieren (`UserCreate`)
2. prüfen, ob Username bereits existiert
3. prüfen, ob E-Mail bereits existiert
4. Passwort hashen
5. neuen Benutzer speichern
6. Benutzerinformationen zurückgeben (`UserRead`)

---

## Ablauf der Registrierung

Der Ablauf im Backend sieht folgendermaßen aus:

```text
Client Request
↓
Pydantic Schema Validation
↓
Duplicate Checks (Username / Email)
↓
Passwort Hashing
↓
User in Datenbank speichern
↓
UserRead Response zurückgeben
```

---

# 7. Datenbankzugriff

Die Datenbankverbindung erfolgt über:

```python
Depends(get_db)
```

Die Funktion `get_db()` stammt aus:

```text
backend/app/core/database.py
```

Sie stellt eine SQLAlchemy-Session bereit, die für Datenbankoperationen verwendet wird.

---

# 8. Speicherung der Benutzer

Aktuell wird SQLite als Datenbank verwendet.

Datenbankdatei:

```text
backend/app.db
```

Neue Benutzer werden direkt in der Tabelle `users` gespeichert.

SQLite wird für die lokale Entwicklung verwendet.

In späteren Entwicklungsphasen kann die Datenbank auf **PostgreSQL** umgestellt werden.

---

# 9. Einbindung des Routers

Der Auth-Router wird in `main.py` registriert.

Datei:

```text
backend/app/main.py
```

Einbindung:

```python
app.include_router(auth_router)
```

Dadurch stehen die Auth-Endpunkte global zur Verfügung.

---

# 10. Test des Endpunkts

Der Register-Endpunkt kann über die automatisch generierte API-Dokumentation getestet werden.

Adresse:

```text
http://localhost:8000/docs
```

Dort kann der Endpunkt `POST /auth/register` direkt getestet werden.

---

# 11. Ergebnis dieses Abschnitts

Nach Abschluss dieses Entwicklungsabschnitts verfügt das Backend über:

✔ Benutzer-Schemas
✔ Passwort-Hashing
✔ Authentifizierungsrouter
✔ funktionierende Benutzerregistrierung
✔ Speicherung neuer Benutzer in der Datenbank

Der erste vollständige Backend-Flow wurde damit erfolgreich implementiert.

---

# 12. Nächste Entwicklungsschritte

Die nächsten logischen Schritte in der Backend-Entwicklung sind:

1. **Login-Endpunkt**

```text
POST /auth/login
```

2. **Token-basierte Authentifizierung (JWT)**

3. **Abrufen des aktuell eingeloggten Benutzers**

```text
GET /auth/me
```

4. **Event-Endpunkte**

```text
POST /events
GET /events
POST /events/{id}/join
```

Diese Schritte bauen direkt auf der bereits implementierten Authentifizierungsbasis auf.
