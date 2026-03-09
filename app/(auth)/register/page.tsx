"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
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
import { COUNTRIES } from "@/lib/constants/countries";
import type { CountryOption } from "@/lib/constants/countries";

export default function RegisterPage() {
  const { t, locale, localePath } = useI18n();
  const { registerMutation } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const defaultCountry = COUNTRIES.find((c) => c.code === "CO") ?? COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(defaultCountry);
  const [error, setError] = useState("");

  const sortedCountries = useMemo(() => {
    return [...COUNTRIES].sort((a, b) => {
      const nameA = locale === "es" ? a.nameEs : a.nameEn;
      const nameB = locale === "es" ? b.nameEs : b.nameEn;

      if (a.code === "OT") {
        return 1;
      }

      if (b.code === "OT") {
        return -1;
      }

      return nameA.localeCompare(nameB, locale);
    });
  }, [locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await registerMutation.mutateAsync({
        username,
        password,
        country: selectedCountry?.code ?? "OT",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t("auth.usernameAlreadyRegistered"));
        return;
      }

      setError(err instanceof ApiError ? err.message : t("toast.error"));
    }
  }

  return (
    <Card elevation={4}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          {t("auth.registerTitle")}
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
            autoComplete="new-password"
          />

          <Autocomplete
            options={sortedCountries}
            value={selectedCountry}
            onChange={(_, value) => { if (value) { setSelectedCountry(value); } }}
            getOptionLabel={(option) => locale === "es" ? option.nameEs : option.nameEn}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderOption={(props, option) => {
              const { key: _key, ...rest } = props;

              return (
                <Box component="li" {...rest} key={option.code}>
                  <Typography variant="body2">
                    {locale === "es" ? option.nameEs : option.nameEn}
                  </Typography>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label={t("auth.country")} required />
            )}
            fullWidth
            disableClearable
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={registerMutation.isPending}
            startIcon={registerMutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {t("auth.register")}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          {t("auth.hasAccount")}{" "}
          <Typography
            component={Link}
            href={localePath("/login")}
            variant="body2"
            color="primary"
            fontWeight={600}
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            {t("auth.login")}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
