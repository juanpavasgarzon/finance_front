"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";

import type { ExtraIncome } from "@/lib/contracts/payroll";
import { formatCurrency } from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n/context";
import { MoneyInput } from "@/components/planner/MoneyInput";
import { InfoPopover } from "@/components/ui/InfoPopover";

interface ExtraIncomeTabProps {
  extras: Array<ExtraIncome>;
  onAdd: (extra: Omit<ExtraIncome, "id">) => void;
  onRemove: (id: number) => void;
}

export function ExtraIncomeTab({ extras, onAdd, onRemove }: ExtraIncomeTabProps) {
  const { t } = useI18n();
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [fuente, setFuente] = useState("");
  const [monto, setMonto] = useState(0);

  const handleAdd = () => {
    if (!fuente.trim() || monto <= 0) {
      return;
    }

    onAdd({ fecha, fuente: fuente.trim(), monto });
    setFuente("");
    setMonto(0);
  };

  const total = extras.reduce((sum, e) => sum + (e.monto || 0), 0);
  const sorted = [...extras].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <Stack spacing={2}>
      <Card>
        <CardHeader
          avatar={<AddCircleOutlineIcon sx={{ color: "primary.main" }} />}
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {t("planner.registerExtra")}
              <InfoPopover text={t("info.extras")} />
            </Box>
          }
          titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
        />

        <CardContent>
          <Stack spacing={2}>
            <TextField label={t("planner.date")} type="date" size="small" fullWidth value={fecha} onChange={(e) => setFecha(e.target.value)} />

            <TextField
              label={t("planner.source")}
              size="small"
              fullWidth
              value={fuente}
              onChange={(e) => setFuente(e.target.value)}
              placeholder={t("planner.sourcePlaceholder")}
            />

            <MoneyInput label={t("planner.amount")} value={monto} onChange={setMonto} fullWidth />

            <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<AddCircleOutlineIcon />} fullWidth>
              {t("planner.addExtra")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          avatar={<HistoryIcon color="disabled" />}
          title={`${t("planner.history")} (${extras.length})`}
          titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
        />

        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {sorted.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">{t("planner.noRecords")}</Typography>
            </Box>
          ) : (
            <>
              {sorted.map((extra) => (
                <Box
                  key={extra.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", minWidth: 85 }}>
                    {extra.fecha}
                  </Typography>

                  <Typography variant="body2" sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {extra.fuente}
                  </Typography>

                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, color: "primary.main", minWidth: 100, textAlign: "right" }}>
                    {formatCurrency(extra.monto)}
                  </Typography>

                  <IconButton size="small" color="error" onClick={() => onRemove(extra.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.5, bgcolor: "action.hover" }}>
                <Typography variant="body2" fontWeight={700} color="primary.main">{t("planner.totalMonthly")}</Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace", fontWeight: 800, color: "primary.main" }}>
                  {formatCurrency(total)}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
