"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { plannerService } from "@/lib/services";
import type { UpsertPlannerBody } from "@/lib/contracts";

const keys = { all: ["planner"] as const };

export function usePlannerData() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => plannerService.get(),
  });
}

export function useSavePlanner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: UpsertPlannerBody) => plannerService.save(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useSyncPlanner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => plannerService.sync(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
}
