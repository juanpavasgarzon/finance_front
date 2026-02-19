export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  currencyCode: string;
  description: string;
  dueDate: string;
  paid?: boolean;
  paidAt?: string;
  createdAt?: string;
}

export interface CreateExpenseBody {
  categoryId: string;
  amount: number;
  currencyCode: string;
  description: string;
  dueDate: string;
}
