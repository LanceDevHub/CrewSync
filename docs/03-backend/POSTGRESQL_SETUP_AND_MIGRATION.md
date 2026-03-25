# PostgreSQL Migration Guide – CrewSyncr Backend

## 📌 Ziel

Umstellung der lokalen Datenbank von SQLite auf PostgreSQL, um eine skalierbare, produktionsreife Architektur zu ermöglichen.

---

## 🧱 1. PostgreSQL Installation

PostgreSQL wurde lokal installiert über den offiziellen Installer:

👉 https://www.postgresql.org/download/

### Wichtige Einstellungen während der Installation:

- Benutzer: `postgres`
- Passwort: (selbst gewählt)
- Port: `5432`
- pgAdmin: installiert (optional GUI)

⚠️ Stack Builder wurde **nicht benötigt** und übersprungen.

---

## 🧪 2. Zugriff auf PostgreSQL (psql)

Nach der Installation wurde die SQL Shell (`psql`) geöffnet.

Standardwerte:

```
Server: localhost
Database: postgres
Port: 5432
Username: postgres
Password: <gesetzt bei Installation>
```

---

## 🏗 3. Datenbank erstellen

In der psql-Konsole:

```sql
CREATE DATABASE crewsyncr;
```

Überprüfung:

```sql
\l
```

Verbindung zur DB:

```sql
\c crewsyncr
```

---

## 🔌 4. Python PostgreSQL Treiber installieren

Im Backend-Verzeichnis:

```bash
pip install psycopg[binary]
```

Danach:

```bash
pip freeze > requirements.txt
```

📁 Speicherort:

```
backend/requirements.txt
```

---

## ⚙️ 5. `.env` Konfiguration

Die bestehende SQLite-URL wurde ersetzt durch:

```env
DATABASE_URL=postgresql+psycopg://postgres:<PASSWORT>@localhost:5432/crewsyncr
```

Beispiel:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres123@localhost:5432/crewsyncr
```

---

## 🧩 6. SQLAlchemy Setup prüfen

Datei:

```
app/core/database.py
```

Finale Version:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url,
    echo=settings.debug,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

⚠️ Wichtig:

- Keine SQLite-spezifischen Optionen mehr enthalten
- Kein `check_same_thread`
- Keine `if sqlite` Logik

---

## 🏗 7. Tabellen erstellen

Da noch kein Migrationstool verwendet wird, wurde eine Initialisierungsskript genutzt.

### Datei: `init_db.py`

```python
from app.core.database import Base, engine

from app.models.user import User
from app.models.event import Event
from app.models.event_participant import EventParticipant

Base.metadata.create_all(bind=engine)

print("✅ Tabellen erstellt")
```

Ausführen:

```bash
python init_db.py
```

---

## 🔍 8. Tabellen prüfen

In psql:

```sql
\c crewsyncr
\dt
```

Erwartete Tabellen:

- users
- events
- event_participants

---

## 🚀 9. Backend starten

```bash
uvicorn app.main:app --reload
```

---

## 🧪 10. Funktionstest

Nach Migration wurde geprüft:

- Registrierung
- Login
- Event erstellen
- Event beitreten/verlassen
- Passwort Reset

Alle Funktionen liefen erfolgreich mit PostgreSQL.

---

## 🧠 Architekturentscheidung

### Warum PostgreSQL statt SQLite?

| Feature           | SQLite       | PostgreSQL  |
| ----------------- | ------------ | ----------- |
| Skalierbarkeit    | ❌ gering    | ✅ hoch     |
| Concurrency       | ❌ limitiert | ✅ stark    |
| Production Ready  | ❌ nein      | ✅ ja       |
| Migration Support | ❌ schwierig | ✅ sehr gut |

---

## ⚠️ Aktuelle Einschränkung

Aktuell werden Tabellen erstellt via:

```python
Base.metadata.create_all()
```

➡️ Keine Versionierung
➡️ Keine kontrollierten Schema-Änderungen

---

## 🔜 Nächste Schritte (empfohlen)

1. Alembic Migrationen einführen
2. Datenbank-Versionierung
3. Produktionssetup vorbereiten (Docker / Hosting)

---

## ✅ Ergebnis

Die Anwendung nutzt nun erfolgreich PostgreSQL als persistente Datenbank und ist bereit für skalierbare Weiterentwicklung.

---
