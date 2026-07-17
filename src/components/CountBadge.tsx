import { Box, Tooltip, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface CountBadgeProps {
  icon: ReactNode;
  count: number;
  label: string;
  /** When false, hide the badge if count is 0 */
  showZero?: boolean;
}

export function CountBadge({
  icon,
  count,
  label,
  showZero = true,
}: CountBadgeProps) {
  if (!showZero && count === 0) {
    return null;
  }

  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const pluralLabel = `${safeCount} ${label}${safeCount === 1 ? "" : "s"}`;

  return (
    <Tooltip title={pluralLabel}>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.4,
          px: 0.75,
          py: 0.15,
          borderRadius: 1,
          bgcolor: "rgba(31, 75, 63, 0.08)",
          color: "text.secondary",
          lineHeight: 1.4,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 14,
            "& .MuiSvgIcon-root": { fontSize: 14 },
          }}
        >
          {icon}
        </Box>
        <Typography
          component="span"
          variant="caption"
          sx={{ fontWeight: 600, fontSize: 12, lineHeight: 1 }}
        >
          {safeCount}
        </Typography>
      </Box>
    </Tooltip>
  );
}
