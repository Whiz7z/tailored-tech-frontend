import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { ItemCounts } from "./ItemCounts";

interface ItemNameWithCountsProps {
  icon: ReactNode;
  name: string;
  folderCount: number;
  fileCount: number;
  showZero?: boolean;
}

export function ItemNameWithCounts({
  icon,
  name,
  folderCount,
  fileCount,
  showZero = true,
}: ItemNameWithCountsProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "inherit",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {name}
      </Typography>
      <ItemCounts
        folderCount={folderCount}
        fileCount={fileCount}
        showZero={showZero}
      />
    </Box>
  );
}
