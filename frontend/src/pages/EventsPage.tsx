import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getEvents } from "../api/events";
import type { Event } from "../types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
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

    loadEvents();
  }, []);

  if (isLoading) {
    return <p>Events werden geladen...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Events</h1>

      {events.length === 0 ? (
        <p>Keine Events gefunden.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "1rem" }}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Ort:</strong> {event.location}
              </p>
              <p>
                <strong>Genre:</strong> {event.genre ?? "—"}
              </p>
              <p>
                <strong>Datum:</strong>{" "}
                {new Date(event.event_date).toLocaleString()}
              </p>

              <Link to={`/events/${event.id}`}>Details ansehen</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
