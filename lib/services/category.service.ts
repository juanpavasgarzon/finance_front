import { apiFetch } from "@/lib/api/client";
import type { Category, CreateCategoryBody } from "@/lib/contracts";
import type { CategoryType } from "@/lib/contracts";

export const categoryService = {
  list(type?: CategoryType): Promise<Category[]> {
    const q = type ? `?type=${type}` : "";
    return apiFetch<Category[]>(`/categories${q}`);
  },

  create(body: CreateCategoryBody): Promise<Category> {
    return apiFetch<Category>("/categories", { method: "POST", body });
  },
};
