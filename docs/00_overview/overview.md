# Projektüberblick

## Zweck

Die Plattform dient zur Organisation und Teilnahme an Musik-Events. Nutzer können Konten erstellen, sich anmelden, Events anlegen, suchen, beitreten und verwalten. Der Fokus liegt auf einem klaren MVP mit späterer Erweiterbarkeit.

## Kernfunktionen

- Registrierung und Login.
- JWT-basierte Authentifizierung per HttpOnly-Cookie.
- Event-Erstellung, -Suche und -Verwaltung.
- Join/Leave-Logik für Events.
- Profil- und Teilnehmeransichten.

## Architektur in kurz

- Frontend: React, TypeScript, Vite.
- Backend: FastAPI, Python.
- Datenbank: PostgreSQL, zuvor SQLite.
- Datenzugriff: SQLAlchemy und Alembic.

## Leitprinzipien

- Klare Trennung von UI, Logik und Persistenz.
- Sicherheitskritische Regeln im Backend.
- Modularer Monolith für das MVP.
- Kompakt dokumentierte, aber erweiterbare Struktur.
