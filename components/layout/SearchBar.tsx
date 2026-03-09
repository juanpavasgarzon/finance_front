"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalculateIcon from "@mui/icons-material/Calculate";
import CategoryIcon from "@mui/icons-material/Category";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useI18n } from "@/lib/i18n/context";

import type { SvgIconComponent } from "@mui/icons-material";

interface PageOption {
  href: string;
  key: string;
  label: string;
  icon: SvgIconComponent;
}

const pages: Array<{ href: string; key: string; icon: SvgIconComponent }> = [
  { href: "/dashboard", key: "nav.dashboard", icon: DashboardIcon },
  { href: "/planner", key: "nav.planner", icon: CalculateIcon },
  { href: "/categories", key: "nav.categories", icon: CategoryIcon },
  { href: "/schedules", key: "nav.schedules", icon: ScheduleIcon },
  { href: "/expenses", key: "nav.expenses", icon: TrendingDownIcon },
  { href: "/incomes", key: "nav.incomes", icon: TrendingUpIcon },
  { href: "/summary", key: "nav.summary", icon: AssessmentIcon },
];

export function SearchBar() {
  const { t, localePath } = useI18n();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const options: Array<PageOption> = pages.map((p) => ({ ...p, label: t(p.key) }));

  return (
    <Autocomplete
      size="small"
      options={options}
      inputValue={inputValue}
      onInputChange={(_, val) => setInputValue(val)}
      onChange={(_, newValue) => {
        if (newValue) {
          router.push(localePath(newValue.href));
          setInputValue("");
        }
      }}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const { key: _key, ...rest } = props;
        const Icon = option.icon;

        return (
          <Box component="li" {...rest} key={option.href}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Icon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary={option.label} primaryTypographyProps={{ variant: "body2" }} />
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("common.search")}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 220 }}
        />
      )}
      noOptionsText={t("common.noResults")}
      clearOnBlur
      blurOnSelect
      sx={{ "& .MuiOutlinedInput-root": { py: 0 } }}
    />
  );
}
