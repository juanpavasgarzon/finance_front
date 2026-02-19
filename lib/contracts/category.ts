export type CategoryType = "EXPENSE" | "INCOME";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  createdAt?: string;
}

export interface CreateCategoryBody {
  name: string;
  type: CategoryType;
}
