const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_PREFIX = "/api/v1";

interface ApiFetchOptions extends RequestInit {
  /** Skip automatic JSON parsing of the response. */
  raw?: boolean;
}

/**
 * Thin wrapper around `fetch` that targets the Ganado REST API.
 *
 * - Prefixes every path with `/api/v1`
 * - Attaches the stored JWT as a Bearer token
 * - Returns the parsed JSON body (or raw `Response` when `raw: true`)
 * - On 401 clears auth tokens and redirects to `/login`
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { raw, ...fetchOptions } = options;

  const url = `${BASE_URL}${API_PREFIX}${path}`;

  const headers = new Headers(fetchOptions.headers);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ganado_access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ganado_access_token");
      localStorage.removeItem("ganado_refresh_token");
      localStorage.removeItem("ganado_user");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let message: string;
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.detail || parsed.message || errorBody;
    } catch {
      message = errorBody;
    }
    throw new ApiError(message, response.status);
  }

  if (raw) {
    return response as unknown as T;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
