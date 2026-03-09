"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { formatCurrency } from "@/lib/utils/format";

interface PillData {
  label: string;
  value: number;
  color?: string;
}

interface SummaryPillsProps {
  items: Array<PillData>;
}

export function SummaryPills({ items }: SummaryPillsProps) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
      {items.map((item) => {
        const pillColor = item.color || "primary.main";

        return (
          <Paper
            key={item.label}
            sx={{
              flex: 1,
              minWidth: 140,
              p: 1.5,
              textAlign: "center",
              borderLeft: 3,
              borderColor: pillColor,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
              {item.label}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: 800, color: pillColor }}>
              {formatCurrency(item.value)}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
