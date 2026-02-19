function readEnv(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }

  return trimmed;
}

export const appEnv = {
  apiBaseUrl: readEnv(
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : ""
  ).replace(/\/$/, ""),
} as const;

export function ensureApiUrl(): string {
  const url = appEnv.apiBaseUrl;
  if (!url || !url.trim()) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to .env or .env.local and restart the dev server (e.g. NEXT_PUBLIC_API_URL=http://localhost:3001/api)."
    );
  }

  return url.replace(/\/$/, "");
}
