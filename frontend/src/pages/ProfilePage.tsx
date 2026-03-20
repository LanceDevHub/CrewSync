import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";

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

  function formatParticipantsPreview(event: Event) {
    if (event.participants_preview.length === 0) {
      return "Noch keine Teilnehmer";
    }

    const preview = event.participants_preview.join(", ");

    if (event.participants_count > 3) {
      return `${preview}, ...`;
    }

    return preview;
  }

  function renderEventCard(event: Event) {
    return (
      <Box
        key={event.id}
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="sm"
        borderWidth="1px"
      >
        <Stack gap="3">
          <Heading size="md">{event.title}</Heading>

          <Text color="gray.700">{event.description}</Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              Erstellt von:
            </Text>{" "}
            {event.creator_username}
          </Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              Ort:
            </Text>{" "}
            {event.location}
          </Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              Beginn:
            </Text>{" "}
            {new Date(event.start_datetime).toLocaleString()}
          </Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              Ende:
            </Text>{" "}
            {event.end_datetime
              ? new Date(event.end_datetime).toLocaleString()
              : "Kein Endzeitpunkt angegeben"}
          </Text>

          <Text>
            <Text as="span" fontWeight="semibold">
              Teilnehmer:
            </Text>{" "}
            {formatParticipantsPreview(event)}
          </Text>

          <Link asChild color="teal.600" fontWeight="semibold">
            <RouterLink to={`/events/${event.id}`}>Details ansehen</RouterLink>
          </Link>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text>Profil wird geladen...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text>Nicht eingeloggt.</Text>
      </Box>
    );
  }

  return (
    <Stack gap="8">
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Heading size="lg">Mein Profil</Heading>

        <Stack gap="2" mt="4">
          <Text>
            <Text as="span" fontWeight="semibold">
              Benutzername:
            </Text>{" "}
            {currentUser.username}
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
        <Heading size="md" mb="4">
          Meine erstellten Events
        </Heading>

        {createdEvents.length === 0 ? (
          <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
            <Text>Du hast noch keine Events erstellt.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
            {createdEvents.map(renderEventCard)}
          </SimpleGrid>
        )}
      </Box>

      <Box>
        <Heading size="md" mb="4">
          Meine beigetretenen Events
        </Heading>

        {joinedEvents.length === 0 ? (
          <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
            <Text>Du bist noch keinem Event beigetreten.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
            {joinedEvents.map(renderEventCard)}
          </SimpleGrid>
        )}
      </Box>
    </Stack>
  );
}
