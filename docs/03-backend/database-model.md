# Datenbankmodell

## 1. Ziel des Datenbankmodells

Die Datenbank speichert die zentralen Informationen der Webanwendung dauerhaft.

Für das MVP werden drei Kernbereiche abgebildet:

- Benutzerkonten
- Musik-Events
- Teilnahme von Nutzern an Events

Das Datenmodell ist bewusst schlank gehalten, bildet aber bereits die aktuelle fachliche Struktur der Anwendung ab.

---

# 2. Verwendete Datenbank

Für die Entwicklung wird aktuell **SQLite** verwendet.

Warum SQLite:

- sehr schnell für lokale Entwicklung
- keine zusätzliche Installation nötig
- ideal für MVP-Phase

Hinweis:

In späteren Phasen ist ein Wechsel zu **PostgreSQL** geplant.

---

# 3. Tabellenübersicht

Im aktuellen Stand werden folgende Tabellen verwendet:

- users
- events
- event_participants

---

# 4. Tabelle users

Die Tabelle users speichert alle registrierten Benutzerkonten.

## Zweck

- Authentifizierung
- Darstellung von Teilnehmern
- Zuordnung von Events zu Erstellern

## Felder

- id → eindeutige ID
- username → eindeutiger Benutzername
- email → eindeutige E-Mail-Adresse
- password_hash → gehashter Passwortwert
- first_name → Vorname
- last_name → Nachname
- is_active → ob Nutzer aktiv ist
- created_at → Erstellung
- updated_at → letzte Änderung

## Regeln

- username ist eindeutig
- email ist eindeutig
- password wird niemals im Klartext gespeichert
- first_name und last_name sind Pflichtfelder

---

# 5. Tabelle events

Die Tabelle events speichert alle Musik-Events.

## Zweck

- zentrale fachliche Einheit der Plattform
- Grundlage für Event-Listen und Detailseiten

## Aktuelle Felder

- id → eindeutige Event-ID
- creator_id → Verweis auf users.id
- title → Titel des Events
- lineup → Beschreibung der Acts / Künstler
- location → Veranstaltungsort
- official_link → optionaler externer Link
- start_datetime → Startzeit
- end_datetime → optionales Enddatum
- created_at → Erstellung
- updated_at → letzte Änderung

---

## Wichtige Änderungen zur alten Struktur

Folgende Felder wurden entfernt:

- description → ersetzt durch lineup
- genre → vollständig entfernt
- event_date → ersetzt durch start_datetime
- max_participants → entfernt

---

## Regeln

- creator_id ist Fremdschlüssel auf users.id
- title ist Pflichtfeld
- lineup ist Pflichtfeld
- location ist Pflichtfeld
- start_datetime ist Pflichtfeld
- end_datetime ist optional
- ein Event gehört genau einem Ersteller

---

# 6. Tabelle event_participants

Diese Tabelle speichert die Teilnahme von Nutzern an Events.

## Zweck

Many-to-Many Beziehung zwischen users und events

Ein Nutzer kann mehreren Events beitreten  
Ein Event kann mehrere Teilnehmer haben

## Felder

- id → eindeutige ID
- event_id → Referenz auf events.id
- user_id → Referenz auf users.id
- joined_at → Zeitpunkt des Beitritts

## Regeln

- Kombination (event_id, user_id) ist eindeutig
- ein Nutzer kann einem Event nur einmal beitreten

---

# 7. Beziehungen

## Nutzer erstellt Events

users (1) → (n) events

events.creator_id → users.id

---

## Nutzer tritt Events bei

users (n) ↔ (m) events

über event_participants

event_participants.user_id → users.id  
event_participants.event_id → events.id

---

# 8. Modellierungsentscheidungen

## Ersteller ≠ Teilnehmer

Der Event-Ersteller ist nicht automatisch Teilnehmer.

Das bedeutet:

- creator kann joinen oder nicht
- klare Trennung von Rollen

---

## Keine Rollen im MVP

Alle Nutzer sind gleichberechtigt.

Später möglich:

- Admin
- Moderator

---

## Keine Soft Deletes

Einträge werden aktuell hart gelöscht.

---

## Zeitmodell

Events haben:

- start_datetime
- optional end_datetime

Das erlaubt:

- flexible Zeitdarstellung
- zukünftige Erweiterungen

---

## Strukturierte Teilnehmerdaten

Teilnehmer werden nicht nur als Username gespeichert, sondern enthalten:

- username
- first_name
- last_name

Dadurch kann das Frontend:

- Initialen anzeigen
- Namen darstellen
- Detailansichten bauen

---

# 9. Indizes

users:

- unique(username)
- unique(email)

events:

- index(creator_id)
- index(start_datetime)

event_participants:

- index(event_id)
- index(user_id)
- unique(event_id, user_id)

---

# 10. Aktueller Stand

Die Datenbank unterstützt jetzt vollständig:

- Registrierung & Login
- Event-Erstellung
- Event-Bearbeitung
- Event-Teilnahme
- Teilnehmerlisten
- Profilseiten

---

# 11. Zukünftige Erweiterungen

Mögliche Erweiterungen:

- PostgreSQL Migration
- Rollen & Rechte
- Soft Delete
- Event-Bilder
- Kommentare
- Notifications
- Pagination
- Performance-Optimierungen

---

# 12. Zusammenfassung

Das Datenbankmodell besteht aus:

- users
- events
- event_participants

Es ermöglicht:

- Benutzerverwaltung
- Musik-Events mit Lineup
- strukturierte Teilnehmerdarstellung
- Join / Leave Logik

Das Modell ist aktuell konsistent, schlank und bereit für Erweiterungen.
