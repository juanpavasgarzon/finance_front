"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { useCategories, useCreateCategory } from "@/lib/hooks";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Drawer } from "@/components/ui/Drawer";
import { SheetSelect } from "@/components/ui/SheetSelect";
import type { CategoryType } from "@/lib/contracts";

export default function CategoriesPage() {
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [createType, setCreateType] = useState<CategoryType>("EXPENSE");

  const { data: expenseCategories, isLoading: loadingExpense } = useCategories("EXPENSE");
  const { data: incomeCategories, isLoading: loadingIncome } = useCategories("INCOME");
  const createMutation = useCreateCategory();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({ name: name.trim(), type: createType });
      toast.success(t("toast.categoryCreated"));
      setName("");
      setDrawerOpen(false);
    } catch {
      toast.error(t("toast.error"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("categories.title")}</h1>
        <Button onClick={() => setDrawerOpen(true)}>{t("categories.create")}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
        <Card>
          <CardTitle>{t("categories.expenseCategories")}</CardTitle>
          {loadingExpense ? (
            <p className="mt-2 text-muted">{t("common.loading")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {(expenseCategories ?? []).map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2">
                  <span className="text-foreground">{c.name}</span>
                </li>
              ))}
              {(expenseCategories ?? []).length === 0 && (
                <li className="text-muted">—</li>
              )}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>{t("categories.incomeCategories")}</CardTitle>
          {loadingIncome ? (
            <p className="mt-2 text-muted">{t("common.loading")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {(incomeCategories ?? []).map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2">
                  <span className="text-foreground">{c.name}</span>
                </li>
              ))}
              {(incomeCategories ?? []).length === 0 && (
                <li className="text-muted">—</li>
              )}
            </ul>
          )}
        </Card>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t("categories.create")}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label={t("categories.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Supermercado"
          />
          <SheetSelect<CategoryType>
            label={t("categories.type")}
            value={createType}
            onChange={(v) => setCreateType(v)}
            options={[
              { value: "EXPENSE", label: t("categories.expense") },
              { value: "INCOME", label: t("categories.income") },
            ]}
          />
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={createMutation.isPending} disabled={!name.trim()}>
              {t("common.add")}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
