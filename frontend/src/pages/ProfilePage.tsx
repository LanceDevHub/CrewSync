import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../api/auth";
import { getMyCreatedEvents, getMyJoinedEvents } from "../api/users";
import type { Event } from "../types/event";
import type { User } from "../types/user";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [user, created, joined] = await Promise.all([
          getCurrentUser(),
          getMyCreatedEvents(),
          getMyJoinedEvents(),
        ]);

        setCurrentUser(user);
        setCreatedEvents(created);
        setJoinedEvents(joined);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Profil konnte nicht geladen werden.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileData();
  }, []);

  if (isLoading) {
    return <p>Profil wird geladen...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!currentUser) {
    return <p>Nicht eingeloggt.</p>;
  }

  return (
    <div>
      <h1>Mein Profil</h1>

      <section style={{ marginBottom: "2rem" }}>
        <p>
          <strong>Benutzername:</strong> {currentUser.username}
        </p>
        <p>
          <strong>E-Mail:</strong> {currentUser.email}
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Meine erstellten Events</h2>

        {createdEvents.length === 0 ? (
          <p>Du hast noch keine Events erstellt.</p>
        ) : (
          <ul>
            {createdEvents.map((event) => (
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
      </section>

      <section>
        <h2>Meine beigetretenen Events</h2>

        {joinedEvents.length === 0 ? (
          <p>Du bist noch keinem Event beigetreten.</p>
        ) : (
          <ul>
            {joinedEvents.map((event) => (
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
      </section>
    </div>
  );
}
