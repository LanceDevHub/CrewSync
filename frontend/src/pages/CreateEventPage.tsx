import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Heading, Stack, Text } from "@chakra-ui/react";

import { createEvent } from "../api/events";
import AppButton from "../components/ui/AppButton";
import EventFormFields from "../components/events/EventFormFields";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [lineup, setLineup] = useState("");
  const [officialLink, setOfficialLink] = useState("");
  const [location, setLocation] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Titel darf nicht leer sein.");
      return;
    }

    if (!lineup.trim()) {
      setError("Line-up darf nicht leer sein.");
      return;
    }

    if (!location.trim()) {
      setError("Ort darf nicht leer sein.");
      return;
    }

    if (!startDatetime) {
      setError("Startdatum ist erforderlich.");
      return;
    }

    if (endDatetime && endDatetime < startDatetime) {
      setError("Enddatum darf nicht vor dem Startdatum liegen.");
      return;
    }

    setIsLoading(true);

    try {
      const createdEvent = await createEvent({
        title,
        lineup,
        official_link: officialLink || null,
        location,
        start_datetime: startDatetime,
        end_datetime: endDatetime || null,
      });

      navigate(`/events/${createdEvent.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht erstellt werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      maxW="xl"
      mx="auto"
      mt="10"
      p="8"
      bg="surface"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="6">
        <Box>
          <Heading size="lg">Event erstellen</Heading>
          <Text color="textMuted" mt="2">
            Lege ein neues Event an und gib Beginn sowie optional ein Ende an.
          </Text>
        </Box>

        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Event konnte nicht erstellt werden</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <EventFormFields
              title={title}
              lineup={lineup}
              officialLink={officialLink}
              location={location}
              startDatetime={startDatetime}
              endDatetime={endDatetime}
              onTitleChange={setTitle}
              onLineupChange={setLineup}
              onOfficialLinkChange={setOfficialLink}
              onLocationChange={setLocation}
              onStartDatetimeChange={setStartDatetime}
              onEndDatetimeChange={setEndDatetime}
            />

            <AppButton type="submit" appVariant="primary" loading={isLoading}>
              Event erstellen
            </AppButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
