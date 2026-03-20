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

  function formatParticipantsPreview(event: Event) {
    if (event.participants_preview.length === 0) {
      return "Noch keine Teilnehmer";
    }

    const preview = event.participants_preview.join(", ");

    if (event.participants_count > 3) {
      return `${preview}, ...`;
    }

    return preview;
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
    <Stack gap="8">
      <Box>
        <Heading size="lg">Events</Heading>
        <Text color="gray.600" mt="2">
          Entdecke Events, filtere nach Ort und Genre und sieh direkt, wer schon
          dabei ist.
        </Text>
      </Box>

      <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
        <form onSubmit={handleFilterSubmit}>
          <Stack gap="4">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <Field.Root>
                <Field.Label>Suche</Field.Label>
                <Input
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  placeholder="Titel, Beschreibung oder Ort"
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
        <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
          <Text>Events werden geladen...</Text>
        </Box>
      ) : error ? (
        <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
          <Text color="red.500">{error}</Text>
        </Box>
      ) : events.length === 0 ? (
        <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
          <Text>Keine Events gefunden.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
          {events.map((event) => (
            <Box
              key={event.id}
              bg="white"
              p="6"
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
            >
              <Stack gap="3">
                <Heading size="md">{event.title}</Heading>

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

                <Text>
                  <Text as="span" fontWeight="semibold">
                    Teilnehmer:
                  </Text>{" "}
                  {formatParticipantsPreview(event)}
                </Text>

                <Link asChild color="teal.600" fontWeight="semibold">
                  <RouterLink to={`/events/${event.id}`}>
                    Details ansehen
                  </RouterLink>
                </Link>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
