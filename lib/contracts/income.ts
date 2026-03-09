export interface Income {
  id: string;
  categoryId: string;
  name: string;
  amount: number;
  description: string | null;
  dueDate: string | null;
  paidAt: string | null;
  scheduleId: string | null;
  createdAt: string;
}

export interface CreateIncomeBody {
  categoryId: string;
  name: string;
  amount: number;
  description?: string;
  dueDate?: string;
}
