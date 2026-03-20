from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.core.database import get_db
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.user import User
from app.schemas.event import EventRead


def serialize_event(event: Event, creator_username: str) -> EventRead:
    return EventRead(
        id=event.id,
        creator_id=event.creator_id,
        creator_username=creator_username,
        title=event.title,
        description=event.description,
        location=event.location,
        genre=event.genre,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        created_at=event.created_at,
        updated_at=event.updated_at,
    )


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/events-created", response_model=list[EventRead], status_code=status.HTTP_200_OK)
def get_my_created_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    events = db.scalars(
        select(Event)
        .where(Event.creator_id == current_user.id)
        .order_by(Event.start_datetime.asc())
    ).all()

    result = []
    for event in events:
        result.append(serialize_event(event, current_user.username))

    return result


@router.get("/me/events-joined", response_model=list[EventRead], status_code=status.HTTP_200_OK)
def get_my_joined_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    events = db.scalars(
        select(Event)
        .join(EventParticipant, EventParticipant.event_id == Event.id)
        .where(EventParticipant.user_id == current_user.id)
        .order_by(Event.start_datetime.asc())
    ).all()

    result = []
    for event in events:
        creator = db.get(User, event.creator_id)
        creator_username = creator.username if creator else "Unknown"
        result.append(serialize_event(event, creator_username))

    return result