const API_BASE_URL = "http://127.0.0.1:8000";

type RequestOptions = RequestInit & {
  body?: unknown;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    body:
      options.body !== undefined
        ? isFormData
          ? (options.body as BodyInit)
          : JSON.stringify(options.body)
        : undefined,
  });

  if (!response.ok) {
    let errorMessage = "An unexpected error occurred.";

    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // ignore non-json errors
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function get<T>(endpoint: string) {
  return apiFetch<T>(endpoint, { method: "GET" });
}

export function post<T>(endpoint: string, body?: RequestOptions["body"]) {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body,
  });
}

export function patch<T>(endpoint: string, body?: RequestOptions["body"]) {
  return apiFetch<T>(endpoint, {
    method: "PATCH",
    body,
  });
}

export function del<T>(endpoint: string) {
  return apiFetch<T>(endpoint, {
    method: "DELETE",
  });
}