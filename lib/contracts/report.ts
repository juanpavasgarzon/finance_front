export type ReportPeriod = "MONTHLY" | "WEEKLY" | "YEARLY";

export interface DashboardReport {
  period: ReportPeriod;
  date: string;
  totalIncome?: number;
  totalExpenses?: number;
  balance?: number;
  incomes?: Array<{ amount: number; currencyCode: string; description?: string }>;
  expenses?: Array<{ amount: number; currencyCode: string; description?: string }>;
}

export interface DashboardParams {
  period: ReportPeriod;
  date: string;
}
