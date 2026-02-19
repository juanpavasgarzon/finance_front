"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incomeService } from "@/lib/services";
import type { CreateIncomeBody } from "@/lib/contracts";

const keys = { all: ["incomes"] as const, one: (id: string) => ["incomes", id] as const };

export function useIncomes() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => incomeService.list(),
  });
}

export function useIncome(id: string | null) {
  return useQuery({
    queryKey: keys.one(id ?? ""),
    queryFn: () => incomeService.get(id!),
    enabled: !!id,
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateIncomeBody) => incomeService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useMarkIncomePaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeService.markPaid(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}
