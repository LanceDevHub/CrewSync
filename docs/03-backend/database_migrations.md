# Datenbankmodelle und Migrationen

Dieses Dokument beschreibt die Entwicklung der Datenbankstruktur der Anwendung.

Es umfasst:

- die SQLAlchemy-Datenbankmodelle
- die Tabellen users, events und event_participants
- die Einführung und Nutzung von Alembic
- die Weiterentwicklung des Schemas im Verlauf des Projekts
- den späteren Reset auf ein neues konsolidiertes Initialschema

---

# 1. Ziel dieses Abschnitts

Ziel war es, eine saubere, versionierbare und reproduzierbare Datenbankstruktur aufzubauen, die die zentralen Funktionen der Anwendung abbildet:

- Benutzerkonten
- Musik-Events
- Event-Teilnahmen

---

# 2. Ausgangssituation

Zu Beginn lief das Backend bereits mit:

- FastAPI
- SQLAlchemy
- einer funktionierenden Datenbankverbindung
- .env-Konfiguration
- einer zentralen Base

---

# 3. SQLAlchemy-Modelle

Die Modelle befinden sich in:

backend/app/models/

- user.py
- event.py
- event_participant.py

---

# 4. Modell: User

Datei: backend/app/models/user.py

Wichtige Felder:

- id
- username
- email
- password_hash
- first_name
- last_name
- is_active
- created_at
- updated_at

Zweck:

- Benutzerkonten
- Authentifizierung
- Grundlage für Events

Wichtige Änderung:

- first_name und last_name wurden später ergänzt

---

# 5. Modell: Event

Datei: backend/app/models/event.py

Aktuelle Felder:

- id
- creator_id
- title
- lineup
- location
- official_link
- start_datetime
- end_datetime
- created_at
- updated_at

---

## Frühere Struktur

Früher vorhanden:

- description
- genre
- event_date
- max_participants

---

## Änderungen

- description → lineup
- event_date → start_datetime
- end_datetime hinzugefügt
- official_link hinzugefügt
- genre entfernt
- max_participants entfernt

---

# 6. Modell: EventParticipant

Datei: backend/app/models/event_participant.py

Felder:

- id
- event_id
- user_id
- joined_at

Constraint:

- (event_id, user_id) ist einzigartig

Zweck:

- Teilnahme an Events
- Join / Leave Logik

---

# 7. Warum Migrationen

Direktes create_all ist ungeeignet, weil:

- keine Versionierung
- schwer wartbar
- problematisch im Team

---

# 8. Alembic

Alembic wurde eingeführt für:

- versionierte Schemaänderungen
- Upgrades / Downgrades
- automatische Migrationen

---

# 9. Struktur

backend/alembic/

- env.py
- versions/

---

# 10. Migrationen im Verlauf

Beispiele:

- initiale Tabellen
- neue Zeitstruktur
- lineup statt description
- official_link hinzugefügt
- first_name / last_name hinzugefügt

---

# 11. Probleme

- SQLite Einschränkungen
- NOT NULL Probleme
- fehlerhafte Revisionen

---

# 12. Reset

Da keine Daten vorhanden waren:

- Migrationen gelöscht
- DB gelöscht
- neue Initialmigration erstellt

---

# 13. Aktuelles Schema

Tabellen:

- users
- events
- event_participants
- alembic_version

---

## users

- username
- email
- password_hash
- first_name
- last_name

---

## events

- creator_id
- title
- lineup
- location
- official_link
- start_datetime
- end_datetime

---

## event_participants

- event_id
- user_id

---

# 14. Zustand

Die DB unterstützt jetzt:

- Auth
- Events
- Teilnehmer
- Profile

---

# 15. Vorteile

- sauber
- versioniert
- reproduzierbar
- konsistent

---

# 16. Erkenntnisse

- Schema entwickelt sich iterativ
- SQLite ist limitiert
- Reset kann sinnvoll sein

---

# 17. Projektstand

- User mit Namen
- Events mit Lineup
- Zeitstruktur
- Teilnehmer-System

---

# 18. Nächste Schritte

- PostgreSQL
- Rollen
- Soft Delete
- Cascade Delete

---

# Zusammenfassung

Die Datenbank wurde aufgebaut, mehrfach angepasst und schließlich in einer neuen Initialmigration konsolidiert.

Sie bildet die Grundlage für:

- Authentifizierung
- Events
- Teilnehmer
