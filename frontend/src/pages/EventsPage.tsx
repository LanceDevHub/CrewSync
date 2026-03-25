import { useState } from "react";
import PageContainer from "../components/common/PageContainer";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";

import EventsFilters from "../components/events/EventsFilters";
import EventsList from "../components/events/EventsList";
import {
  useEvents,
  type TimeRangeFilter,
} from "../components/events/useEvents";

const EVENTS_STEP = 6;

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("");
  const [visibleCount, setVisibleCount] = useState(EVENTS_STEP);

  const { events, isLoading, error } = useEvents(q, timeRange);

  function resetFilters() {
    setQ("");
    setTimeRange("");
    setVisibleCount(EVENTS_STEP);
  }

  return (
    <PageContainer title="Events" description="Entdecke Events">
      <EventsFilters
        q={q}
        setQ={setQ}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onReset={resetFilters}
      />

      {isLoading ? (
        <LoadingState message="Events werden geladen..." />
      ) : error ? (
        <EmptyState message={error} />
      ) : events.length === 0 ? (
        <EmptyState message="Keine Events gefunden." />
      ) : (
        <EventsList
          events={events}
          visibleCount={visibleCount}
          onMore={() =>
            setVisibleCount((prev) =>
              Math.min(prev + EVENTS_STEP, events.length),
            )
          }
          onLess={() =>
            setVisibleCount((prev) => Math.max(EVENTS_STEP, prev - EVENTS_STEP))
          }
        />
      )}
    </PageContainer>
  );
}
