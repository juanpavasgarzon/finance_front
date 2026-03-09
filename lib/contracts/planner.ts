export interface PlannerData {
  payrollConfig: Record<string, unknown>;
  fixedExpenses: Array<Record<string, unknown>>;
  extraIncomes: Array<Record<string, unknown>>;
}

export interface UpsertPlannerBody {
  payrollConfig: Record<string, unknown>;
  fixedExpenses: Array<Record<string, unknown>>;
  extraIncomes: Array<Record<string, unknown>>;
}

export interface SyncPlannerResult {
  categoriesCreated: number;
  expensesCreated: number;
  incomesCreated: number;
}
