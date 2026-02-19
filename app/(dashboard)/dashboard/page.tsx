"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDashboard } from "@/lib/hooks/use-reports";
import { reportService } from "@/lib/services";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ReportPeriod } from "@/lib/contracts";

const PERIODS: ReportPeriod[] = ["WEEKLY", "MONTHLY", "YEARLY"];

function formatMoney(amount: number, currency = "COP") {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(amount);
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<ReportPeriod>("MONTHLY");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const { data, isLoading, error } = useDashboard(period, date);

  const totalIncome = data?.totalIncome ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const balance = totalIncome - totalExpenses;

  const downloadExcel = async () => {
    const blob = await reportService.downloadExcel(period, date);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-${period}-${date}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--danger)] bg-[var(--danger)]/10 p-4 text-[var(--danger)]">
        {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("dashboard.title")}</h1>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
        >
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
        />
        <Button variant="secondary" onClick={downloadExcel}>
          {t("dashboard.downloadExcel")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
        <Card>
          <CardTitle>{t("dashboard.totalIncome")}</CardTitle>
          <p className="mt-2 text-2xl font-bold text-[var(--success)]">
            {formatMoney(totalIncome)}
          </p>
        </Card>
        <Card>
          <CardTitle>{t("dashboard.totalExpenses")}</CardTitle>
          <p className="mt-2 text-2xl font-bold text-[var(--danger)]">
            {formatMoney(totalExpenses)}
          </p>
        </Card>
        <Card>
          <CardTitle>{t("dashboard.balance")}</CardTitle>
          <p className={`mt-2 text-2xl font-bold ${balance >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {formatMoney(balance)}
          </p>
        </Card>
      </div>
    </div>
  );
}
