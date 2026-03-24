# Backend – Username & Passwort Änderung

## Überblick

Im Backend wurden zwei neue Endpunkte implementiert:

- `PATCH /users/me/username`
- `PATCH /users/me/password`

Diese erlauben es dem eingeloggten Benutzer, seine Account-Daten zu ändern.

---

## Voraussetzungen

- Authentifizierung via `get_current_user`
- Zugriffsschutz via `require_site_access`
- Passwort-Handling über `security.py`

---

## Neue Schemas

Datei: `app/schemas/user.py`

```py
class UsernameUpdate(BaseModel):
    username: str = Field(min_length=3, max_length=50)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=255)
```

---

## Endpoint: Username ändern

```py
@router.patch("/me/username", response_model=UserRead)
def update_username(
    payload: UsernameUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_user = db.scalar(
        select(User).where(User.username == payload.username)
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Username bereits vergeben.")

    current_user.username = payload.username
    db.commit()
    db.refresh(current_user)

    return current_user
```

### Funktion

- prüft ob Username bereits existiert
- aktualisiert den User
- gibt neuen User zurück

---

## Endpoint: Passwort ändern

```py
@router.patch("/me/password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Aktuelles Passwort ist falsch.")

    current_user.hashed_password = get_password_hash(payload.new_password)

    db.commit()

    return {"message": "Passwort erfolgreich geändert."}
```

---

## Sicherheit

### Passwort Handling

- Hashing: `get_password_hash`
- Verifikation: `verify_password`
- Keine Speicherung von Klartext-Passwörtern

---

## Validierung

| Feld             | Validierung        |
| ---------------- | ------------------ |
| username         | Länge + uniqueness |
| current_password | Muss korrekt sein  |
| new_password     | Mindestlänge       |

---

## Architektur Vorteile

- REST-konform
- klare Trennung von Logik
- wiederverwendbare Security Funktionen

---

## Fehlerhandling

- `400 Bad Request` bei:
  - falschem Passwort
  - Username bereits vergeben

---

## Rückgabewerte

| Endpoint | Rückgabe        |
| -------- | --------------- |
| Username | kompletter User |
| Passwort | Success Message |

---

## Ergebnis

Das Backend ermöglicht jetzt:

- sichere Passwortänderung
- Username Updates mit Validierung
- vollständige Integration mit Auth-System

---

## Fazit

Die Lösung ist:

- sicher (Hashing + Verifikation)
- performant
- skalierbar
- sauber integriert in bestehende Architektur
