"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api/client";
import { authService } from "@/lib/services";
import type { LoginBody, RegisterBody } from "@/lib/contracts";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const isAuthenticated = !!token;

  const loginMutation = useMutation({
    mutationFn: (body: LoginBody) => authService.login(body),
    onSuccess: () => {
      queryClient.clear();
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterBody) => authService.register(body),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  function logout() {
    authService.logout();
    queryClient.clear();
    router.push("/login");
  }

  return {
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginMutation,
    register: registerMutation.mutateAsync,
    registerMutation,
    logout,
  };
}
