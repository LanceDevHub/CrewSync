import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
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

export default function ProfilePage() {
  const [createdSearch, setCreatedSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPastCreated, setShowPastCreated] = useState(false);
  const [showPastJoined, setShowPastJoined] = useState(false);
  const [joinedSearch, setJoinedSearch] = useState("");

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

  const upcomingCreatedEvents = useMemo(() => {
    const filtered = createdEvents.filter((event) => !isPastEvent(event));

    if (!createdSearch.trim()) {
      return sortByStartAscending(filtered);
    }

    const search = createdSearch.toLowerCase();

    return sortByStartAscending(
      filtered.filter((event) => {
        return (
          event.title.toLowerCase().includes(search) ||
          event.lineup.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search)
        );
      }),
    );
  }, [createdEvents, createdSearch]);

  const pastCreatedEvents = useMemo(() => {
    return sortByStartAscending(
      createdEvents.filter((event) => isPastEvent(event)),
    );
  }, [createdEvents]);

  const upcomingJoinedEvents = useMemo(() => {
    const filtered = joinedEvents.filter((event) => !isPastEvent(event));

    if (!joinedSearch.trim()) {
      return sortByStartAscending(filtered);
    }

    const search = joinedSearch.toLowerCase();

    return sortByStartAscending(
      filtered.filter((event) => {
        return (
          event.title.toLowerCase().includes(search) ||
          event.lineup.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search) ||
          event.creator_username.toLowerCase().includes(search)
        );
      }),
    );
  }, [joinedEvents, joinedSearch]);

  const pastJoinedEvents = useMemo(() => {
    return sortByStartAscending(
      joinedEvents.filter((event) => isPastEvent(event)),
    );
  }, [joinedEvents]);

  if (isLoading) {
    return <LoadingState message="Profil wird geladen..." />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (!currentUser) {
    return <EmptyState message="Nicht eingeloggt." />;
  }

  return (
    <PageContainer
      title="Mein Profil"
      description="Hier findest du deine Profildaten sowie deine erstellten und beigetretenen Events."
    >
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Stack gap="3">
          <Stack direction="row" align="center" gap="2" flexWrap="wrap">
            <Text>
              <Text as="span" fontWeight="semibold">
                Benutzername:
              </Text>{" "}
              {currentUser.username}
            </Text>

            {currentUser.is_admin && (
              <Badge colorPalette="purple" variant="subtle">
                Admin
              </Badge>
            )}
          </Stack>

          <Text>
            <Text as="span" fontWeight="semibold">
              Name:
            </Text>{" "}
            {currentUser.first_name} {currentUser.last_name}
          </Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              E-Mail:
            </Text>{" "}
            {currentUser.email}
          </Text>
        </Stack>
      </Box>

      <Box>
        <Stack gap="4" mb="4">
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "center" }}
            gap="3"
          >
            <Heading size="md">Erstellte Events</Heading>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPastCreated((prev) => !prev)}
            >
              {showPastCreated
                ? "Vergangene erstellte Events ausblenden"
                : "Vergangene erstellte Events anzeigen"}
            </Button>
          </Stack>

          <Box maxW="md">
            <Field.Root>
              <Field.Label>Suche in erstellten Events</Field.Label>
              <Input
                placeholder="Titel, Line-up, Ort, ..."
                value={createdSearch}
                onChange={(event) => setCreatedSearch(event.target.value)}
              />
            </Field.Root>
          </Box>
        </Stack>

        {upcomingCreatedEvents.length === 0 ? (
          <EmptyState message="Du hast keine bevorstehenden erstellten Events." />
        ) : (
          <Stack gap="6">
            {upcomingCreatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Stack>
        )}

        {showPastCreated && (
          <Box mt="6">
            <Heading size="sm" mb="4">
              Vergangene erstellte Events
            </Heading>

            {pastCreatedEvents.length === 0 ? (
              <EmptyState message="Du hast keine vergangenen erstellten Events." />
            ) : (
              <Stack gap="6">
                {pastCreatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>

      <Box>
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb="4"
          gap="3"
        >
          <Heading size="md">Beigetretene Events</Heading>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPastJoined((prev) => !prev)}
          >
            {showPastJoined
              ? "Vergangene beigetretene Events ausblenden"
              : "Vergangene beigetretene Events anzeigen"}
          </Button>
        </Stack>

        <Box maxW="md" mb="4">
          <Field.Root>
            <Field.Label>Suche in beigetretenen Events</Field.Label>
            <Input
              placeholder="Titel, Ort, Lineup ..."
              value={joinedSearch}
              onChange={(event) => setJoinedSearch(event.target.value)}
            />
          </Field.Root>
        </Box>

        {upcomingJoinedEvents.length === 0 ? (
          <EmptyState message="Keine bevorstehenden beigetretenen Events gefunden." />
        ) : (
          <Stack gap="6">
            {upcomingJoinedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Stack>
        )}

        {showPastJoined && (
          <Box mt="6">
            <Heading size="sm" mb="4">
              Vergangene beigetretene Events
            </Heading>

            {pastJoinedEvents.length === 0 ? (
              <EmptyState message="Du hast keine vergangenen beigetretenen Events." />
            ) : (
              <Stack gap="6">
                {pastJoinedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}
