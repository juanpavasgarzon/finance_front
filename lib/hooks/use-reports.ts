"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/lib/services";
import type { ReportPeriod } from "@/lib/contracts";

export function useDashboard(period: ReportPeriod, date: string) {
  return useQuery({
    queryKey: ["reports", "dashboard", period, date],
    queryFn: () => reportService.dashboard({ period, date }),
    enabled: !!date,
  });
}
