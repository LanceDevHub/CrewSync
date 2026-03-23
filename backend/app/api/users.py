from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.api.deps.site_access import require_site_access
from app.core.database import get_db
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.user import User
from app.schemas.event import EventParticipantPreview, EventRead

router = APIRouter(
    prefix="/users",
    tags=["users"],
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
        participants_users = db.scalars(
            select(User)
            .join(EventParticipant, EventParticipant.user_id == User.id)
            .where(EventParticipant.event_id == event.id)
        ).all()

        participants_data = serialize_participants(participants_users)
        is_joined = any(user.id == current_user.id for user in participants_users)

        result.append(
            serialize_event(
                event,
                current_user.username,
                participants_data,
                is_joined,
            )
        )

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

        participants_users = db.scalars(
            select(User)
            .join(EventParticipant, EventParticipant.user_id == User.id)
            .where(EventParticipant.event_id == event.id)
        ).all()

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