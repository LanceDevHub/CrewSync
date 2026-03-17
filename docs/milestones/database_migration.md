# Datenbankmodelle und Migrationen (User, Event, EventParticipant)

Dieses Dokument beschreibt die Schritte, die im Projekt durchgeführt wurden, um:

- Datenbankmodelle mit **SQLAlchemy** zu erstellen
- Tabellen für **users**, **events** und **event_participants** zu definieren
- **Alembic** für versionierte Datenbankmigrationen einzurichten
- das Datenbankschema sauber und reproduzierbar zu verwalten

Der Abschnitt beginnt bei der Erstellung der ersten Modelle (`user.py`) und endet bei dem Punkt, an dem die Tabellen erfolgreich über **Alembic-Migrationen** erzeugt wurden.

---

# 1. Ausgangssituation

Zu Beginn lief das Backend bereits mit:

- **FastAPI**
- **SQLAlchemy**
- einer funktionierenden **Datenbankverbindung**
- einer `.env`-Konfiguration
- einer zentralen DB-Basis (`Base`)

Vorhandene Infrastruktur:

```
backend/
├─ app/
│  ├─ core/
│  │  ├─ config.py
│  │  └─ database.py
│  └─ main.py
```

Diese Dateien stellten bereits bereit:

- Konfigurationsmanagement (`config.py`)
- Datenbankengine und Session (`database.py`)

---

# 2. Erstellung der Datenbankmodelle

Im nächsten Schritt wurden die **Domain-Modelle** erstellt.

Diese Modelle definieren die Struktur der Datenbanktabellen über SQLAlchemy.

Ordnerstruktur:

```
backend/app/models/
├─ __init__.py
├─ user.py
├─ event.py
└─ event_participant.py
```

---

# 3. Modell: User (`user.py`)

Dieses Modell beschreibt registrierte Benutzer.

Beispielstruktur:

```python
class User(Base):
    __tablename__ = "users"

    id = mapped_column(primary_key=True)
    username = mapped_column(String(50), unique=True, nullable=False)
    email = mapped_column(String(255), unique=True, nullable=False)
    password_hash = mapped_column(String(255), nullable=False)

    is_active = mapped_column(Boolean, default=True)

    created_at = mapped_column(DateTime, default=datetime.utcnow)
    updated_at = mapped_column(DateTime, default=datetime.utcnow)
```

Zweck der Tabelle:

- Speicherung von Benutzerkonten
- Grundlage für Authentifizierung
- Grundlage für Event-Erstellung

---

# 4. Modell: Event (`event.py`)

Dieses Modell beschreibt Musik-Events.

Wichtige Felder:

- Titel
- Beschreibung
- Ort
- Datum
- optionales Genre
- optional maximale Teilnehmerzahl
- Referenz zum Ersteller

Beispielstruktur:

```python
class Event(Base):
    __tablename__ = "events"

    id = mapped_column(primary_key=True)

    creator_id = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    title = mapped_column(String(150), nullable=False)
    description = mapped_column(Text, nullable=False)
    location = mapped_column(String(255), nullable=False)

    genre = mapped_column(String(100), nullable=True)

    event_date = mapped_column(DateTime, nullable=False)

    max_participants = mapped_column(Integer, nullable=True)

    created_at = mapped_column(DateTime)
    updated_at = mapped_column(DateTime)
```

Zweck der Tabelle:

- Speicherung von Musik-Events
- Verbindung zu einem Ersteller (`creator_id`)

---

# 5. Modell: EventParticipant (`event_participant.py`)

Diese Tabelle bildet eine **Many-to-Many-Beziehung** zwischen Nutzern und Events.

Ein Nutzer kann mehreren Events beitreten.
Ein Event kann mehrere Teilnehmer haben.

Beispielstruktur:

```python
class EventParticipant(Base):
    __tablename__ = "event_participants"

    __table_args__ = (
        UniqueConstraint("event_id", "user_id"),
    )

    id = mapped_column(primary_key=True)

    event_id = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    user_id = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    joined_at = mapped_column(DateTime)
```

Besonders wichtig:

```
UniqueConstraint("event_id", "user_id")
```

Dies verhindert, dass ein Nutzer **mehrfach dem gleichen Event beitritt**.

---

# 6. Warum Migrationen notwendig sind

Anfangs können Tabellen über SQLAlchemy mit

```
Base.metadata.create_all()
```

erstellt werden.

Dieses Vorgehen hat jedoch Nachteile:

