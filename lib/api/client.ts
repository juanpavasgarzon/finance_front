import type { RequestConfig } from "@/lib/api/types";
import { ensureApiUrl } from "@/lib/env";

export type { HttpMethod, RequestConfig } from "@/lib/api/types";

const COOKIE_NAME = "finance_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1]);
}

export function setToken(token: string): void {
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeToken(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export async function apiFetch<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: customHeaders = {},
    responseType = "json",
  } = config;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const base = ensureApiUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined" && !path.includes("/auth/login")) {
      removeToken();
      window.location.href = "/login";
    }

    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    let parsed: unknown;

    try {
      parsed = await res.json();
    } catch {
      parsed = await res.text();
    }

    throw new ApiError(
      (parsed as { message?: string })?.message ?? res.statusText,
      res.status,
      parsed
    );
  }

  if (res.status === 204) {
    return Promise.resolve(undefined as T);
  }

  if (responseType === "blob") {
    return res.blob() as Promise<T>;
  }

  if (res.headers.get("content-type")?.includes("application/json")) {
    return res.json();
  }

  return res.text() as Promise<T>;
}
