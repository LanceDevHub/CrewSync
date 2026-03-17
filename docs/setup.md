# Projekt Setup

Diese Datei beschreibt, wie das Projekt **von Grund auf neu eingerichtet wird**.

Das Ziel ist eine lokale Entwicklungsumgebung für:

- React Frontend
- FastAPI Backend
- Dokumentation
- isolierte Python Umgebung
- Environment Variablen

---

# 1. Voraussetzungen

Folgende Software muss installiert sein:

### Node.js

Empfohlen: **Node 20+**

Prüfen:

```bash
node -v
```

### npm

```bash
npm -v
```

### Python

Empfohlen: **Python 3.10+**

Prüfen:

```bash
python3 --version
```

---

# 2. Projektordner erstellen

```bash
mkdir music-events-platform
cd music-events-platform
```

---

# 3. Grundstruktur anlegen

```bash
mkdir frontend backend docs
touch .gitignore
```

Projektstruktur:

```
music-events-platform/
├─ frontend/
├─ backend/
├─ docs/
└─ .gitignore
```

---

# 4. Frontend Setup (React + TypeScript + Vite)

In den Frontend Ordner wechseln:

```bash
cd frontend
```

React Projekt erzeugen:

```bash
npm create vite@latest .
```

Auswahl im CLI:

```
Framework: React
Variant: TypeScript
```

Abhängigkeiten installieren:

```bash
npm install
```

Frontend starten:

```bash
npm run dev
```

Der Entwicklungsserver läuft dann normalerweise unter:

```
http://localhost:5173
```

---

# 5. Backend Setup (FastAPI)

In den Backend Ordner wechseln:

```bash
cd ../backend
```

---

# 6. Python Virtual Environment erstellen

```bash
python3 -m venv .venv
```

Virtual Environment aktivieren.

Mac / Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate
```

---

# 7. FastAPI installieren

```bash
pip install "fastapi[standard]"
```

Optional:

```bash
pip install uvicorn
```

---

# 8. Backend Projektstruktur erstellen

```bash
mkdir -p app/api app/core app/models app/schemas
touch app/main.py
touch .env
```

Struktur:

```
backend/
├─ .venv/
├─ .env
└─ app/
   ├─ api/
   ├─ core/
   ├─ models/
   ├─ schemas/
   └─ main.py
```

---

# 9. Minimale FastAPI Anwendung erstellen

Datei:

```
backend/app/main.py
```

Inhalt:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API running"}
```

---

# 10. Backend starten

Entweder mit FastAPI CLI:

```bash
fastapi dev app/main.py
```

oder mit Uvicorn:

```bash
uvicorn app.main:app --reload
```

Server läuft dann unter:

```
http://localhost:8000
```

API Dokumentation:

```
http://localhost:8000/docs
```

---

# 11. Environment Variablen

Datei:

```
backend/.env
```

Beispielinhalt:

```
APP_NAME=Music Events Platform
DEBUG=true
SECRET_KEY=dev-secret
DATABASE_URL=postgresql://user:password@localhost:5432/music_events
```

Environment Variablen werden verwendet für:

- Datenbankverbindungen
- Secret Keys
- API Konfiguration
- Deployment Einstellungen

---

# 12. .gitignore

Empfohlener Inhalt:

```
# frontend
frontend/node_modules
frontend/dist

# backend
backend/.venv
__pycache__/
*.pyc

# environment files
backend/.env
frontend/.env

# misc
.DS_Store
```

---

# 13. Erste erfolgreiche Projektstruktur

Nach dem Setup sollte das Projekt so aussehen:

```
music-events-platform/
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.ts
│
├─ backend/
│  ├─ .venv/
│  ├─ .env
│  └─ app/
│     ├─ api/
│     ├─ core/
│     ├─ models/
│     ├─ schemas/
│     └─ main.py
│
├─ docs/
│  └─ setup.md
│
└─ .gitignore
```

---

# 14. Entwicklungsworkflow

Frontend starten:

```bash
cd frontend
npm run dev
```

Backend starten:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

---

# 15. Nächster Schritt

Nach erfolgreichem Setup:

1. Datenbankmodell definieren
2. erste API Route erstellen
3. Authentifizierung vorbereiten
4. Event Modelle erstellen
