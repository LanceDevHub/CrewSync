const API_BASE_URL = "http://localhost:8000";

function extractErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }

  return fallback;
}

export async function unlockSiteAccess(password: string) {
  const response = await fetch(`${API_BASE_URL}/site-access/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, "Masterpasswort konnte nicht geprüft werden.")
    );
  }

  return data as { message: string };
}

export async function lockSiteAccess() {
  const response = await fetch(`${API_BASE_URL}/site-access/lock`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, "Site access konnte nicht entfernt werden.")
    );
  }

  return data as { message: string };
}

export async function getSiteAccessStatus() {
  const response = await fetch(`${API_BASE_URL}/site-access/status`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, "Site access Status konnte nicht geladen werden.")
    );
  }

  return data as { has_access: boolean };
}