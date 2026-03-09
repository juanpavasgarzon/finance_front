"use client";

import { useState, useMemo } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { InfoPopover } from "@/components/ui/InfoPopover";
import { useI18n } from "@/lib/i18n/context";
import { useDashboard } from "@/lib/hooks/use-reports";
import { usePlannerData } from "@/lib/hooks";
import { reportService } from "@/lib/services";
import type { ReportPeriod } from "@/lib/contracts";
import type { PayrollConfig } from "@/lib/contracts/payroll";
import { DEFAULT_PAYROLL_CONFIG, calculatePayroll } from "@/lib/utils/payroll";
import { formatCurrency } from "@/lib/utils/format";
import { useTheme } from "@/lib/theme/context";

const PERIODS: ReportPeriod[] = ["WEEKLY", "MONTHLY", "YEARLY"];

const PIE_COLORS = ["#4F46E5", "#818CF8", "#A78BFA", "#C4B5FD", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#F97316", "#8B5CF6"];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { theme: appTheme } = useTheme();
  const [period, setPeriod] = useState<ReportPeriod>("MONTHLY");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const { data, isLoading, error } = useDashboard(period, date);
  const { data: plannerData } = usePlannerData();

  const totalIncome = data?.summary?.totalIncome ?? 0;
  const totalExpenses = data?.summary?.totalExpenses ?? 0;
  const balance = totalIncome - totalExpenses;

  const serverConfig = plannerData?.payrollConfig as unknown as Partial<PayrollConfig> | undefined;
  const config: PayrollConfig = { ...DEFAULT_PAYROLL_CONFIG, ...(serverConfig ?? {}) };

  if (serverConfig?.egresosFijos) {
    config.egresosFijos = serverConfig.egresosFijos;
  }

  const payroll = calculatePayroll(config);
  const plannerExpenses = config.egresosFijos.reduce((sum, e) => sum + (e.monto || 0), 0);

  const expensePieData = useMemo(() => {
    if (!data?.expensesByCategory) {
      return [];
    }

    return data.expensesByCategory.map((item) => ({
      name: item.categoryName,
      value: item.total,
    }));
  }, [data?.expensesByCategory]);

  const incomePieData = useMemo(() => {
    if (!data?.incomesByCategory) {
      return [];
    }

    return data.incomesByCategory.map((item) => ({
      name: item.categoryName,
      value: item.total,
    }));
  }, [data?.incomesByCategory]);

  const barData = useMemo(() => {
    if (!data?.summary) {
      return [];
    }

    return [
      { name: t("dashboard.totalIncome"), value: totalIncome, fill: "#10B981" },
      { name: t("dashboard.totalExpenses"), value: totalExpenses, fill: "#EF4444" },
      { name: t("dashboard.balance"), value: balance, fill: "#4F46E5" },
    ];
  }, [data?.summary, totalIncome, totalExpenses, balance, t]);

  const textColor = appTheme === "dark" ? "#E2E8F0" : "#1E293B";
  const gridColor = appTheme === "dark" ? "#1E3055" : "#E2E8F0";

  const downloadExcel = async () => {
    const blob = await reportService.downloadExcel(period, date);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-${period}-${date}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" fontWeight={700}>{t("dashboard.title")}</Typography>
        <InfoPopover text={t("info.dashboard")} />
      </Box>

      {payroll && (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {[
            { label: t("planner.biweeklyNet"), value: payroll.netoQ },
            { label: t("planner.monthlyNet"), value: payroll.netoM },
            { label: t("planner.availableMonth"), value: payroll.netoM - plannerExpenses },
          ].map((item) => (
            <Paper
              key={item.label}
              variant="outlined"
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 160 }, p: 2, textAlign: "center" }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.65rem" }}>
                {item.label}
              </Typography>

              <Typography variant="h6" sx={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: 800, color: "primary.main" }}>
                {formatCurrency(item.value)}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <Divider />

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
        <TextField
          select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
          sx={{ minWidth: { xs: "calc(50% - 6px)", sm: 140 } }}
        >
          {PERIODS.map((p) => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          size="small"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: { xs: "calc(50% - 6px)", sm: "auto" } }}
        />

        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadExcel} size="small">
          {t("dashboard.downloadExcel")}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : error ? (
        <Alert severity="error">{(error as Error).message}</Alert>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <TrendingUpIcon sx={{ color: "success.main" }} />
                    <Typography variant="body2" color="text.secondary">{t("dashboard.totalIncome")}</Typography>
                  </Box>

                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {formatMoney(totalIncome)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <TrendingDownIcon sx={{ color: "error.main" }} />
                    <Typography variant="body2" color="text.secondary">{t("dashboard.totalExpenses")}</Typography>
                  </Box>

                  <Typography variant="h5" fontWeight={700} color="error.main">
                    {formatMoney(totalExpenses)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <AccountBalanceWalletIcon sx={{ color: "primary.main" }} />
                    <Typography variant="body2" color="text.secondary">{t("dashboard.balance")}</Typography>
                  </Box>

                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {formatMoney(balance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", minHeight: 320 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                    {t("dashboard.overview")}
                  </Typography>

                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis type="number" tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v) => formatMoney(v)} />
                        <YAxis type="category" dataKey="name" tick={{ fill: textColor, fontSize: 11 }} width={100} />
                        <RTooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ backgroundColor: appTheme === "dark" ? "#152035" : "#fff", borderColor: gridColor }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                          {barData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                      {t("common.noData")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", minHeight: 320 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                    {t("dashboard.expensesByCategory")}
                  </Typography>

                  {expensePieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={expensePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            innerRadius={35}
                          >
                            {expensePieData.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RTooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ backgroundColor: appTheme === "dark" ? "#152035" : "#fff", borderColor: gridColor }} />
                        </PieChart>
                      </ResponsiveContainer>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {expensePieData.map((item, idx) => (
                          <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                            <Typography variant="caption" color="text.secondary">{item.name}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                      {t("common.noData")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", minHeight: 320 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                    {t("dashboard.incomesByCategory")}
                  </Typography>

                  {incomePieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={incomePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            innerRadius={35}
                          >
                            {incomePieData.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RTooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ backgroundColor: appTheme === "dark" ? "#152035" : "#fff", borderColor: gridColor }} />
                        </PieChart>
                      </ResponsiveContainer>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {incomePieData.map((item, idx) => (
                          <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                            <Typography variant="caption" color="text.secondary">{item.name}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                      {t("common.noData")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
