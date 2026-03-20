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

Zusätzlich wurden später erweitert:

- Start- und Endzeit für Events
- Teilnehmerinformationen im Event-Detail
- Join-Status für aktuellen Nutzer

---

# 2. Event-Schemas

Datei:

```
backend/app/schemas/event.py
```

## Implementierte Schemas

### EventCreate

Wird verwendet zum Erstellen eines Events.

### EventRead

Wird für API-Responses verwendet.

### EventUpdate

Wird für das Bearbeiten von Events verwendet.

---

## 2.1 Zeitstruktur (neu)

Ein Event besitzt jetzt:

- `start_datetime` (Pflichtfeld)
- `end_datetime` (optional)

Damit können Events mit Start- und Endzeit abgebildet werden.

---

## 2.2 Validierung der Zeitlogik

Es wurde eine fachliche Validierung ergänzt:

```text
end_datetime >= start_datetime
```

Diese wird über `model_validator` im Schema sichergestellt.

---

## 2.3 Erweiterung von EventRead (neu)

Das Response-Schema wurde erweitert um:

- `creator_username`
- `participants_count`
- `participants`
- `is_joined`

Diese Felder werden hauptsächlich im Detail-Endpunkt genutzt.

---

# 3. Event-Endpunkte

Alle Event-Endpunkte befinden sich in:

```
backend/app/api/events.py
```

---

## 3.1 Event erstellen

```
POST /events
```

- nur für eingeloggte Nutzer
- `creator_id` wird automatisch gesetzt
- Event wird in der Datenbank gespeichert

---

## 3.2 Events abrufen

```
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

```
/events?q=techno&location=berlin&only_future=true
```

---

## 3.3 Event Details (erweitert)

```
GET /events/{event_id}
```

- liefert ein einzelnes Event
- gibt `404` zurück, wenn Event nicht existiert

### Erweiterungen:

Dieser Endpoint liefert zusätzlich:

- Teilnehmerliste (`participants`)
- Teilnehmeranzahl (`participants_count`)
- Join-Status (`is_joined`)
- Username des Erstellers (`creator_username`)

---

## 3.4 Event beitreten

```
POST /events/{event_id}/join
```

- nur für eingeloggte Nutzer

- prüft:
  - Event existiert
  - Nutzer ist noch nicht beigetreten

- erstellt Eintrag in `event_participants`

---

## 3.5 Event verlassen

```
DELETE /events/{event_id}/leave
```

- löscht den Eintrag aus `event_participants`
- nur möglich, wenn der Nutzer dem Event beigetreten ist

---

## 3.6 Event bearbeiten

```
PATCH /events/{event_id}
```

- nur der Event-Ersteller darf bearbeiten
- verwendet `EventUpdate`
- nur gesendete Felder werden aktualisiert

Zusätzliche Validierung:

- `end_datetime >= start_datetime`

---

## 3.7 Event löschen

```
DELETE /events/{event_id}
```

- nur der Event-Ersteller darf löschen

Aktuelle Implementierung:

1. alle Einträge in `event_participants` werden gelöscht
2. danach wird das Event gelöscht

---

# 4. Nutzerbezogene Event-Endpunkte

Datei:

```
backend/app/api/users.py
```

---

## 4.1 Eigene Events

```
GET /users/me/events-created
```

- liefert alle Events, die der Nutzer erstellt hat

---

## 4.2 Beigetretene Events

```
GET /users/me/events-joined
```

- liefert alle Events, denen der Nutzer beigetreten ist

---

# 5. Teilnehmer-Logik (neu)

Teilnehmer werden über die Tabelle `event_participants` verwaltet.

Für Event-Details wird:

1. alle Teilnehmer geladen
2. deren Usernames extrahiert
3. Join-Status berechnet

---

## 5.1 Join-Status

```text
is_joined = True / False
```

Dieser Wert gibt an, ob der aktuelle Nutzer bereits Teilnehmer ist.

---

## 5.2 Teilnehmerliste

```text
participants = ["max", "anna", "john"]
```

---

## 5.3 Teilnehmeranzahl

```text
participants_count = len(participants)
```

---

# 6. Wichtige Architekturentscheidung (sehr wichtig)

## Teilnehmer nur im Detail-Endpunkt

Teilnehmerdaten werden **nur in `GET /events/{id}` geladen**.

Nicht in:

```
GET /events
```

---

## Grund

Vermeidung des **N+1 Query Problems**:

```text
1 Query → Events
+ N Queries → Teilnehmer pro Event
```

Das würde zu massiven Performance-Problemen führen.

---

## Konsequenz

- Event-Liste bleibt schnell und leichtgewichtig
- Detailseite enthält vollständige Informationen

---

# 7. Datenbanklogik

Verwendete Tabellen:

- `events`
- `event_participants`

Beziehung:

- ein Event hat viele Teilnehmer
- ein Nutzer kann an vielen Events teilnehmen

---

# 8. Wichtige Implementierungsdetails

## 8.1 Trennung von Verantwortlichkeiten

- `events.py` → Event-Logik
- `users.py` → nutzerspezifische Event-Daten

---

## 8.2 Verwendung von Depends

Dependencies:

- `get_db`
- `get_current_user`

---

## 8.3 Serialisierung

Eine zentrale Helper-Funktion (`serialize_event`) wird verwendet, um:

- Datenbankmodelle in API-Responses zu transformieren
- zusätzliche Felder zu ergänzen

---

## 8.4 Validierung über Pydantic

- automatische Validierung
- saubere Fehlerbehandlung
- konsistente Datenstruktur

---

# 9. Wichtige Hinweise & zukünftige Verbesserungen

## 9.1 Cascade Delete

Aktuell manuell umgesetzt → später:

- SQLAlchemy cascade
- ON DELETE CASCADE

---

## 9.2 SQLite vs PostgreSQL

- aktuell SQLite
- Produktion → PostgreSQL

---

## 9.3 Filter & Pagination

Erweiterungen möglich:

- Pagination (`limit`, `offset`)
- Sortierung
- komplexe Suche

---

## 9.4 Teilnehmer im Event-Response

Aktuell:

- nur im Detail-Endpunkt

Später möglich:

- `participants_preview` (erste 3 Nutzer)
- ohne Performanceverlust

---

## 9.5 Zeitzonen

- aktuell UTC (`datetime.utcnow`)
- später: echte Zeitzonen

---

# 10. Ergebnis dieses Abschnitts

✔ vollständige Event-Verwaltung (CRUD)
✔ Teilnahme-Logik (Join / Leave)
✔ persönliche Event-Übersichten
✔ Such- und Filterfunktion
✔ Zeitstruktur (Start/Ende)
✔ Teilnehmer-Logik
✔ Join-Status
✔ performante API-Struktur

---

# 11. Nächste Schritte

## Backend

- Pagination
- Teilnehmer-Preview in Liste
- Optimierungen (Joins)

## Frontend

- EventDetailPage mit Teilnehmeranzeige
- Join/Leave UI
- Profilseite (eigene Events)

## Infrastruktur

- PostgreSQL
- Deployment

---

# Zusammenfassung

In diesem Abschnitt wurde die zentrale Logik der Plattform implementiert.

Die Anwendung ermöglicht nun:

- Erstellung von Events
- Teilnahme an Events
- Verwaltung eigener Events
- Suche und Filterung
- Anzeige von Teilnehmern und Join-Status

Damit ist ein funktionaler und technisch sauber strukturierter MVP erreicht.
