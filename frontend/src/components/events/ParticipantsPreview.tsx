import { Badge, HStack, Popover, Portal, Text } from "@chakra-ui/react";
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
                <Badge colorPalette="teal" cursor="pointer">
                  {getDisplayName(participant)}
                </Badge>
              </Popover.Trigger>

              <Portal>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                      <Text fontWeight="semibold">
                        {participant.first_name} {participant.last_name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        @{participant.username}
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          ))}

          {participantsCount > 3 && <Badge colorPalette="gray">...</Badge>}
        </>
      ) : (
        <Text fontSize="sm" color="gray.500">
          Keine Teilnehmer
        </Text>
      )}
    </HStack>
  );
}
