import { get, patch, post } from "../lib/api-client";
import type { Event } from "../types/event";
import type { User } from "../types/user";

export function getMyCreatedEvents() {
  return get<Event[]>("/users/me/events-created");
}

export function getMyJoinedEvents() {
  return get<Event[]>("/users/me/events-joined");
}

export function updateMyUsername(username: string) {
  return patch<User>("/users/me", {
    username,
  });
}

export function changeMyPassword(
  currentPassword: string,
  newPassword: string,
) {
  return post<{ message: string }>("/users/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}