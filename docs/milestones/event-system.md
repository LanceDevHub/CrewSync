# Event-System – Implementierung

Dieses Dokument beschreibt die Implementierung der Event-Funktionalität der Anwendung.

Es baut direkt auf dem vorherigen Abschnitt auf, in dem die Authentifizierung (Register, Login, JWT, Cookies) umgesetzt wurde.

---

# 1. Ziel dieses Abschnitts

Ziel war es, die zentrale Funktion der Plattform umzusetzen:

**Erstellung und Verwaltung von Musik-Events sowie Teilnahme an Events**

Dazu wurden folgende Funktionen implementiert:

- Events erstellen
- Events anzeigen (Liste und Detail)
- Suche und Filter
- Events beitreten (Join)
- Events verlassen (Leave)
- persönliche Event-Übersichten
- Events bearbeiten
- Events löschen

---

# 2. Event-Schemas

Datei:

```text
backend/app/schemas/event.py
```

## Implementierte Schemas

### EventCreate

Wird verwendet zum Erstellen eines Events.

### EventRead

Wird für API-Responses verwendet.

### EventUpdate

Wird für das Bearbeiten von Events verwendet.

Wichtig:

- Beim Update sind alle Felder optional
- nur tatsächlich gesendete Felder werden geändert

---

# 3. Event-Endpunkte

Alle Event-Endpunkte befinden sich in:

```text
backend/app/api/events.py
```

---

## 3.1 Event erstellen

```text
POST /events
```

- nur für eingeloggte Nutzer
- `creator_id` wird automatisch gesetzt
- Event wird in der Datenbank gespeichert

---

## 3.2 Events abrufen

```text
GET /events
```

Dieser Endpunkt wurde erweitert um:

### Suche

- Parameter: `q`
- durchsucht:
  - Titel
  - Beschreibung
  - Ort

### Filter

- `genre`
- `location`

### Datumsfilter

- `date_from`
- `date_to`

### Zeitlogik

- `only_future`

Beispiel:

```text
/events?q=techno&location=berlin&only_future=true
```

---

## 3.3 Event Details

```text
GET /events/{event_id}
```

- liefert ein einzelnes Event
- gibt `404` zurück, wenn Event nicht existiert

---

## 3.4 Event beitreten

```text
POST /events/{event_id}/join
```

- nur für eingeloggte Nutzer
- prüft:
  - Event existiert
  - Nutzer ist noch nicht beigetreten

- erstellt Eintrag in `event_participants`

Wichtig:

- der Event-Ersteller darf sein eigenes Event joinen

---

## 3.5 Event verlassen

```text
DELETE /events/{event_id}/leave
```

- löscht den Eintrag aus `event_participants`
- nur möglich, wenn der Nutzer dem Event beigetreten ist

---

## 3.6 Event bearbeiten

```text
PATCH /events/{event_id}
```

- nur der Event-Ersteller darf bearbeiten
- verwendet `EventUpdate`
- nur gesendete Felder werden aktualisiert

---

## 3.7 Event löschen

```text
DELETE /events/{event_id}
```

- nur der Event-Ersteller darf löschen

Aktuelle Implementierung:

1. alle Einträge in `event_participants` werden gelöscht
2. danach wird das Event gelöscht

---

# 4. Nutzerbezogene Event-Endpunkte

Datei:

```text
backend/app/api/users.py
```

---

## 4.1 Eigene Events

```text
GET /users/me/events-created
```

- liefert alle Events, die der Nutzer erstellt hat

---

## 4.2 Beigetretene Events

```text
GET /users/me/events-joined
```

- liefert alle Events, denen der Nutzer beigetreten ist

Hinweis:

Ein Event kann in beiden Listen erscheinen, wenn der Ersteller auch Teilnehmer ist.

---

# 5. Datenbanklogik

Verwendete Tabellen:

- `events`
- `event_participants`

Beziehung:

- ein Event hat viele Teilnehmer
- ein Nutzer kann an vielen Events teilnehmen

---

# 6. Wichtige Implementierungsdetails

## 6.1 Trennung von Verantwortlichkeiten

- `events.py` → Event-Logik
- `users.py` → nutzerspezifische Event-Daten

Diese Trennung ist wichtig für eine skalierbare Architektur.

---

## 6.2 Verwendung von Depends

Dependencies werden genutzt für:

- Datenbankzugriff (`get_db`)
- Authentifizierung (`get_current_user`)

Dadurch:

- saubere Endpunkte
- keine doppelte Logik
- automatische Sicherheitsprüfung

---

## 6.3 Validierung über Pydantic

- Eingaben werden automatisch validiert
- ungültige Daten führen zu Fehlern
- verhindert fehlerhafte Daten in der DB

---

# 7. Wichtige Hinweise & zukünftige Verbesserungen

## 7.1 Löschen von Events (Cascade)

Aktuell:

- Teilnehmer-Einträge werden manuell gelöscht

Später sollte dies verbessert werden durch:

- SQLAlchemy Relationships
- `cascade="all, delete-orphan"`
- oder Datenbank-seitiges `ON DELETE CASCADE`

Vorteil:

- weniger Code im Endpoint
- konsistentere Datenbanklogik

---

## 7.2 SQLite vs PostgreSQL

Aktuell wird SQLite verwendet.

Für Produktion:

- Umstieg auf PostgreSQL empfohlen
- bessere Performance
- bessere Integrität
- bessere Skalierbarkeit

---

## 7.3 Filter-Logik erweitern

Aktuell:

- einfache Filter

Später möglich:

- Sortierung (`asc` / `desc`)
- Pagination (`limit`, `offset`)
- komplexere Suche

---

## 7.4 Teilnehmerinformationen

Aktuell fehlen im Response:

- Teilnehmeranzahl
- ob aktueller Nutzer beigetreten ist

Diese können später ergänzt werden.

---

## 7.5 Zeitzonen

Aktuell wird mit `datetime.utcnow()` gearbeitet.

Später sollte geprüft werden:

- Zeitzonenunterstützung
- lokale Zeiten vs UTC

---

# 8. Ergebnis dieses Abschnitts

Nach Abschluss dieses Abschnitts verfügt die Anwendung über:

✔ vollständige Event-Verwaltung (CRUD)
✔ Teilnahme-Logik (Join / Leave)
✔ persönliche Event-Übersichten
✔ Such- und Filterfunktion
✔ saubere Trennung der API-Struktur

Damit ist der zentrale Funktionskern der Plattform implementiert.

---

# 9. Nächste mögliche Schritte

Mögliche nächste Entwicklungsrichtungen:

## Backend

- Pagination
- Sortierung
- Teilnehmeranzahl im Response
- Rollen / Berechtigungen

## Frontend

- Event-Liste anzeigen
- Login integrieren
- persönliche Seite aufbauen

## Infrastruktur

- PostgreSQL einführen
- Deployment vorbereiten

---

# Zusammenfassung

In diesem Abschnitt wurde die zentrale Logik der Plattform implementiert.

Die Anwendung ermöglicht nun:

- Erstellung von Events
- Teilnahme an Events
- Verwaltung eigener Events
- Suche und Filterung

Damit ist ein funktionaler MVP der Plattform erreicht.
