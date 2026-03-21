import { Badge, HStack, Text } from "@chakra-ui/react";

type ParticipantsPreviewProps = {
  participantsPreview: string[];
  participantsCount: number;
};

export default function ParticipantsPreview({
  participantsPreview,
  participantsCount,
}: ParticipantsPreviewProps) {
  const preview =
    participantsCount > 3
      ? [...participantsPreview.slice(0, 3), "..."]
      : participantsPreview;

  return (
    <HStack gap="2" flexWrap="wrap">
      {preview.length > 0 ? (
        preview.map((name, index) => (
          <Badge key={`${name}-${index}`} colorPalette="teal">
            {name}
          </Badge>
        ))
      ) : (
        <Text fontSize="sm" color="gray.500">
          Keine Teilnehmer
        </Text>
      )}
    </HStack>
  );
}
