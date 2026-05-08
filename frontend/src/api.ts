/** Typed client for the backend /ping endpoint. */

export interface PingSuccess {
  echo: string;
  timestamp: number;
  env: "development" | "production";
  version: string;
}

/** `status` is the HTTP code, or `null` when no response was received. */
export type PingOutcome =
  | { kind: "success"; status: number; data: PingSuccess }
  | { kind: "error"; status: number | null; message: string };

const API_BASE_URL = "http://localhost:8000";

/** Never throws; all error conditions are surfaced as `PingOutcome` values. */
export async function ping(message: string): Promise<PingOutcome> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    // err.message here is browser-specific jargon ("Failed to fetch" /
    // "Load failed") — log the raw error and surface a clearer message.
    // eslint-disable-next-line no-console
    console.error("Network request failed:", err);
    const offline =
      typeof navigator !== "undefined" && navigator.onLine === false;
    return {
      kind: "error",
      status: null,
      message: offline
        ? "You appear to be offline. Check your internet connection and try again."
        : "Couldn't reach the server. Make sure the backend is running at http://localhost:8000 and try again.",
    };
  }

  // Both success and error responses are JSON, so parse before branching.
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body — handled by the status checks below.
  }

  if (!response.ok) {
    return {
      kind: "error",
      status: response.status,
      message:
        isErrorBody(body) && body.error
          ? body.error
          : "The server returned an error.",
    };
  }

  if (!isPingSuccess(body)) {
    return {
      kind: "error",
      status: response.status,
      message: "Server returned an unexpected response shape.",
    };
  }

  return { kind: "success", status: response.status, data: body };
}

function isErrorBody(value: unknown): value is { error: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error: unknown }).error === "string"
  );
}

function isPingSuccess(value: unknown): value is PingSuccess {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.echo === "string" &&
    typeof v.timestamp === "number" &&
    (v.env === "development" || v.env === "production") &&
    typeof v.version === "string"
  );
}
