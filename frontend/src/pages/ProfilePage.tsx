import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
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

  if (isLoading) {
    return <LoadingState message="Profil wird geladen..." />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (!currentUser) {
    return <EmptyState message="Nicht eingeloggt." />;
  }

  const visibleJoinedEvents =
    joinedView === "upcoming" ? upcomingJoinedEvents : pastJoinedEvents;

  const visibleCreatedEvents =
    createdView === "upcoming" ? upcomingCreatedEvents : pastCreatedEvents;

  return (
    <PageContainer
      title="Mein Profil"
      description="Hier findest du deine Profildaten sowie deine beigetretenen und erstellten Events."
    >
      <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" borderWidth="1px">
        <Stack
          direction={{ base: "column", md: "row" }}
          gap="5"
          align={{ base: "start", md: "center" }}
        >
          <Avatar.Root size="2xl">
            <Avatar.Fallback
              name={`${currentUser.first_name} ${currentUser.last_name}`}
            />
          </Avatar.Root>

          <Stack gap="2">
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={{ base: "start", sm: "center" }}
              gap="2"
            >
              <Heading size="lg">
                {currentUser.first_name} {currentUser.last_name}
              </Heading>

              {currentUser.is_admin && (
                <Badge colorPalette="purple" variant="subtle">
                  Admin
                </Badge>
              )}
            </Stack>

            <Text color="gray.600" fontSize="md">
              @{currentUser.username}
            </Text>

            <Text color="gray.600">{currentUser.email}</Text>
          </Stack>
        </Stack>
      </Box>

      <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" borderWidth="1px">
        <Stack gap="5">
          <Heading size="md">
            Beigetretene Events ({joinedEvents.length})
          </Heading>

          <Box maxW="md">
            <Field.Root>
              <Field.Label>Suche in beigetretenen Events</Field.Label>
              <Input
                placeholder="Titel, Line-up, Ort oder Creator"
                value={joinedSearch}
                onChange={(event) => setJoinedSearch(event.target.value)}
              />
            </Field.Root>
          </Box>

          <Stack direction="row" gap="2" flexWrap="wrap">
            <Button
              size="sm"
              colorPalette="teal"
              variant={joinedView === "upcoming" ? "solid" : "outline"}
              onClick={() => setJoinedView("upcoming")}
            >
              Aktuell ({upcomingJoinedEvents.length})
            </Button>

            <Button
              size="sm"
              colorPalette="teal"
              variant={joinedView === "past" ? "solid" : "outline"}
              onClick={() => setJoinedView("past")}
            >
              Vergangen ({pastJoinedEvents.length})
            </Button>
          </Stack>

          <Box>
            <Heading size="sm" mb="4">
              {joinedView === "upcoming"
                ? `Aktuelle beigetretene Events (${upcomingJoinedEvents.length})`
                : `Vergangene beigetretene Events (${pastJoinedEvents.length})`}
            </Heading>

            {visibleJoinedEvents.length === 0 ? (
              <EmptyState
                message={
                  joinedView === "upcoming"
                    ? "Du hast keine aktuellen beigetretenen Events."
                    : "Du hast keine vergangenen beigetretenen Events."
                }
              />
            ) : (
              <Stack gap="6">
                {visibleJoinedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>

      <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" borderWidth="1px">
        <Stack gap="5">
          <Button
            variant="ghost"
            justifyContent="space-between"
            width="full"
            px="0"
            onClick={() => setShowCreatedSection((prev) => !prev)}
          >
            <Heading size="md">
              Erstellte Events ({createdEvents.length})
            </Heading>
            <Text fontSize="xl" lineHeight="1">
              {showCreatedSection ? "−" : "+"}
            </Text>
          </Button>

          <Collapsible.Root open={showCreatedSection}>
            <Collapsible.Content>
              <Stack gap="5" pt="2">
                <Box maxW="md">
                  <Field.Root>
                    <Field.Label>Suche in erstellten Events</Field.Label>
                    <Input
                      placeholder="Titel, Line-up oder Ort"
                      value={createdSearch}
                      onChange={(event) => setCreatedSearch(event.target.value)}
                    />
                  </Field.Root>
                </Box>

                <Stack direction="row" gap="2" flexWrap="wrap">
                  <Button
                    size="sm"
                    colorPalette="teal"
                    variant={createdView === "upcoming" ? "solid" : "outline"}
                    onClick={() => setCreatedView("upcoming")}
                  >
                    Aktuell ({upcomingCreatedEvents.length})
                  </Button>

                  <Button
                    size="sm"
                    colorPalette="teal"
                    variant={createdView === "past" ? "solid" : "outline"}
                    onClick={() => setCreatedView("past")}
                  >
                    Vergangen ({pastCreatedEvents.length})
                  </Button>
                </Stack>

                <Box>
                  <Heading size="sm" mb="4">
                    {createdView === "upcoming"
                      ? `Aktuelle erstellte Events (${upcomingCreatedEvents.length})`
                      : `Vergangene erstellte Events (${pastCreatedEvents.length})`}
                  </Heading>

                  {visibleCreatedEvents.length === 0 ? (
                    <EmptyState
                      message={
                        createdView === "upcoming"
                          ? "Du hast keine aktuellen erstellten Events."
                          : "Du hast keine vergangenen erstellten Events."
                      }
                    />
                  ) : (
                    <Stack gap="6">
                      {visibleCreatedEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Box>
    </PageContainer>
  );
}
