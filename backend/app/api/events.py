from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.event import Event
from app.models.event_participant import EventParticipant
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

@router.get("", response_model=list[EventRead], status_code=status.HTTP_200_OK)
def list_events(db: Session = Depends(get_db)):
    events = db.scalars(
        select(Event).order_by(Event.event_date.asc())
    ).all()

    return events

@router.post("/{event_id}/join", status_code=status.HTTP_201_CREATED)
def join_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    existing_participation = db.scalar(
        select(EventParticipant).where(
            EventParticipant.event_id == event_id,
            EventParticipant.user_id == current_user.id,
        )
    )

    if existing_participation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already joined this event.",
        )

    new_participation = EventParticipant(
        event_id=event_id,
        user_id=current_user.id,
    )

    db.add(new_participation)
    db.commit()
    db.refresh(new_participation)

    return {"message": "Successfully joined event."}

@router.delete("/{event_id}/leave", status_code=status.HTTP_200_OK)
def leave_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    participation = db.scalar(
        select(EventParticipant).where(
            EventParticipant.event_id == event_id,
            EventParticipant.user_id == current_user.id,
        )
    )

    if participation is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have not joined this event.",
        )

    db.delete(participation)
    db.commit()

    return {"message": "Successfully left event."}