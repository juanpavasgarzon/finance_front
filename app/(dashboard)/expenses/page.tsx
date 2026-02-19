"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { useExpenses, useCreateExpense, useMarkExpensePaid } from "@/lib/hooks";
import { useCategories } from "@/lib/hooks/use-categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Drawer } from "@/components/ui/Drawer";
import { SheetSelect } from "@/components/ui/SheetSelect";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString();
}

function formatMoney(amount: number, currency = "COP") {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(amount);
}

export default function ExpensesPage() {
  const { t } = useI18n();
  const { data: expenses, isLoading } = useExpenses();
  const { data: categories } = useCategories("EXPENSE");
  const createMutation = useCreateExpense();
  const markPaidMutation = useMarkExpensePaid();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const currencyCode = "COP";
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [markPaidId, setMarkPaidId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount || !dueDate) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        categoryId,
        amount: Number(amount),
        currencyCode,
        description,
        dueDate,
      });
      toast.success(t("toast.expenseCreated"));
      setCategoryId("");
      setAmount("");
      setDescription("");
      setDueDate("");
      setDrawerOpen(false);
    } catch {
      toast.error(t("toast.error"));
    }
  }

  function handleMarkPaidConfirm() {
    if (markPaidId) {
      markPaidMutation.mutate(markPaidId, {
        onSuccess: () => toast.success(t("toast.markedPaid")),
        onError: () => toast.error(t("toast.error")),
      });
      setMarkPaidId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("expenses.title")}</h1>
        <Button onClick={() => setDrawerOpen(true)}>{t("expenses.create")}</Button>
      </div>

      {isLoading ? (
        <p className="text-muted">{t("common.loading")}</p>
      ) : (
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[500px] border-collapse border border-border">
            <thead>
              <tr className="bg-card">
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("schedules.description")}</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("expenses.amount")}</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium">{t("expenses.dueDate")}</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium hidden sm:table-cell">Status</th>
                <th className="border border-border px-3 py-2 text-left text-sm font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {(expenses ?? []).map((e) => (
                <tr key={e.id}>
                  <td className="border border-border px-3 py-2">{e.description || "—"}</td>
                  <td className="border border-border px-3 py-2">{formatMoney(e.amount, e.currencyCode)}</td>
                  <td className="border border-border px-3 py-2">{formatDate(e.dueDate)}</td>
                  <td className="border border-border px-3 py-2 hidden sm:table-cell">{e.paid ? t("expenses.paid") : t("expenses.unpaid")}</td>
                  <td className="border border-border px-3 py-2">
                    {!e.paid && (
                      <Button
                        variant="ghost"
                        className="text-sm"
                        onClick={() => setMarkPaidId(e.id)}
                        disabled={markPaidMutation.isPending}
                      >
                        {t("expenses.markPaid")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(expenses ?? []).length === 0 && (
            <p className="py-6 text-center text-muted">No expenses yet.</p>
          )}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t("expenses.create")}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <SheetSelect
            label="Category"
            value={categoryId}
            onChange={setCategoryId}
            options={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
            emptyOption
            placeholder="—"
          />
          <Input label={t("expenses.amount")} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Input label={t("expenses.dueDate")} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          <Input label={t("schedules.description")} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={createMutation.isPending} disabled={!categoryId || !amount || !dueDate}>
              {t("common.add")}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={markPaidId !== null}
        onClose={() => setMarkPaidId(null)}
        onConfirm={handleMarkPaidConfirm}
        title={t("confirm.markPaidTitle")}
        message={t("confirm.markPaidMessage")}
        loading={markPaidMutation.isPending}
      />
    </div>
  );
}
