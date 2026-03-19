# Frontend Authentifizierung & API-Anbindung

Dieses Dokument beschreibt die Umsetzung der Frontend-Authentifizierung sowie die Anbindung an das Backend.

Der vorherige Stand beinhaltete:

- funktionierendes FastAPI Backend
- Benutzerregistrierung im Backend
- Login mit JWT (HttpOnly Cookie)
- `/auth/me` zur Benutzeridentifikation

In diesem Abschnitt wurde die vollständige **Frontend-Integration der Authentifizierung** umgesetzt.

---

# 1. Ziel dieses Abschnitts

Ziel war es, das Frontend mit dem Backend zu verbinden und folgende Funktionen zu ermöglichen:

- Benutzerregistrierung im Frontend
- Login über API
- automatische Erkennung eingeloggter Nutzer
- Logout
- Zustandssynchronisation zwischen Backend und Frontend

---

# 2. API-Client

Datei:

```
src/lib/api-client.ts
```

## Zweck

Zentrale Abstraktion für alle HTTP-Requests.

## Wichtige Features

- automatische JSON-Konvertierung (`JSON.stringify`)
- einheitliche Fehlerbehandlung
- Nutzung von:

```
credentials: "include"
```

→ notwendig für Cookie-basierte Authentifizierung

## Wichtige Erkenntnis

TypeScript erwartet `BodyInit`, aber wir senden Objekte.

Lösung:

- eigenes `RequestOptions`-Type
- JSON-Konvertierung im Client

---

# 3. Typdefinitionen

Datei:

```
src/types/user.ts
```

## Definierte Typen

```ts
User;
RegisterPayload;
LoginPayload;
```

## Zweck

- klare Trennung zwischen Backend-Daten und Frontend-Typen
- bessere TypeScript-Unterstützung
- Vermeidung von Fehlern bei API-Calls

---

# 4. Auth API Layer

Datei:

```
src/api/auth.ts
```

## Funktionen

```ts
registerUser();
loginUser();
getCurrentUser();
logoutUser();
```

## Zweck

- kapselt alle Auth-Endpunkte
- trennt API-Logik von UI-Komponenten
- sorgt für Wiederverwendbarkeit

---

# 5. LoginPage

Datei:

```
src/pages/LoginPage.tsx
```

## Funktionen

- Formular für Login
- Fehleranzeige
- Loading-State
- Weiterleitung nach erfolgreichem Login

## Wichtige Besonderheit

Nach erfolgreichem Login:

```ts
onLoginSuccess(user);
```

→ sorgt für sofortige Aktualisierung des App-Zustands

---

# 6. RegisterPage

Datei:

```
src/pages/RegisterPage.tsx
```

## Funktionen

- Formular für Registrierung
- Validierung über Backend
- Fehleranzeige
- Erfolgsmeldung
- Weiterleitung zu `/login`

---

# 7. Globaler Auth-State in App.tsx

Datei:

```
src/App.tsx
```

## Implementierung

```ts
const [currentUser, setCurrentUser] = useState<User | null>(null);
```

## Beim Laden der App

```ts
getCurrentUser();
```

→ prüft, ob ein Nutzer eingeloggt ist

## Problem & Lösung

### Problem

Nach Login war der User erst nach Refresh sichtbar.

### Ursache

`getCurrentUser()` wird nur beim initialen Laden ausgeführt.

### Lösung

Callback-Mechanismus:

```tsx
<LoginPage onLoginSuccess={setCurrentUser} />
```

→ sofortige Aktualisierung des States nach Login

---

# 8. Logout

- ruft `POST /auth/logout` auf
- löscht Cookie im Backend
- setzt `currentUser` im Frontend auf `null`

---

# 9. Cookie-basierte Authentifizierung

## Funktionsweise

- Backend setzt JWT in HttpOnly Cookie
- Frontend kann Cookie nicht direkt lesen
- Browser sendet Cookie automatisch mit

## Wichtig

```ts
credentials: "include";
```

muss gesetzt sein

---

# 10. CORS-Konfiguration

Im Backend erforderlich:

```python
allow_origins=["http://localhost:5173"]
allow_credentials=True
```

## Wichtig

- `allow_credentials=True` ist Pflicht für Cookies
- `allow_origins` darf nicht `"*"` sein

---

# 11. Wichtige Erkenntnis: localhost vs 127.0.0.1

Cookies sind hostgebunden:

- `localhost` ≠ `127.0.0.1`

## Empfehlung

Projekt konsistent auf:

```
http://localhost
```

halten

---

# 12. Was jetzt funktioniert

✔ Registrierung im Frontend
✔ Login im Frontend
✔ JWT Cookie wird gesetzt
✔ `/auth/me` funktioniert
✔ eingeloggter Zustand wird erkannt
✔ Logout funktioniert
✔ Zustand aktualisiert sich ohne Refresh

---

# 13. Offene Verbesserungen (später)

- AuthContext einführen (statt State in App.tsx)
- bessere Fehlerdarstellung
- Form-Validierung im Frontend
- UI/UX verbessern

---

# 14. Nächster Schritt

Der nächste logische Schritt ist:

## Event-Funktionalität im Frontend

- Event-Liste anzeigen (`GET /events`)
- Event-Detailseite
- Event erstellen
- Event beitreten

Damit wird die erste echte Kernfunktion der Anwendung sichtbar.

---

# Zusammenfassung

In diesem Abschnitt wurde:

- ein API-Client implementiert
- Auth-API integriert
- Login & Registrierung im Frontend umgesetzt
- globaler Auth-State eingeführt
- Cookie-basierte Authentifizierung korrekt angebunden

Damit ist die Grundlage für alle weiteren Features gelegt.
