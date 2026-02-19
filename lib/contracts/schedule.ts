import type { CategoryType } from "./category";

export type RecurrenceUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface Schedule {
  id: string;
  categoryId: string;
  type: CategoryType;
  amount: number;
  currencyCode: string;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: string;
  description: string;
  createdAt?: string;
}

export interface CreateScheduleBody {
  categoryId: string;
  type: CategoryType;
  amount: number;
  currencyCode: string;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: string;
  description: string;
}
