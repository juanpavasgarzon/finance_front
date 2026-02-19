"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/lib/services";
import type { CreateScheduleBody } from "@/lib/contracts";

const keys = { all: ["schedules"] as const };

export function useSchedules() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => scheduleService.list(),
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateScheduleBody) => scheduleService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
