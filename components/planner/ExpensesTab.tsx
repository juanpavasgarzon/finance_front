"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";

import type { PayrollConfig, FixedExpense } from "@/lib/contracts/payroll";
import { formatCurrency } from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n/context";
import { MoneyInput } from "@/components/planner/MoneyInput";
import { InfoPopover } from "@/components/ui/InfoPopover";

interface ExpensesTabProps {
  config: PayrollConfig;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof FixedExpense, value: string | number) => void;
  onRemove: (index: number) => void;
}

export function ExpensesTab({ config, onAdd, onUpdate, onRemove }: ExpensesTabProps) {
  const { t } = useI18n();
  const total = config.egresosFijos.reduce((sum, e) => sum + (e.monto || 0), 0);

  return (
    <Card>
      <CardHeader
        avatar={<ReceiptIcon sx={{ color: "primary.main" }} />}
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {t("planner.fixedExpensesTitle")}
            <InfoPopover text={t("info.fixedExpenses")} />
          </Box>
        }
        titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
        action={
          <Button size="small" variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAdd}>
            {t("planner.addExpense")}
          </Button>
        }
      />

      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 100px 40px", sm: "1fr 150px 70px 40px" },
            gap: 1,
            px: 2,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
            {t("planner.concept")}
          </Typography>

          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", textAlign: "right" }}>
            {t("planner.amount")}
          </Typography>

          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: "uppercase", textAlign: "center", display: { xs: "none", sm: "block" } }}
          >
            Q
          </Typography>

          <Box />
        </Box>

        {config.egresosFijos.map((expense, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 100px 40px", sm: "1fr 150px 70px 40px" },
              gap: 1,
              px: 2,
              py: 0.75,
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <TextField
              size="small"
              value={expense.nombre}
              onChange={(e) => onUpdate(index, "nombre", e.target.value)}
              fullWidth
            />

            <MoneyInput value={expense.monto} onChange={(v) => onUpdate(index, "monto", v)} size="small" />

            <Select
              size="small"
              value={expense.quincena}
              onChange={(e) => onUpdate(index, "quincena", e.target.value)}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <MenuItem value="1Q">1Q</MenuItem>
              <MenuItem value="2Q">2Q</MenuItem>
            </Select>

            <IconButton size="small" color="error" onClick={() => onRemove(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.5, bgcolor: "primary.main" }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: "primary.contrastText" }}>
            {t("planner.totalMonthly")}
          </Typography>

          <Typography variant="h6" fontWeight={800} sx={{ fontFamily: "var(--font-geist-mono), monospace", color: "primary.contrastText" }}>
            {formatCurrency(total)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
