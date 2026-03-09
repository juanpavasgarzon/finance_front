import { apiFetch } from "@/lib/api/client";
import type { PlannerData, SyncPlannerResult, UpsertPlannerBody } from "@/lib/contracts";

export const plannerService = {
  get(): Promise<PlannerData> {
    return apiFetch<PlannerData>("/planner");
  },

  save(body: UpsertPlannerBody): Promise<PlannerData> {
    return apiFetch<PlannerData>("/planner", { method: "PUT", body });
  },

  sync(): Promise<SyncPlannerResult> {
    return apiFetch<SyncPlannerResult>("/planner/sync", { method: "POST" });
  },
};
