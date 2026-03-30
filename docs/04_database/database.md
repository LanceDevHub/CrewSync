# Datenbank

## Kernmodell

Die Datenbank bildet drei zentrale Bereiche ab:

- `users`
- `events`
- `eventparticipants`

## Beziehungen

- Ein User kann mehrere Events erstellen.
- Ein Event gehört genau einem Ersteller.
- Users und Events sind über eine Join-Tabelle verbunden.

## Wichtige Felder

- Users: Username, E-Mail, Passwort-Hash, Vorname, Nachname.
- Events: Creator, Titel, Lineup, Ort, Link, Startzeit, Endzeit.
- Teilnehmer: Event-ID, User-ID, Beitrittszeit.

## Entwicklung

- Frühe lokale Entwicklung mit SQLite.
- Umstellung auf PostgreSQL für produktionsnahe Nutzung. (IST-Zustand)
- Schema-Versionierung mit Alembic vorgesehen bzw. eingeführt.

## Ziel

- Saubere Persistenz.
- Erweiterbare Struktur.
- Klare Unterstützung für Auth, Events und Teilnehmerdarstellung.
