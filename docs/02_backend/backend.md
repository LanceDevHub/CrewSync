# Backend

## Zuständigkeit

Das Backend ist die zentrale Logikschicht. Es verarbeitet Requests, prüft Berechtigungen, validiert Daten und kommuniziert mit der Datenbank.

## Bestandteile

- `api/` für Router und Endpunkte.
- `core/` für Konfiguration, Sicherheit und DB-Zugriff.
- `models/` für SQLAlchemy-Modelle.
- `schemas/` für Pydantic-Schemas.

## Authentifizierung

- Registrierung, Login, `me`, Logout.
- Passwort-Hashing mit Argon2.
- JWT in HttpOnly-Cookies.
- Cookie-Sicherheit mit `SameSite` und `secure`-Hinweisen.

## Accounts und Zugriff

- Username- und Passwort-Änderung.
- Authentifizierter Zugriff über `getcurrentuser`.
- Zusätzliches Site-Access-Gate per Masterpasswort.

## Events

- Events erstellen, lesen, bearbeiten, löschen.
- Join/Leave-Logik.
- Strukturierte Teilnehmerdaten.
- Backend-Validierung für Zeit- und URL-Felder.

## Admin

- Geschützte Admin-Autorisierung für Verwaltungsfunktionen.
- Trennung zwischen normalen Nutzern und erweiterten Rechten.
