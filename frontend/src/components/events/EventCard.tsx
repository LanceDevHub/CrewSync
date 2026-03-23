import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import type { Event } from "../../types/event";
import EventMeta from "./EventMeta";
import ParticipantsPreview from "./ParticipantsPreview";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const lineupPreview = event.lineup
    .split("\n")
    .map((artist) => artist.trim())
    .filter((artist) => artist !== "")
    .join(", ");

  return (
    <Box bg="white" p="6" borderRadius="lg" boxShadow="sm" borderWidth="1px">
      <Stack gap="3">
        <Link asChild>
          <RouterLink to={`/events/${event.id}`}>
            <Heading size="md" color="teal.600">
              {event.title}
            </Heading>
          </RouterLink>
        </Link>

        <Text lineClamp="2" color="gray.700">
          {lineupPreview || "Kein Line-up angegeben"}
        </Text>

        {event.official_link && (
          <Text fontSize="xs" color="teal.600">
            Externer Event-Link verfügbar
          </Text>
        )}

        <EventMeta
          creatorUsername={event.creator_username}
          location={event.location}
          genre={event.genre}
          startDatetime={event.start_datetime}
          endDatetime={event.end_datetime}
        />

        <ParticipantsPreview
          participantsPreview={event.participants_preview}
          participantsCount={event.participants_count}
        />

        <Text fontSize="xs" color="gray.500">
          {event.participants_count} Teilnehmer
        </Text>

        <Link asChild color="teal.600" fontWeight="semibold">
          <RouterLink to={`/events/${event.id}`}>Details ansehen</RouterLink>
        </Link>
      </Stack>
    </Box>
  );
}
