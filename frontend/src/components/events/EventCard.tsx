import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import type { Event } from "../../types/event";
import EventMeta from "./EventMeta";
import ParticipantsPreview from "./ParticipantsPreview";

type EventCardProps = {
  event: Event;
};

function getLineupPreview(lineup: string) {
  const artists = lineup
    .split("\n")
    .map((artist) => artist.trim())
    .filter(Boolean);

  const preview = artists.slice(0, 3).join(", ");

  if (artists.length > 3) {
    return `${preview}, ...`;
  }

  return preview;
}

export default function EventCard({ event }: EventCardProps) {
  const lineupPreview = getLineupPreview(event.lineup);

  return (
    <Box
      bg="white"
      p="6"
      borderRadius="2xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
      transition="all 0.2s ease"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
    >
      <Stack gap="4">
        <Stack gap="2">
          <Link
            asChild
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
          >
            <RouterLink to={`/events/${event.id}`}>
              <Heading size="md" color="teal.600" lineClamp="2">
                {event.title}
              </Heading>
            </RouterLink>
          </Link>

          <Text color="gray.700" lineClamp="2">
            {lineupPreview || "Kein Line-up angegeben"}
          </Text>

          {event.official_link && (
            <Text fontSize="sm" color="gray.500">
              Offizielle Eventseite vorhanden
            </Text>
          )}
        </Stack>

        <Box
          bg="gray.50"
          borderRadius="xl"
          px="4"
          py="3"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <EventMeta
            creatorUsername={event.creator_username}
            location={event.location}
            startDatetime={event.start_datetime}
            endDatetime={event.end_datetime}
          />
        </Box>

        <Stack gap="2">
          <ParticipantsPreview
            participantsPreview={event.participants_preview}
            participantsCount={event.participants_count}
          />

          <Text fontSize="xs" color="gray.500">
            {event.participants_count} Teilnehmer
          </Text>
        </Stack>

        <Link
          asChild
          alignSelf="flex-start"
          color="teal.600"
          fontWeight="semibold"
          textDecoration="none"
          _hover={{ textDecoration: "underline" }}
        >
          <RouterLink to={`/events/${event.id}`}>Details ansehen</RouterLink>
        </Link>
      </Stack>
    </Box>
  );
}
