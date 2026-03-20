import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getEvents } from "../api/events";
import type { Event } from "../types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyFuture, setOnlyFuture] = useState(false);

  async function loadEvents() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getEvents({
        q: q || undefined,
        genre: genre || undefined,
        location: location || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        only_future: onlyFuture || undefined,
      });

      setEvents(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Events could not be loaded.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadEvents();
  }

  return (
    <div>
      <h1>Events</h1>

      <form onSubmit={handleFilterSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="q">Suche</label>
          <br />
          <input
            id="q"
            type="text"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Titel, Beschreibung oder Ort"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="genre">Genre</label>
          <br />
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            placeholder="z. B. Techno"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="location">Ort</label>
          <br />
          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="z. B. Berlin"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="dateFrom">Beginn ab</label>
          <br />
          <input
            id="dateFrom"
            type="datetime-local"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="dateTo">Beginn bis</label>
          <br />
          <input
            id="dateTo"
            type="datetime-local"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={onlyFuture}
              onChange={(event) => setOnlyFuture(event.target.checked)}
            />{" "}
            Nur zukünftige Events
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">Filter anwenden</button>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setGenre("");
              setLocation("");
              setDateFrom("");
              setDateTo("");
              setOnlyFuture(false);
            }}
          >
            Filter zurücksetzen
          </button>
        </div>
      </form>

      {isLoading ? (
        <p>Events werden geladen...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : events.length === 0 ? (
        <p>Keine Events gefunden.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "1.5rem" }}>
              <h3>{event.title}</h3>

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

              <Link to={`/events/${event.id}`}>Details ansehen</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
