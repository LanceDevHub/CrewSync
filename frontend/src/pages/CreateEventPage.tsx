import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { createEvent } from "../api/events";
import AppButton from "../components/ui/AppButton";

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

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Field.Root required>
              <Field.Label>Titel</Field.Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Interpreten / Line-up</Field.Label>
              <Textarea
                placeholder="Ein Name pro Zeile"
                value={lineup}
                onChange={(event) => setLineup(event.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Offizielle Eventseite (optional)</Field.Label>
              <Input
                type="text"
                placeholder="z. B. www.eventseite.de"
                value={officialLink}
                onChange={(event) => setOfficialLink(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Ort</Field.Label>
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Beginn</Field.Label>
              <Input
                type="datetime-local"
                value={startDatetime}
                onChange={(event) => setStartDatetime(event.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Ende (optional)</Field.Label>
              <Input
                type="datetime-local"
                value={endDatetime || ""}
                onChange={(event) => setEndDatetime(event.target.value)}
              />
            </Field.Root>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Event konnte nicht erstellt werden</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <AppButton type="submit" appVariant="primary" loading={isLoading}>
              Event erstellen
            </AppButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
