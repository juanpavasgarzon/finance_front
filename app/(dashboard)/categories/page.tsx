"use client";

import { useState } from "react";
import { toast } from "sonner";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useI18n } from "@/lib/i18n/context";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/lib/hooks";
import type { CategoryType, Category } from "@/lib/contracts";
import { InfoPopover } from "@/components/ui/InfoPopover";

export default function CategoriesPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [createType, setCreateType] = useState<CategoryType>("EXPENSE");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data: expenseCategories, isLoading: loadingExpense } = useCategories("EXPENSE");
  const { data: incomeCategories, isLoading: loadingIncome } = useCategories("INCOME");
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const activeType: CategoryType = tab === 0 ? "EXPENSE" : "INCOME";
  const activeList = activeType === "EXPENSE" ? expenseCategories : incomeCategories;
  const isLoading = activeType === "EXPENSE" ? loadingExpense : loadingIncome;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({ name: name.trim(), type: createType });
      toast.success(t("toast.categoryCreated"));
      setName("");
      setDrawerOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("toast.error");
      toast.error(message);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(t("categories.deleted"));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("categories.hasRelations");
      toast.error(message);
      setDeleteTarget(null);
    }
  }

  function handleOpenCreate() {
    setCreateType(activeType);
    setDrawerOpen(true);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>{t("categories.title")}</Typography>
          <InfoPopover text={t("info.categories") || t("categories.title")} />
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t("categories.create")}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab
            icon={<TrendingDownIcon />}
            iconPosition="start"
            label={`${t("categories.expenseCategories")} (${(expenseCategories ?? []).length})`}
          />

          <Tab
            icon={<TrendingUpIcon />}
            iconPosition="start"
            label={`${t("categories.incomeCategories")} (${(incomeCategories ?? []).length})`}
          />
        </Tabs>
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
                <TableCell>{t("categories.name")}</TableCell>
                <TableCell>{t("categories.type")}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{t("categories.createdAt")}</TableCell>
                <TableCell align="right" sx={{ width: 80 }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(activeList ?? []).map((cat) => (
                <TableRow key={cat.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                  <TableCell>{cat.type === "EXPENSE" ? t("categories.expense") : t("categories.income")}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(cat)}
                      disabled={deleteMutation.isPending}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(activeList ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              {t("categories.empty")}
            </Typography>
          )}
        </TableContainer>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: "100%", sm: 380 }, maxWidth: "100vw", p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>{t("categories.create")}</Typography>

          <Box component="form" onSubmit={handleCreate} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label={t("categories.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label={t("categories.type")}
              value={createType}
              onChange={(e) => setCreateType(e.target.value as CategoryType)}
              fullWidth
            >
              <MenuItem value="EXPENSE">{t("categories.expense")}</MenuItem>
              <MenuItem value="INCOME">{t("categories.income")}</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
              <Button variant="outlined" onClick={() => setDrawerOpen(false)} sx={{ flex: 1 }}>
                {t("common.cancel")}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!name.trim() || createMutation.isPending}
                sx={{ flex: 1 }}
                startIcon={createMutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
              >
                {t("common.add")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("categories.deleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("categories.deleteMessage")}
          </Typography>

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
    </Box>
  );
}
