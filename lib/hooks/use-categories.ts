"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/services";
import type { CategoryType } from "@/lib/contracts";
import type { CreateCategoryBody } from "@/lib/contracts";

const keys = {
  all: ["categories"] as const,
  list: (type?: CategoryType) => [...keys.all, type] as const,
};

export function useCategories(type?: CategoryType) {
  return useQuery({
    queryKey: keys.list(type),
    queryFn: () => categoryService.list(type),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryBody) => categoryService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
