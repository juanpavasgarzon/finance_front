"use client";

import { useState } from "react";
import { toast } from "sonner";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
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
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { InfoPopover } from "@/components/ui/InfoPopover";
import { useI18n } from "@/lib/i18n/context";
import { useSchedules, useCreateSchedule, useDeleteSchedule } from "@/lib/hooks";
import { useCategories } from "@/lib/hooks/use-categories";
import { formatCurrency } from "@/lib/utils/format";
import type { CategoryType, RecurrenceUnit } from "@/lib/contracts";

const UNITS: RecurrenceUnit[] = ["DAY", "WEEK", "MONTH", "YEAR"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString();
}

export default function SchedulesPage() {
  const { t } = useI18n();
  const { data: schedules, isLoading } = useSchedules();
  const { data: expenseCategories } = useCategories("EXPENSE");
  const { data: incomeCategories } = useCategories("INCOME");
  const createMutation = useCreateSchedule();
  const deleteMutation = useDeleteSchedule();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [recurrenceInterval, setRecurrenceInterval] = useState("1");
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>("MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [description, setDescription] = useState("");

  const categories = type === "EXPENSE" ? expenseCategories ?? [] : incomeCategories ?? [];

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId || !amount || !nextDueDate || !startDate || !name.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        categoryId,
        type,
        name: name.trim(),
        amount: Number(amount),
        recurrenceInterval: Number(recurrenceInterval) || 1,
        recurrenceUnit,
        nextDueDate,
        startDate,
        endDate: endDate || undefined,
        description: description.trim() || undefined,
      });
      toast.success(t("toast.scheduleCreated"));
      setName("");
      setAmount("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setNextDueDate("");
      setDrawerOpen(false);
    } catch {
      toast.error(t("toast.error"));
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>{t("schedules.title")}</Typography>
          <InfoPopover text={t("info.schedules")} />
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
          {t("schedules.create")}
        </Button>
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
                <TableCell>{t("schedules.amount")}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{t("categories.type")}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{t("schedules.recurrence")}</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{t("schedules.startDate")}</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{t("schedules.endDate")}</TableCell>
                <TableCell>{t("schedules.nextDueDate")}</TableCell>
                <TableCell align="right" sx={{ width: 60 }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(schedules ?? []).map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.name || "—"}</TableCell>
                  <TableCell>{row.description || "—"}</TableCell>
                  <TableCell>{formatCurrency(Number(row.amount))}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <Chip
                      label={t(row.type === "EXPENSE" ? "categories.expense" : "categories.income")}
                      size="small"
                      color={row.type === "EXPENSE" ? "error" : "success"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {row.recurrenceInterval} {t(`schedules.${row.recurrenceUnit.toLowerCase()}${row.recurrenceInterval > 1 ? "s" : ""}`)}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{row.startDate ? formatDate(row.startDate) : "—"}</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{row.endDate ? formatDate(row.endDate) : "—"}</TableCell>
                  <TableCell>{formatDate(row.nextDueDate)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget({ id: row.id, name: row.name || "—" })}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(schedules ?? []).length === 0 && (
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
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>{t("schedules.create")}</Typography>

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
              label={t("categories.type")}
              value={type}
              onChange={(e) => {
                setType(e.target.value as CategoryType);
                setCategoryId("");
              }}
              fullWidth
            >
              <MenuItem value="EXPENSE">{t("categories.expense")}</MenuItem>
              <MenuItem value="INCOME">{t("categories.income")}</MenuItem>
            </TextField>

            <TextField
              select
              label={t("categories.title")}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              fullWidth
            >
              <MenuItem value="" disabled>—</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              label={t("schedules.amount")}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label={t("schedules.startDate")}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  label={t("schedules.endDate")}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <TextField
              label={t("schedules.nextDueDate")}
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label={t("schedules.interval")}
                  type="number"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(e.target.value)}
                  fullWidth
                  slotProps={{ htmlInput: { min: 1 } }}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  label={t("schedules.recurrence")}
                  value={recurrenceUnit}
                  onChange={(e) => setRecurrenceUnit(e.target.value as RecurrenceUnit)}
                  fullWidth
                >
                  {UNITS.map((u) => (
                    <MenuItem key={u} value={u}>{t(`schedules.${u.toLowerCase()}`)}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

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
                disabled={!categoryId || !amount || !nextDueDate || !startDate || !name.trim() || createMutation.isPending}
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
