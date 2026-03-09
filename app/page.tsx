"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/context";
import { useProfile } from "@/lib/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const { t, localePath } = useI18n();
  const { data: profile, isError, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (profile) {
      router.replace(localePath("/dashboard"));
    } else if (isError) {
      router.replace(localePath("/login"));
    }
  }, [profile, isError, isLoading, router, localePath]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted">{t("common.loading")}</p>
    </div>
  );
}
