import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Collapsible,
  Field,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { getCurrentUser } from "../api/auth";
import {
  changeMyPassword,
  getMyCreatedEvents,
  getMyJoinedEvents,
  updateMyUsername,
} from "../api/users";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";
import EventCard from "../components/events/EventCard";
import AppButton from "../components/ui/AppButton";

import type { Event } from "../types/event";
import type { User } from "../types/user";

const EVENTS_STEP = 6;

function sortByStartAscending(events: Event[]) {
  return [...events].sort(
    (a, b) =>
      new Date(a.start_datetime).getTime() -
      new Date(b.start_datetime).getTime(),
  );
}

function isPastEvent(event: Event) {
  return new Date(event.start_datetime).getTime() < Date.now();
}

function filterEvents(events: Event[], search: string, includeCreator = false) {
  if (!search.trim()) {
    return events;
  }

  const normalizedSearch = search.toLowerCase();

  return events.filter((event) => {
    return (
      event.title.toLowerCase().includes(normalizedSearch) ||
      event.lineup.toLowerCase().includes(normalizedSearch) ||
      event.location.toLowerCase().includes(normalizedSearch) ||
      (includeCreator &&
        event.creator_username.toLowerCase().includes(normalizedSearch))
    );
  });
}

type EventSectionView = "upcoming" | "past";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [createdSearch, setCreatedSearch] = useState("");
  const [joinedSearch, setJoinedSearch] = useState("");

  const [showJoinedSection, setShowJoinedSection] = useState(true);
  const [showCreatedSection, setShowCreatedSection] = useState(false);

  const [joinedView, setJoinedView] = useState<EventSectionView>("upcoming");
  const [createdView, setCreatedView] = useState<EventSectionView>("upcoming");

  const [visibleJoinedCount, setVisibleJoinedCount] = useState(EVENTS_STEP);
  const [visibleCreatedCount, setVisibleCreatedCount] = useState(EVENTS_STEP);

  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [user, created, joined] = await Promise.all([
          getCurrentUser(),
          getMyCreatedEvents(),
          getMyJoinedEvents(),
        ]);

        setCurrentUser(user);
        setNewUsername(user.username);
        setCreatedEvents(created);
        setJoinedEvents(joined);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Profil konnte nicht geladen werden.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileData();
  }, []);

  const upcomingJoinedEvents = useMemo(() => {
    const filtered = joinedEvents.filter((event) => !isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, joinedSearch, true));
  }, [joinedEvents, joinedSearch]);

  const pastJoinedEvents = useMemo(() => {
    const filtered = joinedEvents.filter((event) => isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, joinedSearch, true));
  }, [joinedEvents, joinedSearch]);

  const upcomingCreatedEvents = useMemo(() => {
    const filtered = createdEvents.filter((event) => !isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, createdSearch));
  }, [createdEvents, createdSearch]);

  const pastCreatedEvents = useMemo(() => {
    const filtered = createdEvents.filter((event) => isPastEvent(event));
    return sortByStartAscending(filterEvents(filtered, createdSearch));
  }, [createdEvents, createdSearch]);

  useEffect(() => {
    setVisibleJoinedCount(EVENTS_STEP);
  }, [joinedSearch, joinedView, joinedEvents]);

  useEffect(() => {
    setVisibleCreatedCount(EVENTS_STEP);
  }, [createdSearch, createdView, createdEvents]);

  if (isLoading) return <LoadingState message="Profil wird geladen..." />;
  if (error) return <EmptyState message={error} />;
  if (!currentUser) return <EmptyState message="Nicht eingeloggt." />;

  const visibleJoinedEvents =
    joinedView === "upcoming" ? upcomingJoinedEvents : pastJoinedEvents;

  const visibleCreatedEvents =
    createdView === "upcoming" ? upcomingCreatedEvents : pastCreatedEvents;

  const joinedEventsToRender = visibleJoinedEvents.slice(0, visibleJoinedCount);
  const createdEventsToRender = visibleCreatedEvents.slice(
    0,
    visibleCreatedCount,
  );

  const showJoinedMoreButton =
    visibleJoinedEvents.length > EVENTS_STEP &&
    visibleJoinedCount < visibleJoinedEvents.length;

  const showJoinedLessButton = visibleJoinedCount > EVENTS_STEP;

  const showCreatedMoreButton =
    visibleCreatedEvents.length > EVENTS_STEP &&
    visibleCreatedCount < visibleCreatedEvents.length;

  const showCreatedLessButton = visibleCreatedCount > EVENTS_STEP;

  function handleShowMoreJoined() {
    setVisibleJoinedCount((prev) =>
      Math.min(prev + EVENTS_STEP, visibleJoinedEvents.length),
    );
  }

  function handleShowLessJoined() {
    setVisibleJoinedCount((prev) => Math.max(EVENTS_STEP, prev - EVENTS_STEP));
  }

  function handleShowMoreCreated() {
    setVisibleCreatedCount((prev) =>
      Math.min(prev + EVENTS_STEP, visibleCreatedEvents.length),
    );
  }

  function handleShowLessCreated() {
    setVisibleCreatedCount((prev) => Math.max(EVENTS_STEP, prev - EVENTS_STEP));
  }

  async function handleUpdateUsername() {
    setAccountError("");
    setAccountSuccess("");

    if (!newUsername.trim()) {
      setAccountError("Bitte gib einen Benutzernamen ein.");
      return;
    }

    if (newUsername.trim() === currentUser?.username) {
      setAccountError("Der neue Benutzername ist identisch mit dem aktuellen.");
      return;
    }

    setIsUpdatingUsername(true);

    try {
      const updatedUser = await updateMyUsername(newUsername.trim());
      setCurrentUser(updatedUser);
      setNewUsername(updatedUser.username);
      setAccountSuccess("Benutzername erfolgreich geändert.");
      setShowUsernameForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setAccountError(err.message);
      } else {
        setAccountError("Benutzername konnte nicht geändert werden.");
      }
    } finally {
      setIsUpdatingUsername(false);
    }
  }

  async function handleChangePassword() {
    setAccountError("");
    setAccountSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setAccountError("Bitte fülle alle Passwortfelder aus.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAccountError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const result = await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setAccountSuccess(result.message || "Passwort erfolgreich geändert.");
      setShowPasswordForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setAccountError(err.message);
      } else {
        setAccountError("Passwort konnte nicht geändert werden.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <PageContainer
      title="Mein Profil"
      description="Hier findest du deine Profildaten sowie deine beigetretenen und erstellten Events."
    >
      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="5">
          <Stack direction={{ base: "column", md: "row" }} gap="5">
            <Avatar.Root size="2xl">
              <Avatar.Fallback
                name={`${currentUser.first_name} ${currentUser.last_name}`}
              />
            </Avatar.Root>

            <Stack gap="2">
              <Stack direction="row" align="center" gap="2">
                <Heading size="lg">
                  {currentUser.first_name} {currentUser.last_name}
                </Heading>

                {currentUser.is_admin && (
                  <Badge colorPalette="purple" variant="subtle">
                    Admin
                  </Badge>
                )}
              </Stack>

              <Text color="textMuted">@{currentUser.username}</Text>
              <Text color="textMuted">{currentUser.email}</Text>
            </Stack>
          </Stack>

          <Stack direction={{ base: "column", sm: "row" }} gap="3">
            <AppButton
              appVariant="secondary"
              onClick={() => {
                setShowUsernameForm((prev) => !prev);
                setShowPasswordForm(false);
                setAccountError("");
                setAccountSuccess("");
              }}
            >
              Username ändern
            </AppButton>

            <AppButton
              appVariant="secondary"
              onClick={() => {
                setShowPasswordForm((prev) => !prev);
                setShowUsernameForm(false);
                setAccountError("");
                setAccountSuccess("");
              }}
            >
              Passwort ändern
            </AppButton>
          </Stack>

          {accountError && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Fehler</Alert.Title>
                <Alert.Description>{accountError}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {accountSuccess && (
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Erfolg</Alert.Title>
                <Alert.Description>{accountSuccess}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <Collapsible.Root open={showUsernameForm}>
            <Collapsible.Content>
              <Stack gap="4">
                <Field.Root maxW="md">
                  <Field.Label>Neuer Benutzername</Field.Label>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Stack direction={{ base: "column", sm: "row" }} gap="3">
                  <AppButton
                    appVariant="primary"
                    onClick={handleUpdateUsername}
                    loading={isUpdatingUsername}
                  >
                    Username speichern
                  </AppButton>

                  <AppButton
                    appVariant="secondary"
                    onClick={() => {
                      setShowUsernameForm(false);
                      setNewUsername(currentUser.username);
                      setAccountError("");
                      setAccountSuccess("");
                    }}
                  >
                    Abbrechen
                  </AppButton>
                </Stack>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>

          <Collapsible.Root open={showPasswordForm}>
            <Collapsible.Content>
              <Stack gap="4">
                <Field.Root maxW="md">
                  <Field.Label>Aktuelles Passwort</Field.Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Field.Root maxW="md">
                  <Field.Label>Neues Passwort</Field.Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Field.Root maxW="md">
                  <Field.Label>Neues Passwort wiederholen</Field.Label>
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Stack direction={{ base: "column", sm: "row" }} gap="3">
                  <AppButton
                    appVariant="primary"
                    onClick={handleChangePassword}
                    loading={isUpdatingPassword}
                  >
                    Passwort speichern
                  </AppButton>

                  <AppButton
                    appVariant="secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setAccountError("");
                      setAccountSuccess("");
                    }}
                  >
                    Abbrechen
                  </AppButton>
                </Stack>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Box>

      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="5">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
            gap="3"
          >
            <Heading size="md">
              Beigetretene Events ({joinedEvents.length})
            </Heading>

            <AppButton
              appVariant="secondary"
              onClick={() => setShowJoinedSection((prev) => !prev)}
              alignSelf={{ base: "stretch", sm: "auto" }}
            >
              {showJoinedSection ? "Ausblenden" : "Anzeigen"}
            </AppButton>
          </Stack>

          <Collapsible.Root open={showJoinedSection}>
            <Collapsible.Content>
              <Stack gap="5">
                <Field.Root maxW="md">
                  <Field.Label>Suche</Field.Label>
                  <Input
                    value={joinedSearch}
                    onChange={(e) => setJoinedSearch(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Stack direction="row" gap="2" flexWrap="wrap">
                  <AppButton
                    appVariant={
                      joinedView === "upcoming" ? "primary" : "secondary"
                    }
                    onClick={() => setJoinedView("upcoming")}
                  >
                    Aktuell ({upcomingJoinedEvents.length})
                  </AppButton>

                  <AppButton
                    appVariant={joinedView === "past" ? "primary" : "secondary"}
                    onClick={() => setJoinedView("past")}
                  >
                    Vergangen ({pastJoinedEvents.length})
                  </AppButton>
                </Stack>

                {visibleJoinedEvents.length === 0 ? (
                  <EmptyState message="Keine Events gefunden." />
                ) : (
                  <Stack gap="6">
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
                      {joinedEventsToRender.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </SimpleGrid>

                    {(showJoinedLessButton || showJoinedMoreButton) && (
                      <SimpleGrid
                        columns={{
                          base: 1,
                          sm:
                            showJoinedLessButton && showJoinedMoreButton
                              ? 2
                              : 1,
                        }}
                        gap="3"
                      >
                        {showJoinedLessButton && (
                          <AppButton
                            type="button"
                            appVariant="secondary"
                            onClick={handleShowLessJoined}
                          >
                            Weniger anzeigen
                          </AppButton>
                        )}

                        {showJoinedMoreButton && (
                          <AppButton
                            type="button"
                            appVariant="primary"
                            onClick={handleShowMoreJoined}
                          >
                            Mehr anzeigen
                          </AppButton>
                        )}
                      </SimpleGrid>
                    )}
                  </Stack>
                )}
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Box>

      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="5">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
            gap="3"
          >
            <Heading size="md">
              Erstellte Events ({createdEvents.length})
            </Heading>

            <AppButton
              appVariant="secondary"
              onClick={() => setShowCreatedSection((prev) => !prev)}
              alignSelf={{ base: "stretch", sm: "auto" }}
            >
              {showCreatedSection ? "Ausblenden" : "Anzeigen"}
            </AppButton>
          </Stack>

          <Collapsible.Root open={showCreatedSection}>
            <Collapsible.Content>
              <Stack gap="5">
                <Field.Root maxW="md">
                  <Field.Label>Suche</Field.Label>
                  <Input
                    value={createdSearch}
                    onChange={(e) => setCreatedSearch(e.target.value)}
                    color="text"
                    bg="surface"
                    borderColor="border"
                    _placeholder={{ color: "textMuted" }}
                    _focusVisible={{ borderColor: "brandAccent" }}
                  />
                </Field.Root>

                <Stack direction="row" gap="2" flexWrap="wrap">
                  <AppButton
                    appVariant={
                      createdView === "upcoming" ? "primary" : "secondary"
                    }
                    onClick={() => setCreatedView("upcoming")}
                  >
                    Aktuell ({upcomingCreatedEvents.length})
                  </AppButton>

                  <AppButton
                    appVariant={
                      createdView === "past" ? "primary" : "secondary"
                    }
                    onClick={() => setCreatedView("past")}
                  >
                    Vergangen ({pastCreatedEvents.length})
                  </AppButton>
                </Stack>

                {visibleCreatedEvents.length === 0 ? (
                  <EmptyState message="Keine Events gefunden." />
                ) : (
                  <Stack gap="6">
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
                      {createdEventsToRender.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </SimpleGrid>

                    {(showCreatedLessButton || showCreatedMoreButton) && (
                      <SimpleGrid
                        columns={{
                          base: 1,
                          sm:
                            showCreatedLessButton && showCreatedMoreButton
                              ? 2
                              : 1,
                        }}
                        gap="3"
                      >
                        {showCreatedLessButton && (
                          <AppButton
                            type="button"
                            appVariant="secondary"
                            onClick={handleShowLessCreated}
                          >
                            Weniger anzeigen
                          </AppButton>
                        )}

                        {showCreatedMoreButton && (
                          <AppButton
                            type="button"
                            appVariant="primary"
                            onClick={handleShowMoreCreated}
                          >
                            Mehr anzeigen
                          </AppButton>
                        )}
                      </SimpleGrid>
                    )}
                  </Stack>
                )}
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Box>
    </PageContainer>
  );
}
