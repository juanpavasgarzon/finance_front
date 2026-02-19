"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { useSchedules, useCreateSchedule } from "@/lib/hooks";
import { useCategories } from "@/lib/hooks/use-categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Drawer } from "@/components/ui/Drawer";
import { SheetSelect } from "@/components/ui/SheetSelect";
import type { CategoryType } from "@/lib/contracts";
import type { RecurrenceUnit } from "@/lib/contracts";

const UNITS: RecurrenceUnit[] = ["DAY", "WEEK", "MONTH", "YEAR"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString();
}

export default function SchedulesPage() {
  const { t } = useI18n();
  const { data: schedules, isLoading } = useSchedules();
  const { data: expenseCategories } = useCategories("EXPENSE");
  const { data: incomeCategories } = useCategories("INCOME");
  const createMutation = useCreateSchedule();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyCode, setCurrencyCode] = useState("COP");
  const [recurrenceInterval, setRecurrenceInterval] = useState("1");
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>("MONTH");
  const [nextDueDate, setNextDueDate] = useState("");
  const [description, setDescription] = useState("");

  const categories = type === "EXPENSE" ? expenseCategories ?? [] : incomeCategories ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount || !nextDueDate) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        categoryId,
        type,
        amount: Number(amount),
        currencyCode,
        recurrenceInterval: Number(recurrenceInterval) || 1,
        recurrenceUnit,
        nextDueDate,
        description,
      });
      toast.success(t("toast.scheduleCreated"));
      setAmount("");
      setDescription("");
      setNextDueDate("");
      setDrawerOpen(false);
    } catch {
      toast.error(t("toast.error"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("schedules.title")}</h1>
        <Button onClick={() => setDrawerOpen(true)}>{t("schedules.create")}</Button>
      </div>

      {isLoading ? (
        <p className="text-muted">{t("common.loading")}</p>
      ) : (
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[500px] border-collapse border border-border">
            <thead>
              <tr className="bg-card">
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("schedules.description")}</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("schedules.amount")}</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium hidden sm:table-cell">Recurrence</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("schedules.nextDueDate")}</th>
              </tr>
            </thead>
            <tbody>
              {(schedules ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="border border-border px-3 py-2">{s.description}</td>
                  <td className="border border-border px-3 py-2">{s.amount} {s.currencyCode}</td>
                  <td className="border border-border px-3 py-2 hidden sm:table-cell">Every {s.recurrenceInterval} {s.recurrenceUnit}</td>
                  <td className="border border-border px-3 py-2">{formatDate(s.nextDueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(schedules ?? []).length === 0 && (
            <p className="py-6 text-center text-muted">No schedules yet.</p>
          )}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t("schedules.create")}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <SheetSelect<CategoryType>
            label={t("categories.type")}
            value={type}
            onChange={(v) => {
              setType(v);
              setCategoryId("");
            }}
            options={[
              { value: "EXPENSE", label: t("categories.expense") },
              { value: "INCOME", label: t("categories.income") },
            ]}
          />
          <SheetSelect
            label="Category"
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            emptyOption
            placeholder="—"
          />
          <Input label={t("schedules.amount")} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <SheetSelect
            label={t("schedules.currency")}
            value={currencyCode}
            onChange={setCurrencyCode}
            options={[
              { value: "COP", label: "COP" },
              { value: "USD", label: "USD" },
            ]}
          />
          <Input label={t("schedules.nextDueDate")} type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} required />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label={t("schedules.interval")}
              type="number"
              min={1}
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(e.target.value)}
            />
            <SheetSelect<RecurrenceUnit>
              label="Unit"
              value={recurrenceUnit}
              onChange={setRecurrenceUnit}
              options={UNITS.map((u) => ({ value: u, label: u }))}
            />
          </div>
          <Input label={t("schedules.description")} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={createMutation.isPending} disabled={!categoryId || !amount || !nextDueDate}>
              {t("common.add")}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
