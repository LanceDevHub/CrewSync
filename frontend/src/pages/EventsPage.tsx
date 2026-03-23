import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Field,
  Input,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

import EventCard from "../components/events/EventCard";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";

import { getEvents } from "../api/events";
import type { Event } from "../types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyFuture, setOnlyFuture] = useState(true); // ✅ default TRUE

  async function loadEvents() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getEvents({
        q: q || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
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

  // ✅ INITIAL LOAD
  useEffect(() => {
    loadEvents();
  }, []);

  // ✅ AUTO SEARCH (DEBOUNCE)
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadEvents();
    }, 400); // leicht verzögert für UX

    return () => clearTimeout(timeout);
  }, [q, dateFrom, dateTo, onlyFuture]);

  function resetFilters() {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setOnlyFuture(true); // wichtig: zurück zum Default
  }

  return (
    <PageContainer
      title="Events"
      description="Entdecke Events und sieh direkt, wer schon dabei ist."
    >
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <Stack gap="4">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            {/* ✅ TEXT SUCHE */}
            <Field.Root>
              <Field.Label>Suche</Field.Label>
              <Input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Titel, Line-up oder Ort"
              />
            </Field.Root>

            {/* ✅ DATE FROM */}
            <Field.Root>
              <Field.Label>Beginn ab</Field.Label>
              <Input
                type="datetime-local"
                value={dateFrom || ""}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </Field.Root>

            {/* ✅ DATE TO */}
            <Field.Root>
              <Field.Label>Beginn bis</Field.Label>
              <Input
                type="datetime-local"
                value={dateTo || ""}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </Field.Root>
          </SimpleGrid>

          {/* ✅ ONLY FUTURE */}
          <Checkbox.Root
            checked={onlyFuture}
            onCheckedChange={(details) =>
              setOnlyFuture(Boolean(details.checked))
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Nur zukünftige Events</Checkbox.Label>
          </Checkbox.Root>
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={isLoading && !q && !dateFrom && !dateTo}
          >
            Filter zurücksetzen
          </Button>
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
