import type { Event } from "../../types/event";

export function sortByStartAscending(events: Event[]) {
  return [...events].sort(
    (a, b) =>
      new Date(a.start_datetime).getTime() -
      new Date(b.start_datetime).getTime(),
  );
}

export function isPastEvent(event: Event) {
  return new Date(event.start_datetime).getTime() < Date.now();
}

export function filterEvents(
  events: Event[],
  search: string,
  includeCreator = false,
) {
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