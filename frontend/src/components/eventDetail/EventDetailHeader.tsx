import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import EventMeta from "../events/EventMeta";
import type { Event } from "../../types/event";

export default function EventDetailHeader({ event }: { event: Event }) {
  return (
    <Box bg="surface" p="8" borderRadius="2xl" borderWidth="1px">
      <Stack gap="6">
        <Stack gap="3">
          <Heading size="lg">{event.title}</Heading>

          {event.official_link && (
            <Link
              href={event.official_link}
              color="brandAccent"
              target="_blank"
            >
              Offizielle Eventseite
            </Link>
          )}
        </Stack>

        <Box bg="mutedBg" p="4" borderRadius="xl">
          <EventMeta
            creatorUsername={event.creator_username}
            location={event.location}
            startDatetime={event.start_datetime}
            endDatetime={event.end_datetime}
          />
        </Box>

        <Box>
          <Heading size="sm" mb="3">
            Line-up
          </Heading>

          <Stack direction="row" flexWrap="wrap">
            {event.lineup.split("\n").map((artist, i) => (
              <Box key={i} px="3" py="1.5" bg="mutedBg" borderRadius="full">
                <Text fontSize="sm">{artist}</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
