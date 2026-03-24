import { useEffect, useState } from "react";
import {
  Box,
  Field,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

import EventCard from "../components/events/EventCard";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";

import { getEvents } from "../api/events";
import type { Event } from "../types/event";

import AppButton from "../components/ui/AppButton";

type TimeRangeFilter = "" | "24h" | "1w" | "2w" | "1m" | "3m" | "6m" | "later";

function getDateRangeFromFilter(range: TimeRangeFilter): {
  dateFrom?: string;
  dateTo?: string;
} {
  const now = new Date();

  if (!range) {
    return {};
  }

  const date = new Date(now);

  switch (range) {
    case "24h":
      date.setHours(date.getHours() + 24);
      return { dateTo: date.toISOString() };

    case "1w":
      date.setDate(date.getDate() + 7);
      return { dateTo: date.toISOString() };

    case "2w":
      date.setDate(date.getDate() + 14);
      return { dateTo: date.toISOString() };

    case "1m":
      date.setMonth(date.getMonth() + 1);
      return { dateTo: date.toISOString() };

    case "3m":
      date.setMonth(date.getMonth() + 3);
      return { dateTo: date.toISOString() };

    case "6m":
      date.setMonth(date.getMonth() + 6);
      return { dateTo: date.toISOString() };

    case "later":
      date.setMonth(date.getMonth() + 6);
      return { dateFrom: date.toISOString() };

    default:
      return {};
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("");
  const [onlyFuture, setOnlyFuture] = useState(true);

  async function loadEvents() {
    setIsLoading(true);
    setError("");

    try {
      const { dateFrom, dateTo } = getDateRangeFromFilter(timeRange);

      const data = await getEvents({
        q: q || undefined,
        date_from: dateFrom,
        date_to: dateTo,
        only_future: onlyFuture || undefined,
      });

      setEvents(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Events could not be loaded.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadEvents();
    }, 400);

    return () => clearTimeout(timeout);
  }, [q, timeRange, onlyFuture]);

  function resetFilters() {
    setQ("");
    setTimeRange("");
    setOnlyFuture(true);
  }

  return (
    <PageContainer
      title="Events"
      description="Entdecke Events und sieh direkt, wer schon dabei ist."
    >
      <Box
        bg="surface"
        p="6"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="border"
      >
        <Stack gap="4">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <Field.Root>
              <Field.Label color="text">Suche</Field.Label>
              <Input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Titel, Line-up oder Ort"
                color="text"
                bg="surface"
                borderColor="border"
                _placeholder={{ color: "textMuted" }}
                _focusVisible={{ borderColor: "brandAccent" }}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label color="text">Zeitraum</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={timeRange}
                  onChange={(event) =>
                    setTimeRange(event.target.value as TimeRangeFilter)
                  }
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _focusVisible={{ borderColor: "brandAccent" }}
                >
                  <option value="">Alle</option>
                  <option value="24h">24h</option>
                  <option value="1w">1 Woche</option>
                  <option value="2w">2 Wochen</option>
                  <option value="1m">1 Monat</option>
                  <option value="3m">3 Monate</option>
                  <option value="6m">6 Monate</option>
                  <option value="later">später</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </SimpleGrid>

          <AppButton
            type="button"
            appVariant="secondary"
            onClick={resetFilters}
          >
            Zurücksetzen
          </AppButton>
        </Stack>
      </Box>

      {isLoading ? (
        <LoadingState message="Events werden geladen..." />
      ) : error ? (
        <EmptyState message={error} />
      ) : events.length === 0 ? (
        <EmptyState message="Keine Events gefunden." />
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  );
}
