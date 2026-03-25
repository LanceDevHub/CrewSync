from app.core.database import Base, engine

from app.models.user import User
from app.models.event import Event
from app.models.event_participant import EventParticipant

Base.metadata.create_all(bind=engine)

print("✅ Tabellen erstellt")