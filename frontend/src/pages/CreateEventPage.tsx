import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createEvent } from "../api/events";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [genre, setGenre] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

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
        start_datetime: startDatetime,
        end_datetime: endDatetime || null,
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
          <label htmlFor="startDatetime">Beginn</label>
          <br />
          <input
            id="startDatetime"
            type="datetime-local"
            value={startDatetime}
            onChange={(event) => setStartDatetime(event.target.value)}
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
            onChange={(event) => setEndDatetime(event.target.value)}
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
