import { useEffect, useState } from "react";
import {
  deleteEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../../api/events";
import { getCurrentUser } from "../../api/auth";
import type { Event } from "../../types/event";
import type { User } from "../../types/user";

type UpdateEventPayload = {
  title: string;
  lineup: string;
  official_link: string | null;
  location: string;
  start_datetime: string;
  end_datetime: string | null;
};

export function useEventDetail(id?: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Keine Event-ID gefunden.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const [eventData, userData] = await Promise.all([
          getEventById(Number(id)),
          getCurrentUser().catch(() => null),
        ]);

        setEvent(eventData);
        setCurrentUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Event konnte nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  async function reloadEvent() {
    if (!id) return;

    try {
      const eventData = await getEventById(Number(id));
      setEvent(eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Event konnte nicht neu geladen werden.");
    }
  }

  async function handleJoin() {
    if (!id) return;

    setActionLoading(true);
    setError("");
    setActionMessage("");

    try {
      const result = await joinEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beitritt fehlgeschlagen.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!id) return;

    setActionLoading(true);
    setError("");
    setActionMessage("");

    try {
      const result = await leaveEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verlassen fehlgeschlagen.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(navigate: (path: string) => void) {
    if (!id) return;

    const confirmed = window.confirm("Event wirklich löschen?");
    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setActionMessage("");

    try {
      await deleteEvent(Number(id));
      navigate("/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Event konnte nicht gelöscht werden.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdate(data: UpdateEventPayload) {
    if (!id) return;

    setActionLoading(true);
    setError("");
    setActionMessage("");

    try {
      const updated = await updateEvent(Number(id), data);
      setEvent(updated);
      setActionMessage("Event erfolgreich aktualisiert.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Event konnte nicht aktualisiert werden.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  }

  return {
    event,
    currentUser,
    isLoading,
    actionLoading,
    error,
    actionMessage,
    setError,
    setActionMessage,
    handleJoin,
    handleLeave,
    handleDelete,
    handleUpdate,
    reloadEvent,
  };
}