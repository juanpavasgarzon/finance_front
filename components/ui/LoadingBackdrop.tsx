"use client";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export function LoadingBackdrop() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (isFetching > 0 || isMutating > 0) {
    return (
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar + 1 }}>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  return null;
}
