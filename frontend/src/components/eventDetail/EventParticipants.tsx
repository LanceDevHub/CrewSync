import { Avatar, Box, Heading, Stack, Text } from "@chakra-ui/react";
import AppButton from "../ui/AppButton";
import { useState } from "react";
import type { Event } from "../../types/event";

export default function EventParticipants({ event }: { event: Event }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? event.participants : event.participants.slice(0, 3);

  return (
    <Box bg="surface" p="8" borderRadius="2xl" borderWidth="1px">
      <Stack gap="4">
        <Heading size="md">Teilnehmer ({event.participants_count})</Heading>

        {visible.map((p) => (
          <Box key={p.username} p="3" bg="mutedBg" borderRadius="xl">
            <Stack direction="row">
              <Avatar.Root size="sm">
                <Avatar.Fallback name={p.first_name} />
              </Avatar.Root>

              <Box>
                <Text>
                  {p.first_name} {p.last_name}
                </Text>
                <Text fontSize="sm">@{p.username}</Text>
              </Box>
            </Stack>
          </Box>
        ))}

        {event.participants.length > 3 && (
          <AppButton appVariant="ghost" onClick={() => setShowAll((p) => !p)}>
            {showAll ? "Weniger" : "Mehr anzeigen"}
          </AppButton>
        )}
      </Stack>
    </Box>
  );
}
