import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Collapsible,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { getCurrentUser } from "../api/auth";
import { getMyCreatedEvents, getMyJoinedEvents } from "../api/users";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";
import EventCard from "../components/events/EventCard";
import AppButton from "../components/ui/AppButton";

import type { Event } from "../types/event";
import type { User } from "../types/user";

function sortByStartAscending(events: Event[]) {
  return [...events].sort(
    (a, b) =>
      new Date(a.start_datetime).getTime() -
      new Date(b.start_datetime).getTime(),
  );
}

function isPastEvent(event: Event) {
  return new Date(event.start_datetime).getTime() < Date.now();
}

function filterEvents(events: Event[], search: string, includeCreator = false) {
  if (!search.trim()) {
    return events;
  }

  const normalizedSearch = search.toLowerCase();

  return events.filter((event) => {
    return (
      event.title.toLowerCase().includes(normalizedSearch) ||
      event.lineup.toLowerCase().includes(normalizedSearch) ||
      event.location.toLowerCase().includes(normalizedSearch) ||
      (includeCreator &&
        event.creator_username.toLowerCase().includes(normalizedSearch))
    );
  });
}

type EventSectionView = "upcoming" | "past";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [createdSearch, setCreatedSearch] = useState("");
  const [joinedSearch, setJoinedSearch] = useState("");

  const [showCreatedSection, setShowCreatedSection] = useState(false);
  const [joinedView, setJoinedView] = useState<EventSectionView>("upcoming");
  const [createdView, setCreatedView] = useState<EventSectionView>("upcoming");

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

  const upcomingJoinedEvents = useMemo(() => {
    const filtered = joinedEvents.filter((event) => !isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, joinedSearch, true));
  }, [joinedEvents, joinedSearch]);

  const pastJoinedEvents = useMemo(() => {
    const filtered = joinedEvents.filter((event) => isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, joinedSearch, true));
  }, [joinedEvents, joinedSearch]);

  const upcomingCreatedEvents = useMemo(() => {
    const filtered = createdEvents.filter((event) => !isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, createdSearch));
  }, [createdEvents, createdSearch]);

  const pastCreatedEvents = useMemo(() => {
    const filtered = createdEvents.filter((event) => isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, createdSearch));
  }, [createdEvents, createdSearch]);

  if (isLoading) return <LoadingState message="Profil wird geladen..." />;
  if (error) return <EmptyState message={error} />;
  if (!currentUser) return <EmptyState message="Nicht eingeloggt." />;

  const visibleJoinedEvents =
    joinedView === "upcoming" ? upcomingJoinedEvents : pastJoinedEvents;

  const visibleCreatedEvents =
    createdView === "upcoming" ? upcomingCreatedEvents : pastCreatedEvents;

  return (
    <PageContainer
      title="Mein Profil"
      description="Hier findest du deine Profildaten sowie deine beigetretenen und erstellten Events."
    >
      {/* HEADER */}
      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack direction={{ base: "column", md: "row" }} gap="5">
          <Avatar.Root size="2xl">
            <Avatar.Fallback
              name={`${currentUser.first_name} ${currentUser.last_name}`}
            />
          </Avatar.Root>

          <Stack gap="2">
            <Stack direction="row" align="center" gap="2">
              <Heading size="lg">
                {currentUser.first_name} {currentUser.last_name}
              </Heading>

              {currentUser.is_admin && (
                <Badge colorPalette="purple" variant="subtle">
                  Admin
                </Badge>
              )}
            </Stack>

            <Text color="textMuted">@{currentUser.username}</Text>
            <Text color="textMuted">{currentUser.email}</Text>
          </Stack>
        </Stack>
      </Box>

      {/* JOINED EVENTS */}
      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="5">
          <Heading size="md">
            Beigetretene Events ({joinedEvents.length})
          </Heading>

          <Field.Root maxW="md">
            <Field.Label>Suche</Field.Label>
            <Input
              value={joinedSearch}
              onChange={(e) => setJoinedSearch(e.target.value)}
            />
          </Field.Root>

          <Stack direction="row" gap="2">
            <AppButton
              appVariant={joinedView === "upcoming" ? "primary" : "secondary"}
              onClick={() => setJoinedView("upcoming")}
            >
              Aktuell ({upcomingJoinedEvents.length})
            </AppButton>

            <AppButton
              appVariant={joinedView === "past" ? "primary" : "secondary"}
              onClick={() => setJoinedView("past")}
            >
              Vergangen ({pastJoinedEvents.length})
            </AppButton>
          </Stack>

          <Stack gap="6">
            {visibleJoinedEvents.length === 0 ? (
              <EmptyState message="Keine Events gefunden." />
            ) : (
              visibleJoinedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </Stack>
        </Stack>
      </Box>

      {/* CREATED EVENTS */}
      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="5">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
            gap="3"
          >
            <Heading size="md">
              Erstellte Events ({createdEvents.length})
            </Heading>

            <AppButton
              appVariant="secondary"
              onClick={() => setShowCreatedSection((prev) => !prev)}
              alignSelf={{ base: "stretch", sm: "auto" }}
            >
              {showCreatedSection ? "Ausblenden" : "Anzeigen"}
            </AppButton>
          </Stack>

          <Collapsible.Root open={showCreatedSection}>
            <Collapsible.Content>
              <Stack gap="5">
                <Field.Root maxW="md">
                  <Field.Label>Suche</Field.Label>
                  <Input
                    value={createdSearch}
                    onChange={(e) => setCreatedSearch(e.target.value)}
                  />
                </Field.Root>

                <Stack direction="row" gap="2" flexWrap="wrap">
                  <AppButton
                    appVariant={
                      createdView === "upcoming" ? "primary" : "secondary"
                    }
                    onClick={() => setCreatedView("upcoming")}
                  >
                    Aktuell ({upcomingCreatedEvents.length})
                  </AppButton>

                  <AppButton
                    appVariant={
                      createdView === "past" ? "primary" : "secondary"
                    }
                    onClick={() => setCreatedView("past")}
                  >
                    Vergangen ({pastCreatedEvents.length})
                  </AppButton>
                </Stack>

                <Stack gap="6">
                  {visibleCreatedEvents.length === 0 ? (
                    <EmptyState message="Keine Events gefunden." />
                  ) : (
                    visibleCreatedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  )}
                </Stack>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Box>
    </PageContainer>
  );
}
