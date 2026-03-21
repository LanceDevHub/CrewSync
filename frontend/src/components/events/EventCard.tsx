import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import type { Event } from "../../types/event";
import ParticipantsPreview from "./ParticipantsPreview";
import EventMeta from "./EventMeta";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
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

        <Text lineClamp="2">{event.description}</Text>

        <EventMeta
          creatorUsername={event.creator_username}
          location={event.location}
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
