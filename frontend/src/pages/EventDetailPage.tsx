import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Link,
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
import EventMeta from "../components/events/EventMeta";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";

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
  const [lineup, setLineup] = useState("");
  const [officialLink, setOfficialLink] = useState("");
  const [location, setLocation] = useState("");

  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  const [shareMessage, setShareMessage] = useState("");

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
        setLineup(eventData.lineup);
        setOfficialLink(eventData.official_link ?? "");
        setLocation(eventData.location);
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
    setLineup(eventData.lineup);
    setOfficialLink(eventData.official_link ?? "");
    setLocation(eventData.location);
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
        lineup,
        official_link: officialLink || null,
        location,
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

  async function handleShare() {
    setError("");
    setActionMessage("");
    setShareMessage("");

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Event-Link in die Zwischenablage kopiert.");
    } catch {
      setShareMessage("Link konnte nicht kopiert werden.");
    }
  }

  if (isLoading) {
    return <LoadingState message="Event wird geladen..." />;
  }

  if (error && !event) {
    return <EmptyState message={error} />;
  }

  if (!event) {
    return <EmptyState message="Event nicht gefunden." />;
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
                  <Field.Label>Line-up</Field.Label>
                  <Textarea
                    placeholder="Ein Interpret pro Zeile"
                    value={lineup}
                    onChange={(e) => setLineup(e.target.value)}
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

              <Box>
                <Heading size="sm">Line-up</Heading>

                <Stack mt="2">
                  {event.lineup
                    .split("\n")
                    .filter((artist) => artist.trim() !== "")
                    .map((artist, index) => (
                      <Text key={index}>• {artist}</Text>
                    ))}
                </Stack>
              </Box>

              {event.official_link && (
                <Link
                  href={event.official_link}
                  color="teal.500"
                  target="_blank"
                >
                  Offizielle Eventseite
                </Link>
              )}

              <EventMeta
                creatorUsername={event.creator_username}
                location={event.location}
                startDatetime={event.start_datetime}
                endDatetime={event.end_datetime}
              />
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

                  <Button variant="outline" onClick={handleShare}>
                    Event teilen
                  </Button>

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

      {shareMessage && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Link kopiert</Alert.Title>
            <Alert.Description>{shareMessage}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Stack>
  );
}
