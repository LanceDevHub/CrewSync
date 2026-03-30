# Setup

## Voraussetzungen

- Node.js und npm.
- Python 3.10.
- Virtuelle Python-Umgebung.
- PostgreSQL für die aktuelle Datenbankbasis.

## Projektstruktur

```text
project-root/
├── frontend/
├── backend/
├── docs/
└── .gitignore
```

## Frontend

1. Vite-React-Projekt mit TypeScript anlegen.
2. Abhängigkeiten installieren.
3. Mit `npm run dev` starten.

## Backend

1. Virtuelle Umgebung erstellen und aktivieren.
2. FastAPI und benötigte Pakete installieren.
3. Struktur mit `api`, `core`, `models`, `schemas` anlegen.
4. Mit Uvicorn oder FastAPI CLI starten.

## Environment

Wichtige Variablen:

- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

## Workflow

- Frontend und Backend getrennt starten.
- API über `/docs` testen.
- Datenbankmodell und Auth zuerst aufbauen.
