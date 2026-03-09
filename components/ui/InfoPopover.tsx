"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoPopoverProps {
  text: string;
}

export function InfoPopover({ text }: InfoPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "text.secondary", ml: 0.5 }}>
        <InfoOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Typography sx={{ p: 2, maxWidth: 300, lineHeight: 1.6 }} variant="body2" color="text.secondary">
          {text}
        </Typography>
      </Popover>
    </>
  );
}
