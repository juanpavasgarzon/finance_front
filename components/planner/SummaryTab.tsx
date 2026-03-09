"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BarChartIcon from "@mui/icons-material/BarChart";

import type { MonthProjection } from "@/lib/contracts/payroll";
import { formatCurrency } from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n/context";

interface SummaryTabProps {
  projections: Array<MonthProjection>;
  year: number;
}

export function SummaryTab({ projections, year }: SummaryTabProps) {
  const { t } = useI18n();

  const totals = projections.reduce(
    (acc, m) => ({
      netoNomina: acc.netoNomina + m.netoNomina,
      tExtras: acc.tExtras + m.tExtras,
      ingTotal: acc.ingTotal + m.ingTotal,
      egFijos: acc.egFijos + m.egFijos,
      balance: acc.balance + m.balance,
    }),
    { netoNomina: 0, tExtras: 0, ingTotal: 0, egFijos: 0, balance: 0 }
  );

  const lastAccum = projections[projections.length - 1]?.acum || 0;

  return (
    <Card>
      <CardHeader
        avatar={<BarChartIcon color="primary" />}
        title={`${t("planner.monthlySummary")} ${year}`}
        titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
      />

      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow>
                {[t("planner.monthHeader"), t("planner.payroll"), t("planner.extras"), t("planner.income"), t("planner.expensesHeader"), t("planner.balanceHeader"), t("planner.accumulated")].map(
                  (header, i) => (
                    <TableCell
                      key={header}
                      align={i === 0 ? "left" : "right"}
                      sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", color: "text.secondary" }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {projections.map((m, i) => (
                <TableRow key={m.mes} sx={{ bgcolor: i % 2 ? "action.hover" : "transparent" }}>
                  <TableCell sx={{ fontWeight: 600 }}>{m.mes}</TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(m.netoNomina)}</TableCell>

                  <TableCell align="right" sx={{ fontFamily: "monospace", color: m.tExtras > 0 ? "primary.main" : "text.disabled" }}>
                    {m.tExtras > 0 ? formatCurrency(m.tExtras) : "—"}
                  </TableCell>

                  <TableCell align="right" sx={{ fontFamily: "monospace", fontWeight: 600 }}>{formatCurrency(m.ingTotal)}</TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace", color: "text.secondary" }}>{formatCurrency(m.egFijos)}</TableCell>

                  <TableCell align="right" sx={{ fontFamily: "monospace", fontWeight: 700, color: m.balance >= 0 ? "primary.main" : "text.secondary" }}>
                    {formatCurrency(m.balance)}
                  </TableCell>

                  <TableCell align="right" sx={{ fontFamily: "monospace", fontWeight: 700, color: "primary.main" }}>
                    {formatCurrency(m.acum)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow sx={{ "& td": { borderTop: 2, borderColor: "primary.main", fontWeight: 800, color: "primary.main", fontSize: "0.85rem" } }}>
                <TableCell>{t("planner.totalMonthly")}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(totals.netoNomina)}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(totals.tExtras)}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(totals.ingTotal)}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(totals.egFijos)}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(totals.balance)}</TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>{formatCurrency(lastAccum)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
