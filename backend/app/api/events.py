from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.api.deps.site_access import require_site_access
from app.core.database import get_db
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventParticipantPreview,
    EventRead,
    EventUpdate,
)

router = APIRouter(
    prefix="/events",
    tags=["events"],
    dependencies=[Depends(require_site_access)],
)


def serialize_participants(users: list[User]) -> list[EventParticipantPreview]:
    return [
        EventParticipantPreview(
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
        )
        for user in users
    ]


def serialize_event(
    event: Event,
    creator_username: str,
    participants: list[EventParticipantPreview],
    is_joined: bool,
) -> EventRead:
    return EventRead(
        id=event.id,
        creator_id=event.creator_id,
        creator_username=creator_username,
        title=event.title,
        lineup=event.lineup,
        location=event.location,
        official_link=event.official_link,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        created_at=event.created_at,
        updated_at=event.updated_at,
        participants_count=len(participants),
        participants_preview=participants[:3],
        participants=participants,
        is_joined=is_joined,
    )


def get_event_participants(db: Session, event_id: int) -> list[User]:
    return db.scalars(
        select(User)
        .join(EventParticipant, EventParticipant.user_id == User.id)
        .where(EventParticipant.event_id == event_id)
    ).all()


@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_event = Event(
        creator_id=current_user.id,
        title=event_data.title,
        lineup=event_data.lineup,
        location=event_data.location,
        official_link=event_data.official_link,
        start_datetime=event_data.start_datetime,
        end_datetime=event_data.end_datetime,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return serialize_event(new_event, current_user.username, [], False)


@router.get("", response_model=list[EventRead], status_code=status.HTTP_200_OK)
def list_events(
    q: str | None = Query(default=None),
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
                Event.lineup.ilike(search_term),
                Event.location.ilike(search_term),
            )
        )

    if location:
        query = query.where(Event.location.ilike(f"%{location}%"))

    if date_from:
        query = query.where(Event.start_datetime >= date_from)

    if date_to:
        query = query.where(Event.start_datetime <= date_to)

    if only_future:
        query = query.where(Event.start_datetime >= datetime.utcnow())

    query = query.order_by(Event.start_datetime.asc())

    events = db.scalars(query).all()

    result = []
    for event in events:
        creator = db.get(User, event.creator_id)
        creator_username = creator.username if creator else "Unknown"

        participants_users = get_event_participants(db, event.id)
        participants_data = serialize_participants(participants_users)
        is_joined = any(user.id == current_user.id for user in participants_users)

        result.append(
            serialize_event(
                event,
                creator_username,
                participants_data,
                is_joined,
            )
        )

    return result


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

    creator = db.get(User, event.creator_id)
    creator_username = creator.username if creator else "Unknown"

    participants_users = get_event_participants(db, event.id)
    participants_data = serialize_participants(participants_users)
    is_joined = any(user.id == current_user.id for user in participants_users)

    return serialize_event(
        event,
        creator_username,
        participants_data,
        is_joined,
    )


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

    if event.creator_id != current_user.id and not current_user.is_admin:
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

    creator = db.get(User, event.creator_id)
    creator_username = creator.username if creator else "Unknown"

    participants_users = get_event_participants(db, event.id)
    participants_data = serialize_participants(participants_users)
    is_joined = any(user.id == current_user.id for user in participants_users)

    return serialize_event(
        event,
        creator_username,
        participants_data,
        is_joined,
    )


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

    if event.creator_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this event.",
        )

    participations = db.scalars(
        select(EventParticipant).where(EventParticipant.event_id == event_id)
    ).all()

    for participation in participations:
        db.delete(participation)

    db.flush()  # wichtig

    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully."}