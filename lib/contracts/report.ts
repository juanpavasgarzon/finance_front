export type ReportPeriod = "MONTHLY" | "WEEKLY" | "YEARLY";

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
}

export interface DashboardSummary {
  period: string;
  dateFrom: string;
  dateTo: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface DashboardReport {
  summary: DashboardSummary;
  expensesByCategory: CategoryBreakdown[];
  incomesByCategory: CategoryBreakdown[];
}

export interface DashboardParams {
  period: ReportPeriod;
  date: string;
}
