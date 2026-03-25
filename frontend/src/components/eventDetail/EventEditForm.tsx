import { useState } from "react";
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

import AppButton from "../ui/AppButton";
import type { Event } from "../../types/event";

type EventEditFormProps = {
  event: Event;
  loading: boolean;
  onCancel: () => void;
  onSave: (data: {
    title: string;
    lineup: string;
    official_link: string | null;
    location: string;
    start_datetime: string;
    end_datetime: string | null;
  }) => Promise<void>;
};

export default function EventEditForm({
  event,
  loading,
  onCancel,
  onSave,
}: EventEditFormProps) {
  const [title, setTitle] = useState(event.title);
  const [lineup, setLineup] = useState(event.lineup);
  const [officialLink, setOfficialLink] = useState(event.official_link ?? "");
  const [location, setLocation] = useState(event.location);
  const [startDatetime, setStartDatetime] = useState(
    event.start_datetime.slice(0, 16),
  );
  const [endDatetime, setEndDatetime] = useState(
    event.end_datetime ? event.end_datetime.slice(0, 16) : "",
  );

  const [formError, setFormError] = useState("");

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setFormError("");

    // 🔴 Frontend Validation
    if (!title.trim()) {
      setFormError("Titel darf nicht leer sein.");
      return;
    }

    if (!lineup.trim()) {
      setFormError("Line-up darf nicht leer sein.");
      return;
    }

    if (!location.trim()) {
      setFormError("Ort darf nicht leer sein.");
      return;
    }

    if (!startDatetime) {
      setFormError("Startdatum ist erforderlich.");
      return;
    }

    if (endDatetime && endDatetime < startDatetime) {
      setFormError("Enddatum darf nicht vor dem Startdatum liegen.");
      return;
    }

    try {
      await onSave({
        title,
        lineup,
        official_link: officialLink || null,
        location,
        start_datetime: startDatetime,
        end_datetime: endDatetime || null,
      });
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Event konnte nicht gespeichert werden.");
      }
    }
  }

  return (
    <Box
      bg="surface"
      p="8"
      borderRadius="2xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="6">
        <Heading size="lg">Event bearbeiten</Heading>

        {formError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Fehler</Alert.Title>
              <Alert.Description>{formError}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Field.Root required invalid={!title.trim()}>
              <Field.Label>Titel</Field.Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              {!title.trim() && (
                <Text fontSize="sm" color="red.500">
                  Pflichtfeld
                </Text>
              )}
            </Field.Root>

            <Field.Root required invalid={!lineup.trim()}>
              <Field.Label>Line-up</Field.Label>
              <Textarea
                placeholder="Ein Interpret pro Zeile"
                value={lineup}
                onChange={(e) => setLineup(e.target.value)}
              />
            </Field.Root>

            <Field.Root required invalid={!location.trim()}>
              <Field.Label>Ort</Field.Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Offizielle Eventseite (optional)</Field.Label>
              <Input
                type="url"
                value={officialLink}
                onChange={(e) => setOfficialLink(e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Beginn</Field.Label>
              <Input
                type="datetime-local"
                value={startDatetime}
                onChange={(e) => setStartDatetime(e.target.value)}
              />
            </Field.Root>

            <Field.Root invalid={!!endDatetime && endDatetime < startDatetime}>
              <Field.Label>Ende (optional)</Field.Label>
              <Input
                type="datetime-local"
                value={endDatetime}
                onChange={(e) => setEndDatetime(e.target.value)}
              />

              {endDatetime && endDatetime < startDatetime && (
                <Text fontSize="sm" color="red.500">
                  Enddatum liegt vor dem Startdatum
                </Text>
              )}
            </Field.Root>

            <Stack direction={{ base: "column", sm: "row" }} gap="3">
              <AppButton type="submit" appVariant="primary" loading={loading}>
                Änderungen speichern
              </AppButton>

              <AppButton
                type="button"
                appVariant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Abbrechen
              </AppButton>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
