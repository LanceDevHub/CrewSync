import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
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
import AppButton from "../components/ui/AppButton";

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
  const isAdmin = currentUser?.is_admin === true;
  const canManageEvent = isCreator || isAdmin;
  const visibleParticipants = showAllParticipants
    ? event.participants
    : event.participants.slice(0, 3);

  return (
    <Stack gap="6">
      {isEditing ? (
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
                  <AppButton
                    type="submit"
                    appVariant="primary"
                    loading={actionLoading}
                  >
                    Änderungen speichern
                  </AppButton>

                  <AppButton
                    type="button"
                    appVariant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={actionLoading}
                  >
                    Abbrechen
                  </AppButton>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      ) : (
        <>
          <Box
            bg="surface"
            p="8"
            borderRadius="2xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="border"
          >
            <Stack gap="6">
              <Stack gap="3">
                <Heading size="lg">{event.title}</Heading>

                {event.official_link && (
                  <Box>
                    <Link
                      href={event.official_link}
                      color="brandAccent"
                      target="_blank"
                      rel="noopener noreferrer"
                      fontWeight="medium"
                    >
                      Offizielle Eventseite
                    </Link>
                  </Box>
                )}
              </Stack>

              <Box
                bg="mutedBg"
                p="4"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="border"
              >
                <EventMeta
                  creatorUsername={event.creator_username}
                  location={event.location}
                  startDatetime={event.start_datetime}
                  endDatetime={event.end_datetime}
                />
              </Box>

              <Box>
                <Heading size="sm" mb="3">
                  Line-up
                </Heading>

                <Stack direction="row" gap="2" flexWrap="wrap">
                  {event.lineup
                    .split("\n")
                    .map((artist) => artist.trim())
                    .filter(Boolean)
                    .map((artist, index) => (
                      <Box
                        key={`${artist}-${index}`}
                        px="3"
                        py="1.5"
                        bg="mutedBg"
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor="border"
                        _hover={{
                          bg: "surface",
                          borderColor: "brandAccentHover",
                        }}
                      >
                        <Text fontSize="sm" fontWeight="medium">
                          {artist}
                        </Text>
                      </Box>
                    ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box
            bg="surface"
            p="8"
            borderRadius="2xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="border"
          >
            <Stack gap="4">
              <Heading size="md">
                Teilnehmer ({event.participants_count})
              </Heading>

              {event.participants.length === 0 ? (
                <Text color="textMuted">Noch keine Teilnehmer.</Text>
              ) : (
                <>
                  <Stack gap="3">
                    {visibleParticipants.map((participant) => (
                      <Box
                        key={participant.username}
                        px="4"
                        py="3"
                        bg="mutedBg"
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="border"
                      >
                        <Stack direction="row" gap="3" align="center">
                          <Avatar.Root size="sm">
                            <Avatar.Fallback
                              name={`${participant.first_name} ${participant.last_name}`}
                            />
                          </Avatar.Root>

                          <Box>
                            <Text fontWeight="medium">
                              {participant.first_name} {participant.last_name}
                            </Text>
                            <Text fontSize="sm" color="textMuted">
                              @{participant.username}
                            </Text>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  {event.participants.length > 3 && (
                    <AppButton
                      appVariant="ghost"
                      alignSelf="flex-start"
                      onClick={() => setShowAllParticipants((prev) => !prev)}
                    >
                      {showAllParticipants
                        ? "Weniger anzeigen"
                        : "Mehr anzeigen"}
                    </AppButton>
                  )}
                </>
              )}
            </Stack>
          </Box>

          <Box
            bg="surface"
            p="8"
            borderRadius="2xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="border"
          >
            <Stack gap="4">
              <Heading size="md">Aktionen</Heading>

              {currentUser ? (
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  gap="3"
                  flexWrap="wrap"
                >
                  {!event.is_joined && (
                    <AppButton
                      onClick={handleJoin}
                      appVariant="primary"
                      loading={actionLoading}
                    >
                      Event beitreten
                    </AppButton>
                  )}

                  {event.is_joined && (
                    <AppButton
                      onClick={handleLeave}
                      appVariant="secondary"
                      loading={actionLoading}
                    >
                      Event verlassen
                    </AppButton>
                  )}

                  {canManageEvent && (
                    <>
                      <AppButton
                        onClick={() => setIsEditing(true)}
                        appVariant="secondary"
                        disabled={actionLoading}
                      >
                        Event bearbeiten
                      </AppButton>

                      <AppButton
                        onClick={handleDelete}
                        appVariant="danger"
                        disabled={actionLoading}
                      >
                        Event löschen
                      </AppButton>
                    </>
                  )}

                  <AppButton appVariant="secondary" onClick={handleShare}>
                    Event teilen
                  </AppButton>
                </Stack>
              ) : (
                <Text color="textMuted">
                  Du musst eingeloggt sein, um mit diesem Event zu interagieren.
                </Text>
              )}

              {isCreator && (
                <Text color="textMuted">
                  Du bist der Ersteller dieses Events.
                </Text>
              )}

              {isAdmin && !isCreator && (
                <Text color="textMuted">
                  Du bearbeitest dieses Event mit Admin-Rechten.
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
