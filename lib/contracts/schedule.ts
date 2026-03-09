import type { CategoryType } from "./category";

export type RecurrenceUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface Schedule {
  id: string;
  categoryId: string;
  type: CategoryType;
  name: string;
  amount: number;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  createdAt: string;
}

export interface CreateScheduleBody {
  categoryId: string;
  type: CategoryType;
  name: string;
  amount: number;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  nextDueDate: string;
  startDate: string;
  endDate?: string;
  description?: string;
}
