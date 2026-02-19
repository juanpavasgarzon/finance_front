import { apiFetch } from "@/lib/api/client";
import type { DashboardParams, DashboardReport } from "@/lib/contracts";

export const reportService = {
  dashboard(params: DashboardParams): Promise<DashboardReport> {
    const q = new URLSearchParams({
      period: params.period,
      date: params.date,
    }).toString();
    return apiFetch<DashboardReport>(`/reports/dashboard?${q}`);
  },

  async downloadExcel(period: string, date: string): Promise<Blob> {
    const q = new URLSearchParams({ period, date }).toString();
    return apiFetch<Blob>(`/reports/financial/excel?${q}`, {
      responseType: "blob",
    });
  },
};
