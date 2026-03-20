import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { getCurrentUser } from "../api/auth";
import {
  deleteEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../api/events";
import type { Event } from "../types/event";
import type { User } from "../types/user";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [genre, setGenre] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  useEffect(() => {
    async function loadEventData() {
      if (!id) {
        setError("Keine Event-ID gefunden.");
        setIsLoading(false);
        return;
      }

      try {
        const [eventData, userData] = await Promise.all([
          getEventById(Number(id)),
          getCurrentUser().catch(() => null),
        ]);

        setEvent(eventData);
        setCurrentUser(userData);

        setTitle(eventData.title);
        setDescription(eventData.description);
        setLocation(eventData.location);
        setGenre(eventData.genre ?? "");
        setStartDatetime(eventData.start_datetime.slice(0, 16));
        setEndDatetime(
          eventData.end_datetime ? eventData.end_datetime.slice(0, 16) : "",
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Event konnte nicht geladen werden.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEventData();
  }, [id]);

  async function reloadEvent() {
    if (!id) return;

    const eventData = await getEventById(Number(id));
    setEvent(eventData);
    setTitle(eventData.title);
    setDescription(eventData.description);
    setLocation(eventData.location);
    setGenre(eventData.genre ?? "");
    setStartDatetime(eventData.start_datetime.slice(0, 16));
    setEndDatetime(
      eventData.end_datetime ? eventData.end_datetime.slice(0, 16) : "",
    );
  }

  async function handleJoin() {
    if (!id) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const result = await joinEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Beitritt fehlgeschlagen.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!id) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const result = await leaveEvent(Number(id));
      setActionMessage(result.message);
      await reloadEvent();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verlassen fehlgeschlagen.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdate(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!id || !event) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      const updated = await updateEvent(Number(id), {
        title,
        description,
        location,
        genre: genre || null,
        start_datetime: startDatetime,
        end_datetime: endDatetime || null,
      });

      setEvent(updated);
      setIsEditing(false);
      setActionMessage("Event erfolgreich aktualisiert.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht aktualisiert werden.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!id) return;

    const confirmed = window.confirm(
      "Möchtest du dieses Event wirklich löschen?",
    );
    if (!confirmed) return;

    setActionMessage("");
    setError("");
    setActionLoading(true);

    try {
      await deleteEvent(Number(id));
      navigate("/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Event konnte nicht gelöscht werden.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text>Event wird geladen...</Text>
      </Box>
    );
  }

  if (error && !event) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Text>Event nicht gefunden.</Text>
      </Box>
    );
  }

  const isCreator = currentUser?.id === event.creator_id;
  const visibleParticipants = showAllParticipants
    ? event.participants
    : event.participants.slice(0, 3);

  return (
    <Stack gap="6">
      {isEditing ? (
        <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
          <Stack gap="6">
            <Heading size="lg">Event bearbeiten</Heading>

            <form onSubmit={handleUpdate}>
              <Stack gap="4">
                <Field.Root required>
                  <Field.Label>Titel</Field.Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Beschreibung</Field.Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Ort</Field.Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Genre</Field.Label>
                  <Input
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
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

                <Field.Root>
                  <Field.Label>Ende (optional)</Field.Label>
                  <Input
                    type="datetime-local"
                    value={endDatetime}
                    onChange={(e) => setEndDatetime(e.target.value)}
                  />
                </Field.Root>

                <Stack direction={{ base: "column", sm: "row" }} gap="3">
                  <Button
                    type="submit"
                    colorPalette="teal"
                    loading={actionLoading}
                  >
                    Änderungen speichern
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={actionLoading}
                  >
                    Abbrechen
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      ) : (
        <>
          <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
            <Stack gap="4">
              <Heading size="lg">{event.title}</Heading>

              <Text color="gray.700">{event.description}</Text>

              <Text>
                <Text as="span" fontWeight="semibold">
                  Erstellt von:
                </Text>{" "}
                {event.creator_username}
              </Text>

              <Text>
                <Text as="span" fontWeight="semibold">
                  Ort:
                </Text>{" "}
                {event.location}
              </Text>

              <Text>
                <Text as="span" fontWeight="semibold">
                  Genre:
                </Text>{" "}
                {event.genre ?? "—"}
              </Text>

              <Text>
                <Text as="span" fontWeight="semibold">
                  Beginn:
                </Text>{" "}
                {new Date(event.start_datetime).toLocaleString()}
              </Text>

              <Text>
                <Text as="span" fontWeight="semibold">
                  Ende:
                </Text>{" "}
                {event.end_datetime
                  ? new Date(event.end_datetime).toLocaleString()
                  : "Kein Endzeitpunkt angegeben"}
              </Text>
            </Stack>
          </Box>

          <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
            <Stack gap="4">
              <Heading size="md">
                Teilnehmer ({event.participants_count})
              </Heading>

              {event.participants.length === 0 ? (
                <Text>Noch keine Teilnehmer.</Text>
              ) : (
                <>
                  <Stack gap="2">
                    {visibleParticipants.map((participant) => (
                      <Box
                        key={participant}
                        px="3"
                        py="2"
                        bg="gray.50"
                        borderRadius="md"
                        borderWidth="1px"
                      >
                        <Text>{participant}</Text>
                      </Box>
                    ))}
                  </Stack>

                  {event.participants.length > 3 && (
                    <Button
                      variant="ghost"
                      alignSelf="flex-start"
                      onClick={() => setShowAllParticipants((prev) => !prev)}
                    >
                      {showAllParticipants
                        ? "Weniger anzeigen"
                        : "Mehr anzeigen"}
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Box>

          <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
            <Stack gap="4">
              <Heading size="md">Aktionen</Heading>

              {currentUser ? (
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  gap="3"
                  flexWrap="wrap"
                >
                  {!event.is_joined && (
                    <Button
                      onClick={handleJoin}
                      colorPalette="teal"
                      loading={actionLoading}
                    >
                      Event beitreten
                    </Button>
                  )}

                  {event.is_joined && (
                    <Button
                      onClick={handleLeave}
                      variant="outline"
                      loading={actionLoading}
                    >
                      Event verlassen
                    </Button>
                  )}

                  {isCreator && (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="subtle"
                        disabled={actionLoading}
                      >
                        Event bearbeiten
                      </Button>

                      <Button
                        onClick={handleDelete}
                        colorPalette="red"
                        disabled={actionLoading}
                      >
                        Event löschen
                      </Button>
                    </>
                  )}
                </Stack>
              ) : (
                <Text>
                  Du musst eingeloggt sein, um mit diesem Event zu interagieren.
                </Text>
              )}

              {isCreator && (
                <Text color="gray.600">
                  Du bist der Ersteller dieses Events.
                </Text>
              )}
            </Stack>
          </Box>
        </>
      )}

      {actionMessage && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Erfolgreich</Alert.Title>
            <Alert.Description>{actionMessage}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {error && event && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Fehler</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Stack>
  );
}
