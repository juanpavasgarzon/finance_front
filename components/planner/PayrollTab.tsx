"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import type { PayrollConfig, PayrollResult } from "@/lib/contracts/payroll";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n/context";
import { MoneyInput } from "@/components/planner/MoneyInput";
import { InfoPopover } from "@/components/ui/InfoPopover";

interface PayrollTabProps {
  config: PayrollConfig;
  payroll: PayrollResult;
  totalExpenses: number;
  onUpdate: (key: string, value: number | string | boolean) => void;
}

function DataRow({
  label,
  value,
  sub,
  bold,
  color,
  negative,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  color?: string;
  negative?: boolean;
}) {
  const textColor = color || (negative ? "text.secondary" : "text.primary");

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75, px: 2 }}>
      <Box>
        <Typography variant="body2" fontWeight={bold ? 700 : 400}>
          {label}
        </Typography>

        {sub && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {sub}
          </Typography>
        )}
      </Box>

      <Typography
        variant="body2"
        sx={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: bold ? 700 : 500, color: textColor }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function PayrollTab({ config, payroll, totalExpenses, onUpdate }: PayrollTabProps) {
  const { t } = useI18n();

  return (
    <Stack spacing={2}>
      <Card>
            <CardHeader
              avatar={<ReceiptLongIcon color="primary" />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.incomeTitle")}
                  <InfoPopover text={t("info.baseIncome")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
            />
            <Divider />

            <CardContent>
              <Stack spacing={2}>
                <MoneyInput label={t("planner.monthlyIncome")} value={config.salarioBasico} onChange={(v) => onUpdate("salarioBasico", v)} fullWidth />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              avatar={<DirectionsBusIcon sx={{ color: config.enableAuxTransporte ? "primary.main" : "text.disabled" }} />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.transportAidTitle")}
                  <InfoPopover text={t("info.transportAid")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              action={
                <Switch
                  checked={config.enableAuxTransporte}
                  onChange={(_, checked) => onUpdate("enableAuxTransporte", checked)}
                  color="primary"
                />
              }
            />
            <Divider />

            <Collapse in={config.enableAuxTransporte}>
              <CardContent sx={{ pt: 0 }}>
                <MoneyInput label={t("planner.transportAidAmount")} value={config.auxilioTransporte} onChange={(v) => onUpdate("auxilioTransporte", v)} fullWidth />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  {t("planner.transportAidHint")}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>

          <Card>
            <CardHeader
              avatar={<LocalHospitalIcon sx={{ color: config.enableSalud ? "primary.main" : "text.disabled" }} />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.healthTitle")}
                  <InfoPopover text={t("info.health")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              action={
                <Switch
                  checked={config.enableSalud}
                  onChange={(_, checked) => onUpdate("enableSalud", checked)}
                  color="primary"
                />
              }
            />
            <Divider />

            <Collapse in={config.enableSalud}>
              <CardContent sx={{ pt: 0 }}>
                <MoneyInput label={t("planner.healthAmount")} value={config.montoSalud} onChange={(v) => onUpdate("montoSalud", v)} fullWidth />

                <Box sx={{ mt: 1.5, display: "flex", gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("planner.monthly")}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 800, color: "primary.main" }}>
                      {formatCurrency(payroll.saludM)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("planner.biweekly")}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {formatCurrency(payroll.saludQ)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Collapse>
          </Card>

          <Card>
            <CardHeader
              avatar={<SecurityIcon sx={{ color: config.enablePension ? "primary.main" : "text.disabled" }} />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.pensionTitle")}
                  <InfoPopover text={t("info.pension")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              action={
                <Switch
                  checked={config.enablePension}
                  onChange={(_, checked) => onUpdate("enablePension", checked)}
                  color="primary"
                />
              }
            />
            <Divider />

            <Collapse in={config.enablePension}>
              <CardContent sx={{ pt: 0 }}>
                <MoneyInput label={t("planner.pensionAmount")} value={config.montoPension} onChange={(v) => onUpdate("montoPension", v)} fullWidth />

                <Box sx={{ mt: 1.5, display: "flex", gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("planner.monthly")}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 800, color: "primary.main" }}>
                      {formatCurrency(payroll.pensionM)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("planner.biweekly")}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {formatCurrency(payroll.pensionQ)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Collapse>
          </Card>

          <Card>
            <CardHeader
              avatar={<FavoriteIcon sx={{ color: config.enableFSP ? "primary.main" : "text.disabled" }} />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.fspTitle")}
                  <InfoPopover text={t("info.fsp")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              action={
                <Switch
                  checked={config.enableFSP}
                  onChange={(_, checked) => onUpdate("enableFSP", checked)}
                  color="primary"
                />
              }
            />
            <Divider />

            <Collapse in={config.enableFSP}>
              <CardContent sx={{ pt: 0 }}>
                <MoneyInput label={t("planner.fspAmount")} value={config.montoFSP} onChange={(v) => onUpdate("montoFSP", v)} fullWidth />

                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">{t("planner.monthly")}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 800 }}>
                    {formatCurrency(payroll.fspM)}
                  </Typography>
                </Box>
              </CardContent>
            </Collapse>
          </Card>

          <Card>
            <CardHeader
              avatar={<AccountBalanceIcon sx={{ color: config.enablePrestamo ? "primary.main" : "text.disabled" }} />}
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {t("planner.loanTitle")}
                  <InfoPopover text={t("info.loan")} />
                </Box>
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              action={
                <Switch
                  checked={config.enablePrestamo}
                  onChange={(_, checked) => onUpdate("enablePrestamo", checked)}
                  color="primary"
                />
              }
            />
            <Divider />

            <Collapse in={config.enablePrestamo}>
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  <MoneyInput label={t("planner.loanTotal")} value={config.prestamoTotal} onChange={(v) => onUpdate("prestamoTotal", v)} fullWidth />

                  <TextField
                    label={t("planner.monthlyInterest")}
                    type="number"
                    size="small"
                    fullWidth
                    value={config.tasaInteresMensual}
                    onChange={(e) => onUpdate("tasaInteresMensual", parseFloat(e.target.value) || 0)}
                    slotProps={{ htmlInput: { step: 0.001 } }}
                  />

                  <TextField label={t("planner.startDate")} type="date" size="small" fullWidth value={config.fechaInicio} onChange={(e) => onUpdate("fechaInicio", e.target.value)} />
                  <TextField label={t("planner.endDate")} type="date" size="small" fullWidth value={config.fechaFin} onChange={(e) => onUpdate("fechaFin", e.target.value)} />

                  <TextField
                    label={t("planner.monthsPaid")}
                    type="number"
                    size="small"
                    fullWidth
                    value={config.mesesTranscurridos}
                    onChange={(e) => onUpdate("mesesTranscurridos", parseFloat(e.target.value) || 0)}
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={0}>
                  <DataRow label={t("planner.biweeklyRate")} value={formatPercent(payroll.tasaQ)} />
                  <DataRow label={t("planner.biweeklyPayment")} value={formatCurrency(payroll.cuotaQ)} bold color="primary.main" />
                  <DataRow label={t("planner.monthlyPayment")} value={formatCurrency(payroll.cuotaM)} />
                  <DataRow label={t("planner.outstandingBalance")} value={formatCurrency(payroll.saldo)} bold color="text.secondary" />
                  <DataRow label={t("planner.remainingPeriods")} value={String(payroll.qRest)} />
                </Stack>
              </CardContent>
            </Collapse>
          </Card>

      <Card>
        <CardHeader
          avatar={<TrendingUpIcon color="primary" />}
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {t("planner.monthlyFlowTitle")}
              <InfoPopover text={t("info.monthlyFlow")} />
            </Box>
          }
          titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
        />
        <Divider />

        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <DataRow label={t("planner.netIncome")} value={formatCurrency(payroll.netoM)} color="primary.main" />
          <DataRow label={t("planner.fixedExpenses")} value={formatCurrency(totalExpenses)} negative />

          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "primary.main",
            }}
          >
            <Typography variant="body2" fontWeight={800} sx={{ color: "primary.contrastText" }}>{t("planner.available")}</Typography>
            <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "var(--font-geist-mono), monospace", color: "primary.contrastText" }}>
              {formatCurrency(payroll.netoM - totalExpenses)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
