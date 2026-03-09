"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/services";
import { useI18n } from "@/lib/i18n/context";
import type { LoginBody, RegisterBody, UserPreferences } from "@/lib/contracts";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { localePath } = useI18n();

  const loginMutation = useMutation({
    mutationFn: (body: LoginBody) => authService.login(body),
    onSuccess: () => {
      queryClient.clear();
      router.push(localePath("/dashboard"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterBody) => authService.register(body),
    onSuccess: () => {
      queryClient.clear();
      router.push(localePath("/login"));
    },
  });

  async function logout() {
    await authService.logout();
    queryClient.clear();
    router.push(localePath("/login"));
  }

  return {
    login: loginMutation.mutateAsync,
    loginMutation,
    register: registerMutation.mutateAsync,
    registerMutation,
    logout,
  };
}

export function useProfile() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<UserPreferences>) => authService.updatePreferences(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
      const previous = queryClient.getQueryData<{ preferences: UserPreferences }>(["auth", "me"]);

      if (previous) {
        queryClient.setQueryData(["auth", "me"], {
          ...previous,
          preferences: { ...previous.preferences, ...body },
        });
      }

      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["auth", "me"], context.previous);
      }
    },
  });
}
