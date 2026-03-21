import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { getCurrentUser } from "../api/auth";
import { getMyCreatedEvents, getMyJoinedEvents } from "../api/users";
import type { Event } from "../types/event";
import type { User } from "../types/user";

import EventCard from "../components/events/EventCard";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";

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
        <Stack gap="2">
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
          <EmptyState message="Du hast noch keine Events erstellt." />
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
            {createdEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Box>
        <Heading size="md" mb="4">
          Meine beigetretenen Events
        </Heading>

        {joinedEvents.length === 0 ? (
          <EmptyState message="Du bist noch keinem Event beigetreten." />
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
            {joinedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </PageContainer>
  );
}
