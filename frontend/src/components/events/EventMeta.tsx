import { Stack, Text } from "@chakra-ui/react";

type EventMetaProps = {
  creatorUsername: string;
  location: string;
  startDatetime: string;
  endDatetime: string | null;
};

export default function EventMeta({
  creatorUsername,
  location,
  startDatetime,
  endDatetime,
}: EventMetaProps) {
  return (
    <Stack fontSize="sm" color="gray.600" gap="2">
      <Text>
        <Text as="span" fontWeight="semibold">
          Erstellt von:
        </Text>{" "}
        {creatorUsername}
      </Text>

      <Text>
        <Text as="span" fontWeight="semibold">
          Ort:
        </Text>{" "}
        {location}
      </Text>

      <Text>
        <Text as="span" fontWeight="semibold">
          Beginn:
        </Text>{" "}
        {new Date(startDatetime).toLocaleString()}
      </Text>

      <Text>
        <Text as="span" fontWeight="semibold">
          Ende:
        </Text>{" "}
        {endDatetime ? new Date(endDatetime).toLocaleString() : "—"}
      </Text>
    </Stack>
  );
}
