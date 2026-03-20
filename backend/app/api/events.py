from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.core.database import get_db
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.user import User
from app.schemas.event import EventCreate, EventRead, EventUpdate

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
        start_datetime=event_data.start_datetime,
        end_datetime=event_data.end_datetime,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event

@router.get("", response_model=list[EventRead], status_code=status.HTTP_200_OK)
def list_events(
    q: str | None = Query(default=None),
    genre: str | None = Query(default=None),
    location: str | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    only_future: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Event)

    if q:
        search_term = f"%{q}%"
        query = query.where(
            or_(
                Event.title.ilike(search_term),
                Event.description.ilike(search_term),
                Event.location.ilike(search_term),
            )
        )

    if genre:
        query = query.where(Event.genre.ilike(f"%{genre}%"))

    if location:
        query = query.where(Event.location.ilike(f"%{location}%"))

    if date_from:
        query = query.where(Event.start_datetime >= date_from)

    if date_to:
        query = query.where(Event.start_datetime <= date_to)

    if only_future:
        query = query.where(Event.start_datetime >= datetime.utcnow())

    query = query.order_by(Event.start_datetime.asc())

    print("q:", q)
    print("genre:", genre)
    print("location:", location)
    print("date_from:", date_from)
    print("date_to:", date_to)
    print("only_future:", only_future)
    print(query)
    events = db.scalars(query).all()

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

@router.get("/{event_id}", response_model=EventRead, status_code=status.HTTP_200_OK)
def get_event_by_id(
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

    return event

@router.patch("/{event_id}", response_model=EventRead, status_code=status.HTTP_200_OK)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    if event.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to edit this event.",
        )

    update_data = event_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(event, field, value)

    if event.end_datetime is not None and event.end_datetime < event.start_datetime:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_datetime must be after or equal to start_datetime.",
        )

    db.commit()
    db.refresh(event)

    return event


## spaeter maybe mit cascade loesen
# WICHTIG: eventParticipants Eintraege werden ebenfalls geloescht
@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
def delete_event(
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

    if event.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this event.",
        )

    participations = db.scalars(
        select(EventParticipant).where(EventParticipant.event_id == event_id)
    ).all()

    for participation in participations:
        db.delete(participation)

    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully."}