import { apiFetch } from "@/lib/api/client";
import type { CreateExpenseBody, Expense } from "@/lib/contracts";

export const expenseService = {
  list(): Promise<Expense[]> {
    return apiFetch<Expense[]>("/expenses");
  },

  get(id: string): Promise<Expense> {
    return apiFetch<Expense>(`/expenses/${id}`);
  },

  create(body: CreateExpenseBody): Promise<Expense> {
    return apiFetch<Expense>("/expenses", { method: "POST", body });
  },

  markPaid(id: string): Promise<Expense> {
    return apiFetch<Expense>(`/expenses/${id}/paid`, { method: "PATCH" });
  },
};
