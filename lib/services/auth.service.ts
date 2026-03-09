import { apiFetch, setToken } from "@/lib/api/client";
import type { LoginBody, RegisterBody, UserPreferences, UserProfile } from "@/lib/contracts";

export const authService = {
  async register(body: RegisterBody): Promise<{ id: string; username: string }> {
    return apiFetch<{ id: string; username: string }>("/auth/register", {
      method: "POST",
      body,
    });
  },

  async login(body: LoginBody): Promise<void> {
    const result = await apiFetch<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body,
    });

    setToken(result.accessToken);
  },

  me(): Promise<UserProfile> {
    return apiFetch<UserProfile>("/auth/me");
  },

  updatePreferences(body: Partial<UserPreferences>): Promise<UserPreferences> {
    return apiFetch<UserPreferences>("/auth/preferences", { method: "PATCH", body });
  },
};
