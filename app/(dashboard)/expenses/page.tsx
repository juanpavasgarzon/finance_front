"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";

import { InfoPopover } from "@/components/ui/InfoPopover";
import { useI18n } from "@/lib/i18n/context";
import { useExpenses, useCreateExpense, useMarkExpensePaid, useDeleteExpense } from "@/lib/hooks";
import { useCategories } from "@/lib/hooks/use-categories";
import { formatCurrency } from "@/lib/utils/format";
import { exportToExcel } from "@/lib/utils/excel-export";
import { filterByPeriod } from "@/lib/utils/filter-by-period";
import type { TimePeriod } from "@/lib/utils/filter-by-period";

function formatDate(s: string | null) {
  if (!s) {
    return "—";
  }

  return new Date(s).toLocaleDateString();
}

export default function ExpensesPage() {
  const { t } = useI18n();
  const { data: expenses, isLoading } = useExpenses();
  const { data: categories } = useCategories("EXPENSE");
  const createMutation = useCreateExpense();
  const markPaidMutation = useMarkExpensePaid();
  const deleteMutation = useDeleteExpense();

  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [refDate, setRefDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const filteredExpenses = useMemo(() => {
    return filterByPeriod(expenses ?? [], period, new Date(refDate));
  }, [expenses, period, refDate]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId || !amount || !name.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        categoryId,
        name: name.trim(),
        amount: Number(amount),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      toast.success(t("toast.expenseCreated"));
      setName("");
      setCategoryId("");
      setAmount("");
      setDescription("");
      setDueDate("");
      setDrawerOpen(false);
    } catch {
      toast.error(t("toast.error"));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(t("toast.deleted"));
    } catch {
      toast.error(t("toast.error"));
    }

    setDeleteTarget(null);
  }

  function handlePay(id: string) {
    markPaidMutation.mutate(id, {
      onSuccess: () => toast.success(t("toast.markedPaid")),
      onError: () => toast.error(t("toast.error")),
    });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>{t("expenses.title")}</Typography>
          <InfoPopover text={t("info.expenses")} />
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
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              if (filteredExpenses.length === 0) {
                return;
              }

              const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));

              await exportToExcel([{
                name: t("expenses.title"),
                title: t("expenses.title"),
                subtitle: `${t("summary.period")}: ${t(`summary.${period}`)} — ${refDate}`,
                columns: [
                  { header: t("common.name"), key: "name", width: 25 },
                  { header: t("common.description"), key: "description", width: 30 },
                  { header: t("expenses.amount"), key: "amount", width: 18, isCurrency: true },
                  { header: t("categories.title"), key: "category", width: 20 },
                  { header: t("expenses.dueDate"), key: "dueDate", width: 14 },
                  { header: t("common.status"), key: "status", width: 12 },
                ],
                rows: filteredExpenses.map((e) => ({
                  name: e.name,
                  description: e.description ?? "",
                  amount: e.amount,
                  category: catMap.get(e.categoryId) ?? "",
                  dueDate: e.dueDate ? new Date(e.dueDate).toLocaleDateString() : "",
                  status: e.paidAt ? t("expenses.paid") : t("expenses.unpaid"),
                })),
              }], `expenses-${refDate}.xlsx`);
            }}
          >
            Excel
          </Button>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
            {t("expenses.create")}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ "& td + td, & th + th": { borderLeft: "1px solid", borderLeftColor: "divider" } }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("common.name")}</TableCell>
                <TableCell>{t("common.description")}</TableCell>
                <TableCell>{t("expenses.amount")}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{t("expenses.dueDate")}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{t("common.status")}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredExpenses.map((row) => {
                const isPaid = !!row.paidAt;

                return (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.name || "—"}</TableCell>
                    <TableCell>{row.description || "—"}</TableCell>
                    <TableCell>{formatCurrency(Number(row.amount))}</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{formatDate(row.dueDate)}</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      <Chip
                        label={isPaid ? t("expenses.paid") : t("expenses.unpaid")}
                        color={isPaid ? "success" : "warning"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      {!isPaid && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handlePay(row.id)}
                          disabled={markPaidMutation.isPending}
                          sx={{ mr: 0.5 }}
                        >
                          {t("expenses.pay")}
                        </Button>
                      )}

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget({ id: row.id, name: row.name || "—" })}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              {t("common.noData")}
            </Typography>
          )}
        </TableContainer>
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("confirm.deleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("confirm.deleteMessage")}</Typography>

          {deleteTarget && (
            <Typography sx={{ mt: 1, fontWeight: 700 }}>{deleteTarget.name}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{t("confirm.cancel")}</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            startIcon={deleteMutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: "100%", sm: 380 }, maxWidth: "100vw", p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>{t("expenses.create")}</Typography>

          <Box component="form" onSubmit={handleCreate} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label={t("common.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              select
              label={t("categories.title")}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              fullWidth
            >
              <MenuItem value="" disabled>—</MenuItem>
              {(categories ?? []).map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              label={t("expenses.amount")}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label={t("expenses.dueDate")}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label={t("common.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
              <Button variant="outlined" onClick={() => setDrawerOpen(false)} sx={{ flex: 1 }}>
                {t("common.cancel")}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!categoryId || !amount || !name.trim() || createMutation.isPending}
                sx={{ flex: 1 }}
                startIcon={createMutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
              >
                {t("common.add")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
