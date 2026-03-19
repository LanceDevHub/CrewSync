# Datenbankmodell

## 1. Ziel des Datenbankmodells

Die Datenbank speichert die zentralen Informationen der Webanwendung dauerhaft.

Für das MVP werden drei Kernbereiche abgebildet:

- Benutzerkonten
- Musik-Events
- Teilnahme von Nutzern an Events

Das Datenmodell ist bewusst schlank gehalten, damit die Grundfunktionalität der Plattform klar und nachvollziehbar umgesetzt werden kann.

---

# 2. Verwendete Datenbank

Für das Projekt wird **PostgreSQL** verwendet.

PostgreSQL eignet sich für dieses Projekt, weil:

- relationale Daten sauber abgebildet werden können
- Beziehungen zwischen Nutzern und Events einfach modellierbar sind
- Filter-, Such- und Datumsabfragen gut unterstützt werden
- das System später problemlos erweitert werden kann

Die Datenbankstruktur wird im Backend mit SQLAlchemy-Modellen beschrieben und über Migrationen verwaltet.

---

# 3. Tabellenübersicht

Im MVP werden folgende Tabellen verwendet:

1. `users`
2. `events`
3. `event_participants`

---

# 4. Tabelle `users`

Die Tabelle `users` speichert alle registrierten Benutzerkonten.

## Zweck

Sie enthält die grundlegenden Informationen eines Nutzers und dient als Basis für Authentifizierung und Benutzerverwaltung.

## Felder

| Feld          | Beschreibung                        |
| ------------- | ----------------------------------- |
| id            | Eindeutige ID des Nutzers           |
| username      | Eindeutiger Benutzername            |
| email         | Eindeutige E-Mail-Adresse           |
| password_hash | Sicher gehashter Passwortwert       |
| is_active     | Gibt an, ob der Nutzer aktiv ist    |
| created_at    | Zeitpunkt der Erstellung des Kontos |
| updated_at    | Zeitpunkt der letzten Änderung      |

## Regeln und Constraints

- `id` ist Primärschlüssel
- `username` ist eindeutig
- `email` ist eindeutig
- `password_hash` darf nie leer sein
- Passwörter werden niemals im Klartext gespeichert
- `is_active` ist standardmäßig `true`

---

# 5. Tabelle `events`

Die Tabelle `events` speichert alle Musik-Events, die von Nutzern erstellt wurden.

## Zweck

Sie bildet die zentrale fachliche Einheit der Plattform ab.

## Felder

| Feld             | Beschreibung                                       |
| ---------------- | -------------------------------------------------- |
| id               | Eindeutige ID des Events                           |
| creator_id       | Verweis auf den Nutzer, der das Event erstellt hat |
| title            | Titel des Events                                   |
| description      | Beschreibung des Events                            |
| location         | Veranstaltungsort oder Treffpunkt                  |
| genre            | Musikrichtung des Events (optional)                |
| event_date       | Datum und Uhrzeit des Events                       |
| max_participants | Maximale Teilnehmerzahl (optional)                 |
| created_at       | Zeitpunkt der Erstellung                           |
| updated_at       | Zeitpunkt der letzten Änderung                     |

## Regeln und Constraints

- `id` ist Primärschlüssel
- `creator_id` ist Fremdschlüssel auf `users.id`
- `title` ist Pflichtfeld
- `description` ist Pflichtfeld
- `location` ist Pflichtfeld
- `event_date` ist Pflichtfeld
- `max_participants` ist optional
- ein Event gehört genau einem Ersteller

---

# 6. Tabelle `event_participants`

Die Tabelle `event_participants` speichert, welche Nutzer welchen Events beigetreten sind.

## Zweck

Sie bildet die **Many-to-Many-Beziehung** zwischen Nutzern und Events ab.

Ein Nutzer kann mehreren Events beitreten.
Ein Event kann mehrere Teilnehmer haben.

## Felder

| Feld      | Beschreibung                         |
| --------- | ------------------------------------ |
| id        | Eindeutige ID des Teilnahme-Eintrags |
| event_id  | Verweis auf das Event                |
| user_id   | Verweis auf den teilnehmenden Nutzer |
| joined_at | Zeitpunkt des Beitritts              |

## Regeln und Constraints

- `id` ist Primärschlüssel
- `event_id` ist Fremdschlüssel auf `events.id`
- `user_id` ist Fremdschlüssel auf `users.id`
- Kombination aus `event_id` und `user_id` ist eindeutig
- ein Nutzer kann einem Event nur einmal beitreten

---

# 7. Beziehungen zwischen den Tabellen

## Nutzer erstellt Events

Ein Nutzer kann mehrere Events erstellen.

Beziehung:

```
users (1) → (n) events
```

Verknüpfung:

```
events.creator_id → users.id
```

---

## Nutzer tritt Events bei

Ein Nutzer kann mehreren Events beitreten.
Ein Event kann mehrere Teilnehmer haben.

Beziehung:

```
users (n) ↔ (m) events
```

Diese Beziehung wird über die Tabelle `event_participants` umgesetzt.

Verknüpfungen:

```
event_participants.user_id → users.id
event_participants.event_id → events.id
```

---

# 8. Modellierungsentscheidungen

## Event-Ersteller und Teilnehmer sind getrennt

Der Ersteller eines Events wird über `creator_id` gespeichert.

Teilnehmer werden über die Tabelle `event_participants` verwaltet.

Damit bleibt klar unterscheidbar:

- wer das Event erstellt hat
- wer dem Event beigetreten ist

Der Ersteller ist im MVP **nicht automatisch Teilnehmer** kann aber teilnehmen.

---

## Keine Rollen im MVP

Alle Nutzer sind zunächst normale Nutzer.

Ein Rollenmodell (Admin / Moderator etc.) kann später ergänzt werden.

---

## Keine Soft Deletes

Im MVP werden Einträge normal gelöscht.

Soft-Delete-Mechanismen können später ergänzt werden.

---

## Kein Event-Status

Events besitzen im MVP keinen Status wie:

- draft
- published
- cancelled

Die zeitliche Einordnung erfolgt ausschließlich über `event_date`.

---

# 9. Empfohlene Indizes

## Tabelle `users`

- Unique Index auf `username`
- Unique Index auf `email`

## Tabelle `events`

- Index auf `creator_id`
- Index auf `event_date`

## Tabelle `event_participants`

- Index auf `event_id`
- Index auf `user_id`
- Unique Constraint auf `(event_id, user_id)`

Diese Indizes verbessern insbesondere:

- Login-Abfragen
- Event-Suchen
- Filter nach Datum
- Teilnehmerlisten
- persönliche Eventübersichten

---

# 10. Mögliche zukünftige Erweiterungen

Das Datenmodell kann später erweitert werden, z. B. um:

- Benutzerprofile
- Eventbilder
- Event-Tags oder Kategorien
- Kommentare zu Events
- Event-Status
- Benachrichtigungen
- Favoriten
- Rollenverwaltung

Das aktuelle Modell konzentriert sich bewusst auf die Kernfunktionalität des MVP.

---

# 11. Zusammenfassung

Das Datenbankmodell des MVP besteht aus drei Tabellen:

- `users`
- `events`
- `event_participants`

Diese Struktur ermöglicht:

- Benutzerverwaltung
- Erstellung von Musik-Events
- Teilnahme an Events
- persönliche Eventübersichten

Das Modell ist einfach, klar strukturiert und gut erweiterbar.