- Änderungen an Tabellen sind schwer nachvollziehbar
- Datenbankschema ist nicht versioniert
- Zusammenarbeit im Team wird schwierig
- Produktionsdatenbanken können nicht sauber aktualisiert werden

Deshalb wird ein Migrationstool verwendet.

---

# 7. Einführung von Alembic

**Alembic** ist das offizielle Migrationstool für SQLAlchemy.

Es ermöglicht:

- versionierte Änderungen am Datenbankschema
- automatisches Generieren von Migrationen
- kontrolliertes Upgraden und Downgraden der Datenbank
- reproduzierbare Datenbankstruktur in jeder Umgebung

Mit Alembic wird jede Schemaänderung als **Migration** gespeichert.

Beispiel:

```
create users table
add column genre to events
add constraint to participants
```

Diese Änderungen können später jederzeit reproduziert werden.

---

# 8. Installation von Alembic

Im Backend-Verzeichnis:

```bash
pip install alembic
```

---

# 9. Initialisierung von Alembic

Im `backend`-Ordner:

```bash
alembic init alembic
```

Dadurch entstehen:

```
backend/
├─ alembic/
│  ├─ versions/
│  └─ env.py
├─ alembic.ini
```

Diese Struktur verwaltet alle zukünftigen Migrationen.

---

# 10. Verbindung mit dem Projekt

In `alembic/env.py` wurde Alembic mit dem Projekt verbunden.

Wichtige Imports:

```python
from app.core.config import settings
from app.core.database import Base
from app.models import User, Event, EventParticipant
```

Außerdem:

```python
target_metadata = Base.metadata
```

Dies erlaubt Alembic, die SQLAlchemy-Modelle mit der Datenbank zu vergleichen.

---

# 11. Erste Migration erzeugen

Migration erstellen:

```bash
alembic revision --autogenerate -m "create initial tables"
```

Alembic vergleicht:

- aktuelle Datenbank
- SQLAlchemy-Modelle

und erzeugt daraus ein Migrationsskript.

Dieses Skript enthält z. B.:

```
op.create_table("users")
op.create_table("events")
op.create_table("event_participants")
```

---

# 12. Migration ausführen

Migration anwenden:

```bash
alembic upgrade head
```

Dadurch wird das Schema tatsächlich in der Datenbank erstellt.

---

# 13. Ergebnis in der Datenbank

Die Datenbank enthält nun folgende Tabellen:

```
[
 ('alembic_version',),
 ('users',),
 ('events',),
 ('event_participants',)
]
```

### Erklärung

| Tabelle            | Zweck                        |
| ------------------ | ---------------------------- |
| users              | Benutzerkonten               |
| events             | Musik-Events                 |
| event_participants | Event-Teilnahmen             |
| alembic_version    | verwaltet aktuelle Migration |

Die Tabelle `alembic_version` speichert, welche Migration zuletzt angewendet wurde.

---

# 14. Vorteile des aktuellen Setups

Die Datenbank ist nun:

- reproduzierbar
- versioniert
- migrationsfähig
- sauber strukturiert
- mit SQLAlchemy-Modellen verbunden

Neue Änderungen am Schema können später einfach erstellt werden mit:

```
alembic revision --autogenerate
```

und angewendet werden mit:

```
alembic upgrade head
```

---

# 15. Aktueller Stand des Projekts

Backend-Infrastruktur:

✔ FastAPI Server läuft
✔ Konfigurationssystem mit `.env`
✔ SQLAlchemy Datenbankbasis
✔ drei Domain-Modelle
✔ Alembic Migrationen
✔ versioniertes Datenbankschema

---

# 16. Nächste Entwicklungsschritte

Die nächsten sinnvollen Schritte im Projekt sind:

1. **Pydantic Schemas erstellen**

```
backend/app/schemas/
├─ user.py
├─ event.py
└─ auth.py
```

2. **Passwort-Hashing implementieren**

3. **Registrierungs-Endpunkt**

```
POST /auth/register
```

4. **Login-Endpunkt**

5. **Event-API**

```
POST /events
GET /events
POST /events/{id}/join
```

---

# Zusammenfassung

In diesem Abschnitt wurde:

1. das **Datenbankmodell implementiert**
2. **SQLAlchemy-Modelle erstellt**
3. **Alembic eingeführt**
4. die **erste Migration erzeugt**
5. das **initiale Datenbankschema erstellt**

Die Datenbankstruktur bildet nun den fachlichen Kern der Anwendung und dient als Grundlage für die weitere Backend-Entwicklung.
