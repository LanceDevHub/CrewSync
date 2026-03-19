import { get, post } from "../lib/api-client";
import type { LoginPayload, RegisterPayload, User } from "../types/user";

export function registerUser(payload: RegisterPayload) {
  return post<User>("/auth/register", payload);
}

export function loginUser(payload: LoginPayload) {
  return post<User>("/auth/login", payload);
}

export function getCurrentUser() {
  return get<User>("/auth/me");
}

export function logoutUser() {
  return post<{ message: string }>("/auth/logout");
}