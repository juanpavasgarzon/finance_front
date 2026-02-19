import { apiFetch } from "@/lib/api/client";
import type { CreateIncomeBody, Income } from "@/lib/contracts";

export const incomeService = {
  list(): Promise<Income[]> {
    return apiFetch<Income[]>("/incomes");
  },

  get(id: string): Promise<Income> {
    return apiFetch<Income>(`/incomes/${id}`);
  },

  create(body: CreateIncomeBody): Promise<Income> {
    return apiFetch<Income>("/incomes", { method: "POST", body });
  },

  markPaid(id: string): Promise<Income> {
    return apiFetch<Income>(`/incomes/${id}/paid`, { method: "PATCH" });
  },
};
