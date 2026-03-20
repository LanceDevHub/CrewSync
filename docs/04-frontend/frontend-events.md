# Frontend Event-Funktionalität & Interaktionen

Dieses Dokument beschreibt die Erweiterung des Frontends um die zentrale Event-Funktionalität.

Der vorherige Stand beinhaltete:

- vollständige Authentifizierung (Login / Register / Logout)
- JWT Cookie-basierte Authentifizierung
- globalen Auth-State im Frontend
- funktionierende API-Anbindung

In diesem Abschnitt wurde die komplette **Event-Logik im Frontend** umgesetzt und später an die weiterentwickelte Backend-Struktur angepasst.

---

# 1. Ziel dieses Abschnitts

Ziel war es, die Kernfunktion der Plattform umzusetzen:

- Events anzeigen
- Event-Details anzeigen
- Events erstellen
- Events bearbeiten & löschen (für Creator)
- Events beitreten & verlassen
- Events durchsuchen & filtern

Später kamen zusätzlich hinzu:

- Anzeige des Erstellernamens statt nur der ID
- neue Zeitstruktur mit Beginn und optionalem Ende
- Teilnehmeranzeige auf der Detailseite
- Join-Status für den aktuellen Nutzer
- persönliche Event-Übersichten in der Profilseite

---

# 2. Event-Typen

Datei:

```text
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

## 2.1 Erweiterung des Event-Typs

Der Event-Typ wurde später an die neue Backend-Struktur angepasst.

Neue bzw. geänderte Felder:

- `creator_username`
- `start_datetime`
- `end_datetime`
- `participants_count`
- `participants`
- `is_joined`

Entfernt:

- `max_participants`

---

# 3. Event API Layer

Datei:

```text
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

```text
src/pages/EventsPage.tsx
```

## Funktionen

- lädt alle Events
- zeigt Eventliste an
- Navigation zur Detailseite

---

## 4.1 Filter & Suche

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

## 4.2 Anpassung an neue Event-Felder

Die Event-Liste wurde später auf das neue Backend-Datenmodell umgestellt.

### Änderungen

- Anzeige von `creator_username` statt `creator_id`
- Anzeige von `start_datetime`
- Anzeige von `end_datetime`
- Entfernung von `max_participants`

### Ergebnis

Die Event-Liste zeigt nun fachlich sinnvollere Informationen und entspricht der aktuellen API-Struktur.

---

# 5. Event-Detailseite

Datei:

