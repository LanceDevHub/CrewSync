import { Stack, Text } from "@chakra-ui/react";

type EventMetaProps = {
  creatorUsername: string;
  location: string;
  startDatetime: string;
  endDatetime: string | null;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function EventMeta({
  creatorUsername,
  location,
  startDatetime,
  endDatetime,
}: EventMetaProps) {
  return (
    <Stack fontSize="sm" color="textMuted" gap="2">
      <Text>
        <Text as="span" fontWeight="semibold" color="text">
          Erstellt von:
        </Text>{" "}
        {creatorUsername}
      </Text>

      <Text>
        <Text as="span" fontWeight="semibold" color="text">
          Ort:
        </Text>{" "}
        {location}
      </Text>

      <Text>
        <Text as="span" fontWeight="semibold" color="text">
          Beginn:
        </Text>{" "}
        {formatDateTime(startDatetime)}
      </Text>

      {endDatetime && (
        <Text>
          <Text as="span" fontWeight="semibold" color="text">
            Ende:
          </Text>{" "}
          {formatDateTime(endDatetime)}
        </Text>
      )}
    </Stack>
  );
}
