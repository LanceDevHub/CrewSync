import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../api/events";
import type { Event } from "../types/event";

export default function EventDetailPage() {
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        setError("Keine Event-ID gefunden.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getEventById(Number(id));
        setEvent(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Event could not be loaded.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (isLoading) {
    return <p>Event wird geladen...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!event) {
    return <p>Event nicht gefunden.</p>;
  }

  return (
    <div>
      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <p>
        <strong>Ort:</strong> {event.location}
      </p>

      <p>
        <strong>Genre:</strong> {event.genre ?? "—"}
      </p>

      <p>
        <strong>Datum:</strong> {new Date(event.event_date).toLocaleString()}
      </p>

      <p>
        <strong>Max. Teilnehmer:</strong>{" "}
        {event.max_participants ?? "Keine Begrenzung"}
      </p>

      <p>
        <strong>Ersteller-ID:</strong> {event.creator_id}
      </p>
    </div>
  );
}
