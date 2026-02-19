import { apiFetch, setAuthToken } from "@/lib/api/client";
import type { AuthResponse, LoginBody, RegisterBody } from "@/lib/contracts";

export const authService = {
  async register(body: RegisterBody): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body,
      token: null,
    });
    return res;
  },

  async login(body: LoginBody): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body,
      token: null,
    });
    if (res.accessToken) {
      setAuthToken(res.accessToken);
    }

    return res;
  },

  logout() {
    setAuthToken(null);
  },
};
