import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createEvent } from "../api/events";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [genre, setGenre] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const createdEvent = await createEvent({
        title,
        description,
        location,
        genre: genre || null,
        event_date: eventDate,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
      });

      navigate(`/events/${createdEvent.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht erstellt werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Event erstellen</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titel</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="description">Beschreibung</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
            onChange={(event) => setLocation(event.target.value)}
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
            onChange={(event) => setGenre(event.target.value)}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="eventDate">Datum und Uhrzeit</label>
          <br />
          <input
            id="eventDate"
            type="datetime-local"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="maxParticipants">Max. Teilnehmer</label>
          <br />
          <input
            id="maxParticipants"
            type="number"
            min="1"
            value={maxParticipants}
            onChange={(event) => setMaxParticipants(event.target.value)}
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          style={{ marginTop: "1rem" }}
        >
          {isLoading ? "Wird erstellt..." : "Event erstellen"}
        </button>
      </form>
    </div>
  );
}
