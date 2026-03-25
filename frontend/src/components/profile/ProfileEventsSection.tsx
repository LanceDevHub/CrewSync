import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Collapsible,
  Field,
  Heading,
  Input,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

import EmptyState from "../common/EmptyState";
import EventCard from "../events/EventCard";
import AppButton from "../ui/AppButton";
import {
  filterEvents,
  isPastEvent,
  sortByStartAscending,
} from "./profileEventUtils";
import type { Event } from "../../types/event";

const EVENTS_STEP = 6;

type EventSectionView = "upcoming" | "past";

type ProfileEventsSectionProps = {
  title: string;
  events: Event[];
  includeCreatorInSearch?: boolean;
  defaultOpen?: boolean;
};

export default function ProfileEventsSection({
  title,
  events,
  includeCreatorInSearch = false,
  defaultOpen = false,
}: ProfileEventsSectionProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [view, setView] = useState<EventSectionView>("upcoming");
  const [visibleCount, setVisibleCount] = useState(EVENTS_STEP);

  const upcomingEvents = useMemo(() => {
    const filtered = events.filter((event) => !isPastEvent(event));
    return sortByStartAscending(
      filterEvents(filtered, search, includeCreatorInSearch),
    );
  }, [events, search, includeCreatorInSearch]);

  const pastEvents = useMemo(() => {
    const filtered = events.filter((event) => isPastEvent(event));
    return sortByStartAscending(
      filterEvents(filtered, search, includeCreatorInSearch),
    );
  }, [events, search, includeCreatorInSearch]);

  useEffect(() => {
    setVisibleCount(EVENTS_STEP);
  }, [search, view, events]);

  const visibleEvents = view === "upcoming" ? upcomingEvents : pastEvents;
  const eventsToRender = visibleEvents.slice(0, visibleCount);

  const showMoreButton =
    visibleEvents.length > EVENTS_STEP && visibleCount < visibleEvents.length;

  const showLessButton = visibleCount > EVENTS_STEP;

  return (
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
            {title} ({events.length})
          </Heading>

          <AppButton
            appVariant="secondary"
            onClick={() => setIsOpen((prev) => !prev)}
            alignSelf={{ base: "stretch", sm: "auto" }}
          >
            {isOpen ? "Ausblenden" : "Anzeigen"}
          </AppButton>
        </Stack>

        <Collapsible.Root open={isOpen}>
          <Collapsible.Content>
            <Stack gap="5">
              <Field.Root maxW="md">
                <Field.Label>Suche</Field.Label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _placeholder={{ color: "textMuted" }}
                  _focusVisible={{ borderColor: "brandAccent" }}
                />
              </Field.Root>

              <Stack direction="row" gap="2" flexWrap="wrap">
                <AppButton
                  appVariant={view === "upcoming" ? "primary" : "secondary"}
                  onClick={() => setView("upcoming")}
                >
                  Aktuell ({upcomingEvents.length})
                </AppButton>

                <AppButton
                  appVariant={view === "past" ? "primary" : "secondary"}
                  onClick={() => setView("past")}
                >
                  Vergangen ({pastEvents.length})
                </AppButton>
              </Stack>

              {visibleEvents.length === 0 ? (
                <EmptyState message="Keine Events gefunden." />
              ) : (
                <Stack gap="6">
                  <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
                    {eventsToRender.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </SimpleGrid>

                  {(showLessButton || showMoreButton) && (
                    <SimpleGrid
                      columns={{
                        base: 1,
                        sm: showLessButton && showMoreButton ? 2 : 1,
                      }}
                      gap="3"
                    >
                      {showLessButton && (
                        <AppButton
                          type="button"
                          appVariant="secondary"
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.max(EVENTS_STEP, prev - EVENTS_STEP),
                            )
                          }
                        >
                          Weniger anzeigen
                        </AppButton>
                      )}

                      {showMoreButton && (
                        <AppButton
                          type="button"
                          appVariant="primary"
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.min(
                                prev + EVENTS_STEP,
                                visibleEvents.length,
                              ),
                            )
                          }
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
  );
}
