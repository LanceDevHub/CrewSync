import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/auth";
import { getMyCreatedEvents, getMyJoinedEvents } from "../../api/users";
import type { Event } from "../../types/event";
import type { User } from "../../types/user";

export function useProfileData() {
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

  return {
    currentUser,
    setCurrentUser,
    createdEvents,
    joinedEvents,
    isLoading,
    error,
  };
}