import { apiFetch } from "@/lib/api/client";
import type { CreateScheduleBody, Schedule } from "@/lib/contracts";

export const scheduleService = {
  list(): Promise<Schedule[]> {
    return apiFetch<Schedule[]>("/schedules");
  },

  create(body: CreateScheduleBody): Promise<Schedule> {
    return apiFetch<Schedule>("/schedules", { method: "POST", body });
  },
};
