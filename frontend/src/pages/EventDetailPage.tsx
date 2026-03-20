import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCurrentUser } from "../api/auth";
import {
  deleteEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../api/events";
import type { Event } from "../types/event";
import type { User } from "../types/user";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [genre, setGenre] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  useEffect(() => {
    async function loadEventData() {
      if (!id) {
        setError("Keine Event-ID gefunden.");
        setIsLoading(false);
        return;
      }

      try {
        const [eventData, userData] = await Promise.all([
          getEventById(Number(id)),
          getCurrentUser().catch(() => null),
        ]);

        setEvent(eventData);
        setCurrentUser(userData);

        setTitle(eventData.title);
        setDescription(eventData.description);
        setLocation(eventData.location);
        setGenre(eventData.genre ?? "");
        setStartDatetime(eventData.start_datetime.slice(0, 16));
        setEndDatetime(
          eventData.end_datetime ? eventData.end_datetime.slice(0, 16) : "",
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Event konnte nicht geladen werden.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEventData();
  }, [id]);

  async function reloadEvent() {
    if (!id) return;

    const eventData = await getEventById(Number(id));
    setEvent(eventData);
    setTitle(eventData.title);
    setDescription(eventData.description);
    setLocation(eventData.location);
    setGenre(eventData.genre ?? "");
    setStartDatetime(eventData.start_datetime.slice(0, 16));
    setEndDatetime(
      eventData.end_datetime ? eventData.end_datetime.slice(0, 16) : "",
    );
  }

  async function handleJoin() {
    if (!id) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const result = await joinEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Beitritt fehlgeschlagen.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!id) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const result = await leaveEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verlassen fehlgeschlagen.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdate(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    if (!id || !event) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const updated = await updateEvent(Number(id), {
        title,
        description,
        location,
        genre: genre || null,
        start_datetime: startDatetime,
        end_datetime: endDatetime || null,
      });

      setEvent(updated);
      setIsEditing(false);
      setActionMessage("Event erfolgreich aktualisiert.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht aktualisiert werden.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!id) return;

    const confirmed = window.confirm(
      "Möchtest du dieses Event wirklich löschen?",
    );
    if (!confirmed) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      await deleteEvent(Number(id));
      navigate("/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht gelöscht werden.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <p>Event wird geladen...</p>;
  }

  if (error && !event) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!event) {
    return <p>Event nicht gefunden.</p>;
  }

  const isCreator = currentUser?.id === event.creator_id;
  const visibleParticipants = showAllParticipants
    ? event.participants
    : event.participants.slice(0, 3);

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <h1>Event bearbeiten</h1>

          <div>
            <label htmlFor="title">Titel</label>
            <br />
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="description">Beschreibung</label>
            <br />
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="location">Ort</label>
            <br />
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="genre">Genre</label>
            <br />
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="startDatetime">Beginn</label>
            <br />
            <input
              id="startDatetime"
              type="datetime-local"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="endDatetime">Ende (optional)</label>
            <br />
            <input
              id="endDatetime"
              type="datetime-local"
              value={endDatetime}
              onChange={(e) => setEndDatetime(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={actionLoading}>
              {actionLoading ? "Speichert..." : "Änderungen speichern"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={actionLoading}
            >
              Abbrechen
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1>{event.title}</h1>

          <p>{event.description}</p>

          <p>
            <strong>Erstellt von:</strong> {event.creator_username}
          </p>

          <p>
            <strong>Ort:</strong> {event.location}
          </p>

          <p>
            <strong>Genre:</strong> {event.genre ?? "—"}
          </p>

          <p>
            <strong>Beginn:</strong>{" "}
            {new Date(event.start_datetime).toLocaleString()}
          </p>

          <p>
            <strong>Ende:</strong>{" "}
            {event.end_datetime
              ? new Date(event.end_datetime).toLocaleString()
              : "Kein Endzeitpunkt angegeben"}
          </p>

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Teilnehmer ({event.participants_count})</h3>

            {event.participants.length === 0 ? (
              <p>Noch keine Teilnehmer.</p>
            ) : (
              <>
                <ul>
                  {visibleParticipants.map((participant) => (
                    <li key={participant}>{participant}</li>
                  ))}
                </ul>

                {event.participants.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllParticipants((prev) => !prev)}
                  >
                    {showAllParticipants ? "Weniger anzeigen" : "Mehr anzeigen"}
                  </button>
                )}
              </>
            )}
          </div>

          {currentUser ? (
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {!event.is_joined && (
                <button onClick={handleJoin} disabled={actionLoading}>
                  {actionLoading ? "Lädt..." : "Event beitreten"}
                </button>
              )}

              {event.is_joined && (
                <button onClick={handleLeave} disabled={actionLoading}>
                  {actionLoading ? "Lädt..." : "Event verlassen"}
                </button>
              )}

              {isCreator && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={actionLoading}
                  >
                    Event bearbeiten
                  </button>

                  <button onClick={handleDelete} disabled={actionLoading}>
                    Event löschen
                  </button>
                </>
              )}
            </div>
          ) : (
            <p style={{ marginTop: "1.5rem" }}>
              Du musst eingeloggt sein, um mit diesem Event zu interagieren.
            </p>
          )}

          {isCreator && (
            <p style={{ marginTop: "1rem" }}>
              Du bist der Ersteller dieses Events.
            </p>
          )}
        </>
      )}

      {actionMessage && (
        <p style={{ color: "green", marginTop: "1rem" }}>{actionMessage}</p>
      )}

      {error && event && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}
    </div>
  );
}
