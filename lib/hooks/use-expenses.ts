"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/lib/services";
import type { CreateExpenseBody } from "@/lib/contracts";

const keys = { all: ["expenses"] as const, one: (id: string) => ["expenses", id] as const };

export function useExpenses() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => expenseService.list(),
  });
}

export function useExpense(id: string | null) {
  return useQuery({
    queryKey: keys.one(id ?? ""),
    queryFn: () => expenseService.get(id!),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateExpenseBody) => expenseService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useMarkExpensePaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.markPaid(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}
