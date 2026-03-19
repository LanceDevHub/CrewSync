import { get } from "../lib/api-client";
import type { Event } from "../types/event";

export function getMyCreatedEvents() {
  return get<Event[]>("/users/me/events-created");
}

export function getMyJoinedEvents() {
  return get<Event[]>("/users/me/events-joined");
}