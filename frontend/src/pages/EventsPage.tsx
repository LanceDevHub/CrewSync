import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Field,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
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
  const [genre, setGenre] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyFuture, setOnlyFuture] = useState(false);

  async function loadEvents() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getEvents({
        q: q || undefined,
        genre: genre || undefined,
        location: location || undefined,
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

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadEvents();
  }

  function resetFilters() {
    setQ("");
    setGenre("");
    setLocation("");
    setDateFrom("");
    setDateTo("");
    setOnlyFuture(false);
  }

  return (
    <PageContainer
      title="Events"
      description="Entdecke Events, filtere nach Ort und Genre und sieh direkt, wer schon dabei ist."
    >
      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <form onSubmit={handleFilterSubmit}>
          <Stack gap="4">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <Field.Root>
                <Field.Label>Suche</Field.Label>
                <Input
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  placeholder="Titel, Line-up oder Ort"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Genre</Field.Label>
                <Input
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                  placeholder="z. B. Techno"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Ort</Field.Label>
                <Input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="z. B. Berlin"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Beginn ab</Field.Label>
                <Input
                  type="datetime-local"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Beginn bis</Field.Label>
                <Input
                  type="datetime-local"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </Field.Root>
            </SimpleGrid>

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

            <Stack direction={{ base: "column", sm: "row" }} gap="3">
              <Button type="submit" colorPalette="teal" loading={isLoading}>
                Filter anwenden
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                disabled={isLoading}
              >
                Filter zurücksetzen
              </Button>
            </Stack>
          </Stack>
        </form>
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
