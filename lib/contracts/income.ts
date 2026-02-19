export interface Income {
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

export interface CreateIncomeBody {
  categoryId: string;
  amount: number;
  currencyCode: string;
  description: string;
  dueDate: string;
}
