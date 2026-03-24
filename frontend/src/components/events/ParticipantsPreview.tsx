import {
  Avatar,
  Badge,
  Box,
  HStack,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import type { EventParticipantPreview } from "../../types/event";

type ParticipantsPreviewProps = {
  participantsPreview: EventParticipantPreview[];
  participantsCount: number;
};

function getDisplayName(participant: EventParticipantPreview) {
  const lastInitial = participant.last_name
    ? `${participant.last_name.charAt(0)}.`
    : "";

  return `${participant.first_name} ${lastInitial}`.trim();
}

function getFullName(participant: EventParticipantPreview) {
  return `${participant.first_name} ${participant.last_name}`.trim();
}

export default function ParticipantsPreview({
  participantsPreview,
  participantsCount,
}: ParticipantsPreviewProps) {
  const preview =
    participantsCount > 3
      ? participantsPreview.slice(0, 3)
      : participantsPreview;

  return (
    <HStack gap="2" flexWrap="wrap">
      {preview.length > 0 ? (
        <>
          {preview.map((participant) => (
            <Popover.Root
              key={participant.username}
              positioning={{ placement: "top" }}
            >
              <Popover.Trigger asChild>
                <HStack
                  gap="2"
                  px="2.5"
                  py="1.5"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="full"
                  bg="mutedBg"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    borderColor: "brandAccent",
                    bg: "surface",
                  }}
                >
                  <Avatar.Root size="2xs">
                    <Avatar.Fallback name={getFullName(participant)} />
                  </Avatar.Root>

                  <Text fontSize="sm" color="text">
                    {getDisplayName(participant)}
                  </Text>
                </HStack>
              </Popover.Trigger>

              <Portal>
                <Popover.Positioner>
                  <Popover.Content
                    bg="surface"
                    borderColor="border"
                    boxShadow="md"
                  >
                    <Popover.Arrow bg="surface" />
                    <Popover.Body>
                      <HStack gap="3">
                        <Avatar.Root size="sm">
                          <Avatar.Fallback name={getFullName(participant)} />
                        </Avatar.Root>

                        <Box>
                          <Text fontWeight="semibold" color="text">
                            {participant.first_name} {participant.last_name}
                          </Text>
                          <Text fontSize="sm" color="textMuted">
                            @{participant.username}
                          </Text>
                        </Box>
                      </HStack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          ))}

          {participantsCount > 3 && (
            <Badge variant="subtle" bg="mutedBg" color="textMuted">
              ...
            </Badge>
          )}
        </>
      ) : (
        <Text fontSize="sm" color="textMuted">
          Keine Teilnehmer
        </Text>
      )}
    </HStack>
  );
}
