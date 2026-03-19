import { get } from "../lib/api-client";
import type { Event } from "../types/event";

export function getEvents() {
  return get<Event[]>("/events");
}

export function getEventById(eventId: number) {
  return get<Event>(`/events/${eventId}`);
}