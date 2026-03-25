import { useEffect, useState } from "react";
import { getEvents } from "../../api/events";
import type { Event } from "../../types/event";

export type TimeRangeFilter =
  | ""
  | "24h"
  | "1w"
  | "2w"
  | "1m"
  | "3m"
  | "6m"
  | "later";

function getDateRangeFromFilter(range: TimeRangeFilter) {
  const now = new Date();
  const date = new Date(now);

  if (!range) return {};

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

export function useEvents(q: string, timeRange: TimeRangeFilter) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const { dateFrom, dateTo } = getDateRangeFromFilter(timeRange);

        const data = await getEvents({
          q: q || undefined,
          date_from: dateFrom,
          date_to: dateTo,
          only_future: timeRange !== "" || undefined,
        });

        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [q, timeRange]);

  return { events, isLoading, error };
}