```text
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
- nach Join/Leave wird das Event neu geladen

---

## 5.2 Join-Status im Frontend

Die Detailseite nutzt jetzt:

```ts
event.is_joined;
```

Dadurch kann das Frontend unterscheiden:

- Nutzer ist noch nicht beigetreten
- Nutzer ist bereits beigetreten

---

## 5.3 Teilnehmeranzeige

Die Detailseite zeigt jetzt zusätzlich:

- `participants_count`
- `participants`

### Darstellung

- standardmäßig werden die ersten 3 Teilnehmer angezeigt
- über „Mehr anzeigen“ kann die vollständige Liste eingeblendet werden
- über „Weniger anzeigen“ kann wieder reduziert werden

---

## 5.4 Creator-Funktionalität

Wenn:

```ts
currentUser.id === event.creator_id;
```

Dann:

- Event bearbeiten möglich
- Event löschen möglich

---

## 5.5 Wichtige Entscheidung: Creator darf weiterhin joinen

Im Frontend wurde bewusst entschieden, dass der Event-Ersteller sein eigenes Event ebenfalls joinen und leaven kann.

### Begründung

Im Backend ist dies erlaubt und das Frontend wurde daran angepasst.

Das bedeutet:

- Creator kann Teilnehmer sein
- Creator kann zusätzlich Bearbeiten/Löschen nutzen
- Join/Leave und Creator-Funktionen schließen sich nicht gegenseitig aus

---

# 6. Event bearbeiten (PATCH)

## Umsetzung

- Inline-Edit-Modus auf Detailseite
- Formular mit vorgefüllten Daten

## Ablauf

1. Nutzer klickt auf „Bearbeiten“
2. Formular erscheint
3. Änderungen werden gesendet
4. UI aktualisiert sich

---

## 6.1 Anpassung an neue Zeitstruktur

Der Edit-Modus wurde später angepasst auf:

- `start_datetime`
- `end_datetime`

Entfernt:

- `max_participants`

---

# 7. Event löschen (DELETE)

## Ablauf

1. Nutzer klickt auf „Löschen“
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

```text
src/pages/CreateEventPage.tsx
```

## Funktionen

- Formular zur Erstellung
- Validierung über Backend
- Fehleranzeige
- Redirect nach Erstellung

---

## 8.1 Anpassung an neue Event-Felder

Die Event-Erstellung wurde später überarbeitet.

### Neu

- `start_datetime`
- `end_datetime` (optional)

### Entfernt

- `max_participants`

Dadurch entspricht das Formular nun der aktuellen fachlichen Struktur des Backends.

---

# 9. Profilseite (ProfilePage)

Datei:

```text
src/pages/ProfilePage.tsx
```

## Funktionen

- zeigt den aktuell eingeloggten Nutzer
- lädt:
  - eigene erstellte Events
  - beigetretene Events

## Bereiche

- „Meine erstellten Events“
- „Meine beigetretenen Events“

---

## 9.1 Anpassung an neue Event-Struktur

Auch die Profilseite wurde an die neue Event-Response angepasst.

### Änderungen

- `creator_username` statt `creator_id`
- `start_datetime` statt altem Datumsfeld
- `end_datetime` wird optional angezeigt

---

# 10. Fehlerbehandlung

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

```text
[object Object]
```

jetzt z. B.:

```text
description: String should have at least 10 characters
```

oder

```text
end_datetime must be after or equal to start_datetime.
```

---

# 11. Wichtige Erkenntnisse

## 11.1 Backend validiert die Fachlogik

Frontend ist nur UI-Schicht.

→ Validierung erfolgt im Backend

Dazu zählen jetzt auch:

- Zeitvalidierung (`end_datetime >= start_datetime`)
- Join-/Leave-Regeln
- Zugriffsprüfung

---

## 11.2 Event-Liste vs Event-Detail

Teilnehmerdaten werden aktuell **nur in der Detailansicht** genutzt.

### Grund

Die Event-Liste soll leichtgewichtig bleiben.

Würde man bei `GET /events` für jedes Event direkt Teilnehmer laden, könnte ein N+1-Problem entstehen.

### Konsequenz

- `EventsPage` → kompakte Daten
- `EventDetailPage` → vollständige Daten inklusive Teilnehmer

---

## 11.3 Datum Handling

Verwendet wird:

```ts
datetime - local;
```

→ kompatibel mit Backend (ISO-Format)

---

## 11.4 Query-Parameter-System

Filter funktionieren über:

```text
/events?q=...&genre=...&location=...
```

---

## 11.5 Frontend wurde an API-Änderungen nachgezogen

Nach Änderungen im Backend musste das Frontend angepasst werden für:

- `creator_username`
- `start_datetime`
- `end_datetime`
- Teilnehmerinformationen
- Join-Status

Diese Synchronisation zwischen Backend und Frontend ist ein wichtiger Teil der Weiterentwicklung.

---

# 12. Was jetzt funktioniert

✔ Events anzeigen
✔ Event-Details anzeigen
✔ Event erstellen
✔ Event bearbeiten
✔ Event löschen
✔ Event beitreten
✔ Event verlassen
✔ Event filtern
✔ Event durchsuchen
✔ Erstellername anzeigen
✔ Beginn und Ende anzeigen
✔ Teilnehmer anzeigen
✔ Join-Status im UI nutzen
✔ persönliche Event-Übersichten anzeigen

---

# 13. Offene Verbesserungen

## UX

- bessere UI (Cards, Layout)
- Filter sofort anwenden ohne extra Button
- Loading-Indikatoren verbessern
- Navigation abhängig vom Login-Zustand

## Logik

- Teilnehmer-Vorschau eventuell auch in der Event-Liste
- Teilnehmer-Count in weiteren Listen nutzen
- bessere visuelle Trennung Creator / Teilnehmer

## Architektur

- AuthContext einführen
- globales State Management verbessern

---

# 14. Wichtige technische TODOs (für später)

- CSRF-Schutz bei Cookie Auth
- secure Cookies in Produktion
- Rate Limiting für API
- Pagination für Events
- Datenbankwechsel zu PostgreSQL

---

# 15. Nächster Schritt

Empfohlene Reihenfolge:

1. Navigation aufräumen
2. UI/UX verbessern
3. Event-Karten statt einfache Listen
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
- Frontend an die neue Event-Struktur angepasst
- Teilnehmer- und Join-Logik sichtbar gemacht
- persönliche Event-Ansichten ergänzt

Damit ist die erste vollständige und bereits deutlich verfeinerte Frontend-Version der Anwendung erreicht.
