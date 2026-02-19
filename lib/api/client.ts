import type { RequestConfig } from "@/lib/api/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export type { HttpMethod, RequestConfig } from "@/lib/api/types";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("finance_token", token);
    } else {
      window.localStorage.removeItem("finance_token");
    }
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined" && !authToken) {
    authToken = window.localStorage.getItem("finance_token");
  }

  return authToken;
}

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

export async function apiFetch<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token = getAuthToken(),
    headers: customHeaders = {},
    responseType = "json",
  } = config;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    setAuthToken(null);
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
