from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventRead
from app.api.deps.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/events", tags=["events"])

@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_event = Event(
        creator_id=current_user.id,
        title=event_data.title,
        description=event_data.description,
        location=event_data.location,
        genre=event_data.genre,
        event_date=event_data.event_date,
        max_participants=event_data.max_participants,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event