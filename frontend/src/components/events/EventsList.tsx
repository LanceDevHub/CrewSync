import { SimpleGrid, Stack } from "@chakra-ui/react";
import EventCard from "./EventCard";
import AppButton from "../ui/AppButton";
import type { Event } from "../../types/event";

type Props = {
  events: Event[];
  visibleCount: number;
  onMore: () => void;
  onLess: () => void;
};

const EVENTS_STEP = 6;

export default function EventsList({
  events,
  visibleCount,
  onMore,
  onLess,
}: Props) {
  const visible = events.slice(0, visibleCount);

  const showMore = events.length > EVENTS_STEP && visibleCount < events.length;
  const showLess = visibleCount > EVENTS_STEP;

  return (
    <Stack gap="6">
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
        {visible.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </SimpleGrid>

      {(showMore || showLess) && (
        <SimpleGrid
          columns={{ base: 1, sm: showMore && showLess ? 2 : 1 }}
          gap="3"
        >
          {showLess && (
            <AppButton onClick={onLess} appVariant="secondary">
              Weniger anzeigen
            </AppButton>
          )}

          {showMore && (
            <AppButton onClick={onMore} appVariant="primary">
              Mehr anzeigen
            </AppButton>
          )}
        </SimpleGrid>
      )}
    </Stack>
  );
}
