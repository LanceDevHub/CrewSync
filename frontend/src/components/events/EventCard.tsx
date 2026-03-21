import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import type { Event } from "../../types/event";
import ParticipantsPreview from "./ParticipantsPreview";

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

        <Stack fontSize="sm" color="gray.600" gap="2">
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
              : "—"}
          </Text>
        </Stack>

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
