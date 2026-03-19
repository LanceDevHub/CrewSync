# Frontend Event-Funktionalität & Interaktionen

Dieses Dokument beschreibt die Erweiterung des Frontends um die zentrale Event-Funktionalität.

Der vorherige Stand beinhaltete:

- vollständige Authentifizierung (Login / Register / Logout)
- JWT Cookie-basierte Authentifizierung
- globalen Auth-State im Frontend
- funktionierende API-Anbindung

In diesem Abschnitt wurde die komplette **Event-Logik im Frontend** umgesetzt.

---

# 1. Ziel dieses Abschnitts

Ziel war es, die Kernfunktion der Plattform umzusetzen:

- Events anzeigen
- Event-Details anzeigen
- Events erstellen
- Events bearbeiten & löschen (für Creator)
- Events beitreten & verlassen
- Events durchsuchen & filtern

---

# 2. Event-Typen

Datei:

```
src/types/event.ts
```

## Definierte Typen

```ts
Event;
EventCreatePayload;
EventUpdatePayload;
```

## Zweck

- klare Typisierung der Event-Daten
- Trennung zwischen API-Input und API-Output
- bessere Developer Experience durch TypeScript

---

# 3. Event API Layer

Datei:

```
src/api/events.ts
```

## Implementierte Funktionen

```ts
getEvents();
getEventById();
createEvent();
updateEvent();
deleteEvent();
joinEvent();
leaveEvent();
```

## Erweiterung: Filter

```ts
getEvents(filters);
```

→ nutzt Query-Parameter für Suche und Filter

---

# 4. Event-Liste (EventsPage)

Datei:

```
src/pages/EventsPage.tsx
```

## Funktionen

- lädt alle Events
- zeigt Eventliste an
- Navigation zur Detailseite

---

## Filter & Suche

Folgende Filter wurden implementiert:

- Textsuche (`q`)
- Genre
- Ort
- Datum von / bis
- nur zukünftige Events

## Technische Umsetzung

- lokale State-Variablen
- Übergabe an API via Query-Params
- dynamischer Request an Backend

---

# 5. Event-Detailseite

Datei:

```
src/pages/EventDetailPage.tsx
```

## Funktionen

- zeigt vollständige Event-Daten
- lädt aktuellen User parallel
- zeigt Aktionen abhängig vom User

---

## 5.1 Join / Leave

- Button zum Beitreten eines Events
- Button zum Verlassen eines Events

## Verhalten

- Backend entscheidet über Validität
- Frontend zeigt Erfolg oder Fehler

---

## 5.2 Creator-Funktionalität

Wenn:

```ts
currentUser.id === event.creator_id;
```

Dann:

- Event bearbeiten möglich
- Event löschen möglich

---

# 6. Event bearbeiten (PATCH)

## Umsetzung

- Inline-Edit-Modus auf Detailseite
- Formular mit vorgefüllten Daten

## Ablauf

1. Nutzer klickt "Bearbeiten"
2. Formular erscheint
3. Änderungen werden gesendet
4. UI aktualisiert sich

---

# 7. Event löschen (DELETE)

## Ablauf

1. Nutzer klickt "Löschen"
2. Bestätigungsdialog (`confirm`)
3. Backend-Request
4. Redirect zur Eventliste

---

## Wichtige Anmerkung

Aktuell erfolgt das Löschen korrekt im Backend.

Später sinnvoll:

- `cascade delete` für Teilnehmer
- Soft Delete (optional)

---

# 8. Event erstellen

Datei:

```
src/pages/CreateEventPage.tsx
```

## Funktionen

- Formular zur Erstellung
- Validierung über Backend
- Fehleranzeige
- Redirect nach Erstellung

---

# 9. Fehlerbehandlung (wichtig)

## Problem

FastAPI gibt bei Fehlern oft komplexe Objekte zurück:

```json
{
  "detail": [...]
}
```

## Lösung im API-Client

- Parsing von `detail`
- lesbare Fehlermeldungen im Frontend

## Ergebnis

statt:

```
[object Object]
```

jetzt:

```
description: String should have at least 10 characters
```

---

# 10. Wichtige Erkenntnisse

## 10.1 Backend validiert alles

Frontend ist nur UI-Schicht.

→ Validierung erfolgt im Backend

---

## 10.2 UI ist aktuell "dumm"

- Join & Leave Buttons immer sichtbar
- Backend entscheidet korrekt

Später Verbesserung:

- Status im Frontend kennen

---

## 10.3 Datum Handling

```ts
datetime - local;
```

→ kompatibel mit Backend (ISO Format)

---

## 10.4 Query-Parameter-System

Filter funktionieren über:

```
/events?q=...&genre=...&location=...
```

---

# 11. Was jetzt funktioniert

✔ Events anzeigen
✔ Event-Details anzeigen
✔ Event erstellen
✔ Event bearbeiten
✔ Event löschen
✔ Event beitreten
✔ Event verlassen
✔ Event filtern
✔ Event durchsuchen

---

# 12. Offene Verbesserungen (wichtig)

## UX

- bessere UI (Cards, Layout)
- Filter sofort anwenden ohne Button
- Loading-Indikatoren verbessern

## Logik

- Join-Status anzeigen
- Teilnehmeranzahl anzeigen
- Creator vs Teilnehmer sauber trennen

## Architektur

- AuthContext einführen
- globales State Management

---

# 13. Wichtige technische TODOs (für später)

- CSRF-Schutz bei Cookie Auth
- secure Cookies in Produktion
- Rate Limiting für API
- Pagination für Events
- Datenbankwechsel zu PostgreSQL

---

# 14. Nächster Schritt

Empfohlene Reihenfolge:

1. Join-Status im Frontend anzeigen
2. ProfilePage ausbauen (eigene Events)
3. UI verbessern (Layout / Styling)
4. Pagination hinzufügen
5. AuthContext einführen

---

# Zusammenfassung

In diesem Abschnitt wurde:

- vollständige Event-Funktionalität im Frontend umgesetzt
- API-Integration erweitert
- CRUD-Operationen implementiert
- Benutzerinteraktionen ermöglicht
- Such- und Filtersystem integriert

Damit ist die **erste vollständige Version der Anwendung (MVP)** erreicht.
