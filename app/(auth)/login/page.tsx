"use client";

import { useState } from "react";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const { t, localePath } = useI18n();
  const { loginMutation } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ username, password });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("toast.error"));
    }
  }

  return (
    <Card elevation={4}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          {t("auth.loginTitle")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label={t("auth.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            autoComplete="username"
          />

          <TextField
            label={t("auth.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loginMutation.isPending}
            startIcon={loginMutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {t("auth.login")}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          {t("auth.noAccount")}{" "}
          <Typography
            component={Link}
            href={localePath("/register")}
            variant="body2"
            color="primary"
            fontWeight={600}
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            {t("auth.register")}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
