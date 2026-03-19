import { del, get, post, patch } from "../lib/api-client";
import type { Event, EventCreatePayload, EventUpdatePayload } from "../types/event";

export type EventFilters = {
  q?: string;
  genre?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
  only_future?: boolean;
};

function buildQueryString(filters?: EventFilters) {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.location) params.set("location", filters.location);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  if (filters.only_future) params.set("only_future", String(filters.only_future));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function getEvents(filters?: EventFilters) {
  return get<Event[]>(`/events${buildQueryString(filters)}`);
}

export function getEventById(eventId: number) {
  return get<Event>(`/events/${eventId}`);
}

export function createEvent(payload: EventCreatePayload) {
  return post<Event>("/events", payload);
}

export function joinEvent(eventId: number) {
  return post<{ message: string }>(`/events/${eventId}/join`);
}

export function leaveEvent(eventId: number) {
  return del<{ message: string }>(`/events/${eventId}/leave`);
}

export function updateEvent(eventId: number, payload: EventUpdatePayload) {
  return patch<Event>(`/events/${eventId}`, payload);
}

export function deleteEvent(eventId: number) {
  return del<{ message: string }>(`/events/${eventId}`);
}