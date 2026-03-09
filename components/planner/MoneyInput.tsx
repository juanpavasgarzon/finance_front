"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { formatNumber, parseNumericInput } from "@/lib/utils/format";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export function MoneyInput({ value, onChange, label, size = "small", fullWidth = false }: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawInput, setRawInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(e.target.value);
    const parsed = parseNumericInput(e.target.value);

    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setRawInput(String(value));
    requestAnimationFrame(() => e.target.select());
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <TextField
      label={label}
      value={focused ? rawInput : formatNumber(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      size={size}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          sx: { fontFamily: "var(--font-geist-mono), monospace" },
        },
      }}
    />
  );
}
