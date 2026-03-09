"use client";

import { useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCardIcon from "@mui/icons-material/AddCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SyncIcon from "@mui/icons-material/Sync";
import { toast } from "sonner";

import { InfoPopover } from "@/components/ui/InfoPopover";
import { ExtraIncomeTab } from "@/components/planner/ExtraIncomeTab";
import { ExpensesTab } from "@/components/planner/ExpensesTab";
import { PayrollTab } from "@/components/planner/PayrollTab";
import type { PayrollConfig, FixedExpense, ExtraIncome } from "@/lib/contracts/payroll";
import type { PlannerData } from "@/lib/contracts/planner";
import { usePlannerData, useSavePlanner, useSyncPlanner } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/context";
import { DEFAULT_PAYROLL_CONFIG, calculatePayroll } from "@/lib/utils/payroll";

function hydrateConfig(data: PlannerData | undefined): PayrollConfig {
  if (!data) {
    return DEFAULT_PAYROLL_CONFIG;
  }

  const serverConfig = data.payrollConfig as unknown as Partial<PayrollConfig>;
  const merged = { ...DEFAULT_PAYROLL_CONFIG, ...serverConfig };

  if (serverConfig.egresosFijos) {
    merged.egresosFijos = serverConfig.egresosFijos;
  }

  return merged;
}

function hydrateExtras(data: PlannerData | undefined): Array<ExtraIncome> {
  if (!data) {
    return [];
  }

  return (data.extraIncomes ?? []) as unknown as Array<ExtraIncome>;
}

function PlannerContent({ initialData }: { initialData: PlannerData | undefined }) {
  const { t } = useI18n();
  const [tab, setTab] = useState(0);
  const saveMutation = useSavePlanner();
  const syncMutation = useSyncPlanner();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [config, setConfig] = useState<PayrollConfig>(() => hydrateConfig(initialData));
  const [extras, setExtras] = useState<Array<ExtraIncome>>(() => hydrateExtras(initialData));

  const persist = useCallback(
    (newConfig: PayrollConfig, newExtras: Array<ExtraIncome>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        saveMutation.mutate({
          payrollConfig: newConfig as unknown as Record<string, unknown>,
          fixedExpenses: newConfig.egresosFijos as unknown as Array<Record<string, unknown>>,
          extraIncomes: newExtras as unknown as Array<Record<string, unknown>>,
        });
      }, 800);
    },
    [saveMutation],
  );

  const handleConfigUpdate = useCallback(
    (key: string, value: number | string | boolean) => {
      const updated = { ...config, [key]: value };
      setConfig(updated);
      persist(updated, extras);
    },
    [config, extras, persist],
  );

  const handleAddExpense = useCallback(() => {
    const updated = {
      ...config,
      egresosFijos: [...config.egresosFijos, { nombre: "Nuevo gasto", monto: 0, quincena: "1Q" as const }],
    };

    setConfig(updated);
    persist(updated, extras);
  }, [config, extras, persist]);

  const handleUpdateExpense = useCallback(
    (index: number, field: keyof FixedExpense, value: string | number) => {
      const newExpenses = [...config.egresosFijos];
      newExpenses[index] = { ...newExpenses[index], [field]: value };
      const updated = { ...config, egresosFijos: newExpenses };
      setConfig(updated);
      persist(updated, extras);
    },
    [config, extras, persist],
  );

  const handleRemoveExpense = useCallback(
    (index: number) => {
      const updated = {
        ...config,
        egresosFijos: config.egresosFijos.filter((_, i) => i !== index),
      };

      setConfig(updated);
      persist(updated, extras);
    },
    [config, extras, persist],
  );

  const handleAddExtra = useCallback(
    (extra: Omit<ExtraIncome, "id">) => {
      const newExtras = [...extras, { ...extra, id: Date.now() }];
      setExtras(newExtras);
      persist(config, newExtras);
    },
    [config, extras, persist],
  );

  const handleRemoveExtra = useCallback(
    (id: number) => {
      const newExtras = extras.filter((e) => e.id !== id);
      setExtras(newExtras);
      persist(config, newExtras);
    },
    [config, extras, persist],
  );

  const handleSync = useCallback(() => {
    syncMutation.mutate(undefined, {
      onSuccess: (result) => {
        const total = result.categoriesCreated + result.expensesCreated + result.incomesCreated;

        if (total === 0) {
          toast.info(t("planner.syncNoChanges"));
          return;
        }

        toast.success(t("planner.syncSuccess"));
      },
      onError: () => {
        toast.error(t("planner.syncError"));
      },
    });
  }, [syncMutation, t]);

  const payroll = calculatePayroll(config);
  const totalExpenses = config.egresosFijos.reduce((sum, e) => sum + (e.monto || 0), 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          {t("planner.title")}
        </Typography>
        <InfoPopover text={t("info.summary")} />

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          size="small"
          startIcon={syncMutation.isPending ? <CircularProgress size={16} /> : <SyncIcon />}
          onClick={handleSync}
          disabled={syncMutation.isPending}
        >
          {t("planner.syncButton")}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<AttachMoneyIcon />} iconPosition="start" label={t("planner.payrollTab")} />
          <Tab icon={<AddCardIcon />} iconPosition="start" label={t("planner.extrasTab")} />
          <Tab icon={<ReceiptIcon />} iconPosition="start" label={t("planner.expensesTabLabel")} />
        </Tabs>
      </Box>

      {tab === 0 && (
        <PayrollTab config={config} payroll={payroll} totalExpenses={totalExpenses} onUpdate={handleConfigUpdate} />
      )}

      {tab === 1 && (
        <ExtraIncomeTab extras={extras} onAdd={handleAddExtra} onRemove={handleRemoveExtra} />
      )}

      {tab === 2 && (
        <ExpensesTab config={config} onAdd={handleAddExpense} onUpdate={handleUpdateExpense} onRemove={handleRemoveExpense} />
      )}
    </Box>
  );
}

export default function PlannerPage() {
  const { data: plannerData, isLoading } = usePlannerData();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <PlannerContent initialData={plannerData} />;
}
