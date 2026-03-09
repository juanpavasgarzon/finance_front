"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import type { PayrollConfig, ExtraIncome } from "@/lib/contracts/payroll";
import { DEFAULT_PAYROLL_CONFIG, calculatePayroll, buildMonthlyProjections } from "@/lib/utils/payroll";
import { formatCurrency } from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n/context";
import { useExpenses, useIncomes, usePlannerData } from "@/lib/hooks";
import { SummaryTab } from "@/components/planner/SummaryTab";
import { InfoPopover } from "@/components/ui/InfoPopover";
import { exportToExcel } from "@/lib/utils/excel-export";
import { filterByPeriod } from "@/lib/utils/filter-by-period";
import type { TimePeriod } from "@/lib/utils/filter-by-period";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: { xs: "100%", sm: 160 } }}>
      <CardContent sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ mb: 0.5 }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.6rem" }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={800} sx={{ fontFamily: "var(--font-geist-mono), monospace", color }}>
          {formatCurrency(value)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SummaryPage() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [refDate, setRefDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: expenses } = useExpenses();
  const { data: incomes } = useIncomes();
  const { data: plannerData } = usePlannerData();

  const serverConfig = plannerData?.payrollConfig as unknown as Partial<PayrollConfig> | undefined;
  const config: PayrollConfig = { ...DEFAULT_PAYROLL_CONFIG, ...(serverConfig ?? {}) };

  if (serverConfig?.egresosFijos) {
    config.egresosFijos = serverConfig.egresosFijos;
  }

  const extras = (plannerData?.extraIncomes ?? []) as unknown as Array<ExtraIncome>;

  const payroll = calculatePayroll(config);
  const totalFixedExpenses = config.egresosFijos.reduce((sum, e) => sum + (e.monto || 0), 0);
  const projections = buildMonthlyProjections(payroll, totalFixedExpenses, extras, year);

  const annualBalance = projections.reduce((sum, m) => sum + m.balance, 0);
  const annualIncome = projections.reduce((sum, m) => sum + m.ingTotal, 0);
  const annualExpenses = projections.reduce((sum, m) => sum + m.egFijos, 0);

  const realData = useMemo(() => {
    const ref = new Date(refDate);
    const filteredIncomes = filterByPeriod(incomes ?? [], period, ref);
    const filteredExpenses = filterByPeriod(expenses ?? [], period, ref);

    const totalInc = filteredIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExp = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const paidInc = filteredIncomes.filter((i) => !!i.paidAt).reduce((sum, i) => sum + Number(i.amount), 0);
    const paidExp = filteredExpenses.filter((e) => !!e.paidAt).reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      balance: totalInc - totalExp,
      paidIncome: paidInc,
      paidExpenses: paidExp,
      pendingIncome: totalInc - paidInc,
      pendingExpenses: totalExp - paidExp,
    };
  }, [incomes, expenses, period, refDate]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  async function handleExportSummary() {
    await exportToExcel([{
      name: t("summary.title"),
      title: `${t("summary.title")} ${year}`,
      subtitle: `${t("summary.period")}: ${t(`summary.${period}`)} — ${refDate}`,
      columns: [
        { header: t("planner.monthHeader"), key: "mes", width: 12 },
        { header: t("planner.payroll"), key: "netoNomina", width: 18, isCurrency: true },
        { header: t("planner.extras"), key: "tExtras", width: 18, isCurrency: true },
        { header: t("planner.income"), key: "ingTotal", width: 18, isCurrency: true },
        { header: t("planner.expensesHeader"), key: "egFijos", width: 18, isCurrency: true },
        { header: t("planner.balanceHeader"), key: "balance", width: 18, isCurrency: true },
        { header: t("planner.accumulated"), key: "acum", width: 18, isCurrency: true },
      ],
      rows: projections.map((m) => ({
        mes: m.mes,
        netoNomina: m.netoNomina,
        tExtras: m.tExtras,
        ingTotal: m.ingTotal,
        egFijos: m.egFijos,
        balance: m.balance,
        acum: m.acum,
      })),
    }], `summary-${year}.xlsx`);
  }

  async function handleExportExtras() {
    await exportToExcel([{
      name: t("planner.extras"),
      title: t("planner.history"),
      columns: [
        { header: t("planner.date"), key: "fecha", width: 14 },
        { header: t("planner.source"), key: "fuente", width: 30 },
        { header: t("planner.amount"), key: "monto", width: 18, isCurrency: true },
      ],
      rows: extras.map((e) => ({
        fecha: e.fecha,
        fuente: e.fuente,
        monto: e.monto,
      })),
    }], `extras-${year}.xlsx`);
  }

  async function handleExportFixedExpenses() {
    await exportToExcel([{
      name: t("planner.fixedExpenses"),
      title: t("planner.fixedExpensesTitle"),
      columns: [
        { header: t("planner.concept"), key: "nombre", width: 30 },
        { header: t("planner.amount"), key: "monto", width: 18, isCurrency: true },
        { header: "Q", key: "quincena", width: 8 },
      ],
      rows: config.egresosFijos.map((e) => ({
        nombre: e.nombre,
        monto: e.monto,
        quincena: e.quincena,
      })),
    }], `fixed-expenses.xlsx`);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {period === "daily" && t("summary.titleDaily")}
          {period === "monthly" && t("summary.titleMonthly")}
          {period === "yearly" && t("summary.titleYearly")}
          {period === "all" && t("summary.titleAll")}
        </Typography>
        <InfoPopover text={t("info.summary")} />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
        <TextField
          select
          size="small"
          label={t("summary.period")}
          value={period}
          onChange={(e) => setPeriod(e.target.value as TimePeriod)}
          sx={{ minWidth: { xs: "calc(50% - 6px)", sm: 120 } }}
        >
          <MenuItem value="daily">{t("summary.daily")}</MenuItem>
          <MenuItem value="monthly">{t("summary.monthly")}</MenuItem>
          <MenuItem value="yearly">{t("summary.yearly")}</MenuItem>
          <MenuItem value="all">{t("summary.all")}</MenuItem>
        </TextField>

        <TextField
          type="date"
          size="small"
          value={refDate}
          onChange={(e) => setRefDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: { xs: "calc(50% - 6px)", sm: "auto" } }}
        />

        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

        <TextField
          select
          size="small"
          label={t("summary.year")}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ minWidth: { xs: "calc(50% - 6px)", sm: 100 } }}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportSummary}>
            Excel
          </Button>

          <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportExtras}>
            {t("planner.extras")}
          </Button>

          <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportFixedExpenses}>
            {t("planner.fixedExpenses")}
          </Button>
        </Box>
      </Box>

      <Typography variant="subtitle2" fontWeight={700}>{t("summary.realData")}</Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<TrendingUpIcon sx={{ color: "success.main" }} />}
          label={t("summary.totalIncome")}
          value={realData.totalIncome}
          color="success.main"
        />

        <StatCard
          icon={<TrendingDownIcon sx={{ color: "error.main" }} />}
          label={t("summary.totalExpenses")}
          value={realData.totalExpenses}
          color="error.main"
        />

        <StatCard
          icon={<AccountBalanceWalletIcon sx={{ color: "primary.main" }} />}
          label={t("summary.balance")}
          value={realData.balance}
          color="primary.main"
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />}
          label={t("summary.paidIncome")}
          value={realData.paidIncome}
          color="success.main"
        />

        <StatCard
          icon={<CheckCircleIcon sx={{ color: "error.main", fontSize: 20 }} />}
          label={t("summary.paidExpenses")}
          value={realData.paidExpenses}
          color="error.main"
        />

        <StatCard
          icon={<PendingIcon sx={{ color: "warning.main", fontSize: 20 }} />}
          label={t("summary.pendingIncome")}
          value={realData.pendingIncome}
          color="warning.main"
        />

        <StatCard
          icon={<WarningAmberIcon sx={{ color: "warning.main", fontSize: 20 }} />}
          label={t("summary.pendingExpenses")}
          value={realData.pendingExpenses}
          color="warning.main"
        />
      </Box>

      <Divider />

      <Typography variant="subtitle2" fontWeight={700}>{t("summary.projections")}</Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {[
          { label: t("summary.annualIncome"), value: annualIncome, color: "success.main" },
          { label: t("summary.annualExpenses"), value: annualExpenses, color: "error.main" },
          { label: t("summary.annualBalance"), value: annualBalance, color: "primary.main" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: 160 },
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.65rem" }}>
              {item.label}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: 800, color: item.color }}>
              {formatCurrency(item.value)}
            </Typography>
          </Box>
        ))}
      </Box>

      <SummaryTab projections={projections} year={year} />
    </Box>
  );
}
