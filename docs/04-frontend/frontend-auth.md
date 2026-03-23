# Frontend Authentifizierung & API-Anbindung

Dieses Dokument beschreibt die Umsetzung der Frontend-Authentifizierung sowie die Anbindung an das Backend.

---

# 1. Ziel

Ziel war es, das Frontend mit dem Backend zu verbinden und folgende Funktionen zu ermöglichen:

- Registrierung
- Login
- automatische Session-Erkennung
- Logout
- Zugriffsschutz über Master-Passwort

---

# 2. API-Client

Datei: src/lib/api-client.ts

## Zweck

Zentrale Stelle für alle HTTP-Requests.

## Wichtige Features

- automatische JSON-Konvertierung
- zentrale Fehlerbehandlung
- Nutzung von:

credentials: "include"

→ notwendig für Cookie-basierte Authentifizierung

---

# 3. Typdefinitionen

Datei: src/types/user.ts

## Typen

- User
- RegisterPayload
- LoginPayload

## User enthält jetzt:

- id
- username
- email
- first_name
- last_name
- is_active

---

# 4. Auth API Layer

Datei: src/api/auth.ts

## Funktionen

- registerUser
- loginUser
- getCurrentUser
- logoutUser

---

# 5. LoginPage

Datei: src/pages/LoginPage.tsx

## Funktionen

- Login-Formular
- Fehleranzeige
- Loading-State

Nach Login:

onLoginSuccess(user)

→ sofortige Aktualisierung des globalen States

---

# 6. RegisterPage

Datei: src/pages/RegisterPage.tsx

## Erweiterung

Neue Felder:

- first_name
- last_name

## Ergebnis

User wird vollständig angelegt und kann später korrekt angezeigt werden.

---

# 7. Globaler Auth-State

Datei: src/App.tsx

State:

currentUser

Beim Start:

getCurrentUser()

---

# 8. Problem: State nach Reload verloren

## Ursache

React State geht bei Reload verloren

## Lösung

Session bleibt über Cookie erhalten  
→ getCurrentUser wird beim Start erneut aufgerufen

---

# 9. Logout

- ruft /auth/logout auf
- löscht Cookie
- setzt currentUser auf null

---

# 10. Cookie-basierte Auth

- JWT wird im HttpOnly Cookie gespeichert
- Frontend kann Cookie nicht lesen
- Browser sendet Cookie automatisch

Wichtig:

credentials: "include"

---

# 11. CORS

Backend muss erlauben:

- allow_credentials=True
- allow_origins korrekt setzen

---

# 12. Master-Passwort (NEU)

## Zweck

Die gesamte Seite ist zusätzlich geschützt durch ein Master-Passwort.

## Ablauf

1. Nutzer öffnet Seite
2. AccessGate erscheint
3. Eingabe des Master-Passworts
4. Backend validiert Zugriff
5. Cookie wird gesetzt
6. Zugriff auf App erlaubt

## Vorteil

- zusätzlicher Schutz
- App nicht öffentlich zugänglich

---

# 13. Typische Fehlerquellen

- credentials vergessen → Cookie wird nicht gesendet
- localhost vs 127.0.0.1 → unterschiedliche Cookies
- falsche CORS-Konfiguration

---

# 14. Was jetzt funktioniert

- Registrierung
- Login
- Logout
- Session bleibt erhalten
- Auth-State wird korrekt geladen
- Master-Passwort schützt Anwendung

---

# 15. Nächste Schritte

- AuthContext einführen
- bessere Fehleranzeige
- UX verbessern

---

# Zusammenfassung

Das Frontend ist vollständig mit dem Backend verbunden und nutzt:

- Cookie-basierte Authentifizierung
- globalen Auth-State
- Master-Passwort-Schutz

Damit ist die Grundlage für alle weiteren Features gelegt.
