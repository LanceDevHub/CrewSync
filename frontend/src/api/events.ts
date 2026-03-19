import { del, get, post, patch } from "../lib/api-client";
import type { Event, EventCreatePayload, EventUpdatePayload } from "../types/event";

export function getEvents() {
  return get<Event[]>("/events");
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