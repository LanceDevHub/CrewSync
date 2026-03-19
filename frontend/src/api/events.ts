import { get, post } from "../lib/api-client";
import type { Event, EventCreatePayload } from "../types/event";

export function getEvents() {
  return get<Event[]>("/events");
}

export function getEventById(eventId: number) {
  return get<Event>(`/events/${eventId}`);
}

export function createEvent(payload: EventCreatePayload) {
  return post<Event>("/events", payload);
}