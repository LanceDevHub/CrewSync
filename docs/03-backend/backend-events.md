# Event-System – Implementierung im Backend

Dieses Dokument beschreibt die Implementierung und Weiterentwicklung der Event-Funktionalität im Backend.

Der vorherige Entwicklungsabschnitt endete mit:

- Datenbankmodellen
- Alembic-Migrationen
- Benutzerregistrierung
- Login / Logout
- JWT-Cookie-Authentifizierung
- vorgelagertem Site-Access über Masterpasswort

In diesem Abschnitt wurde die zentrale Event-Logik des Backends umgesetzt und später mehrfach fachlich weiterentwickelt.

---

# 1. Ziel dieses Abschnitts

Ziel war es, die Kernfunktion der Plattform bereitzustellen:

- Events erstellen
- Events abrufen
- Event-Details anzeigen
- Events bearbeiten
- Events löschen
- Events beitreten
- Events verlassen
- persönliche Event-Übersichten bereitstellen

Spätere Erweiterungen:

- start_datetime und optional end_datetime
- lineup statt description
- optionaler official_link
- Entfernung des Feldes genre
- Teilnehmer als strukturierte Objekte
- participants_preview
- is_joined

---

# 2. Event-Schemas

Datei:

backend/app/schemas/event.py

---

## 2.1 Verwendete Schemas

- EventCreate
- EventRead
- EventUpdate
- EventParticipantPreview

---

## 2.2 EventCreate

Wird zum Erstellen eines Events verwendet.

Felder:

- title
- lineup
- location
- official_link (optional)
- start_datetime
- end_datetime (optional)

---

## 2.3 EventUpdate

- alle Felder optional
- PATCH-fähig (partielle Updates)

---

## 2.4 EventRead

Zusätzlich zu Event-Daten enthält die Response:

- creator_username
- participants_count
- participants_preview
- participants
- is_joined

---

## 2.5 EventParticipantPreview

Teilnehmer werden als Objekt zurückgegeben:

- username
- first_name
- last_name

---

# 3. Entwicklung der Event-Struktur

---

## 3.1 Früher

- description
- genre
- event_date
- max_participants

---

## 3.2 Jetzt

- title
- lineup
- location
- official_link
- start_datetime
- end_datetime

---

## 3.3 lineup statt description

description wurde ersetzt durch lineup.

Grund:
Musik-Events → Fokus auf Acts statt Beschreibung.

---

## 3.4 official_link

Optionaler externer Link zum Event.

---

## 3.5 genre entfernt

Das Feld wurde vollständig gestrichen, da es fachlich nicht mehr benötigt wurde.

---

# 4. Validierung

---

## 4.1 Datumsvalidierung

end_datetime darf nicht vor start_datetime liegen.

---

## 4.2 URL-Verarbeitung

Das Backend akzeptiert auch:

- www.example.com
- example.com

und normalisiert intern zu gültigen URLs.

---

# 5. Event-API

Datei:

backend/app/api/events.py

Base-Route:

/events

---

# 6. Helper-Funktionen

---

## serialize_participants

Konvertiert User → EventParticipantPreview

---

## serialize_event

Erzeugt vollständige EventRead-Response inkl.:

- creator_username
- participants_count
- participants_preview
- participants
- is_joined

---

## get_event_participants

Lädt Teilnehmer über event_participants Tabelle.

---

# 7. Endpunkte

---

## POST /events

Erstellt Event.

- creator_id wird automatisch gesetzt
- gibt EventRead zurück

---

## GET /events

Unterstützt Filter:

- q (title, lineup, location)
- location
- date_from
- date_to
- only_future

Sortierung:

start_datetime aufsteigend

---

## GET /events/{id}

Lädt einzelnes Event inkl.:

- Teilnehmer
- Creator
- Join-Status

---

## POST /events/{id}/join

- verhindert doppelte Teilnahme
- erstellt neuen Eintrag in event_participants

---

## DELETE /events/{id}/leave

- entfernt Teilnahme
- Fehler wenn Nutzer nicht Teilnehmer ist

---

## PATCH /events/{id}

- nur Creator darf bearbeiten
- partielle Updates möglich
- Datumsvalidierung aktiv

---

## DELETE /events/{id}

- nur Creator darf löschen
- löscht zusätzlich alle Teilnehmer-Einträge

---

# 8. Nutzerbezogene Events

Datei:

backend/app/api/users.py

---

## GET /users/me/events-created

- alle Events des Creators
- sortiert nach start_datetime

---

## GET /users/me/events-joined

- alle Events, denen der Nutzer beigetreten ist

---

## Response-Struktur

Beide Endpunkte liefern:

- participants
- participants_preview
- participants_count
- is_joined

---

# 9. Teilnehmerlogik

---

## Beziehung

- Many-to-Many über event_participants

---

## Struktur

Teilnehmer werden zurückgegeben als:

{
"username": "...",
"first_name": "...",
"last_name": "..."
}

---

## participants_preview

Erste 3 Teilnehmer:

participants[:3]

---

## participants_count

Anzahl der Teilnehmer

---

## is_joined

True / False für aktuellen Nutzer

---

# 10. Zugriff & Auth

Alle Event-Endpunkte benötigen:

- gültigen Site Access
- eingeloggten User

---

# 11. Architekturentscheidungen

---

## Zentrale Serialisierung

serialize_event sorgt für:

- konsistente Responses
- weniger Code-Duplikation

---

## Teilnehmer als Objekte

Ermöglicht:

- flexible UI (Avatare, Initialen)
- bessere Erweiterbarkeit

---

## Trennung events / users

- bessere Struktur
- klarere Verantwortlichkeiten

---

# 12. Datenbank

Tabellen:

- users
- events
- event_participants

---

## Wichtige Felder

users:

- first_name
- last_name

events:

- lineup
- official_link
- start_datetime
- end_datetime

---

# 13. Testfälle

- Event ohne Endzeit
- Event mit falscher Zeit → Fehler
- Join doppelt → Fehler
- Leave ohne Teilnahme → Fehler
- Creator-only Aktionen prüfen
- participants_preview korrekt

---

# 14. Technische Einschränkungen

---

## N+1 Queries

Teilnehmer & Creator werden pro Event geladen.

→ später optimieren

---

## Delete ohne Cascade

Teilnehmer werden aktuell manuell gelöscht.

→ später ORM cascade nutzen

---

# 15. Ergebnis

✔ vollständige Event-CRUD API  
✔ Join/Leave  
✔ strukturierte Teilnehmer  
✔ participants_preview  
✔ participants_count  
✔ is_joined  
✔ neue Event-Struktur ohne genre  
✔ lineup statt description

---

# 16. Nächste Schritte

- Pagination
- Performance (Joins)
- Rollen & Permissions
- Soft Delete
- CSRF-Schutz

---

# Zusammenfassung

Das Backend stellt nun ein vollständiges Event-System bereit:

- Events erstellen und verwalten
- Teilnahme steuern
- strukturierte Teilnehmerdaten liefern
- moderne, frontendfreundliche API bereitstellen

Damit bildet das Event-System den Kern der Anwendung.
