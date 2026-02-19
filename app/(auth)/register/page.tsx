"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/client";

export default function RegisterPage() {
  const { t } = useI18n();
  const { registerMutation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await registerMutation.mutateAsync({ email, password });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t("auth.registerTitle")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t("auth.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label={t("auth.password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <Button type="submit" loading={registerMutation.isPending}>
          {t("auth.register")}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("auth.login")}
        </Link>
      </p>
    </div>
  );
}
