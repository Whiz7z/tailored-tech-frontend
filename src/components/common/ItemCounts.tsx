import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { Box } from "@mui/material";
import { CountBadge } from "./CountBadge";

interface ItemCountsProps {
  folderCount: number;
  fileCount: number;
  /** Hide badges when the count is zero */
  showZero?: boolean;
}

export function ItemCounts({
  folderCount,
  fileCount,
  showZero = true,
}: ItemCountsProps) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        flexShrink: 0,
      }}
    >
      <CountBadge
        icon={<FolderOutlinedIcon />}
        count={folderCount}
        label="folder"
        showZero={showZero}
      />
      <CountBadge
        icon={<DescriptionOutlinedIcon />}
        count={fileCount}
        label="file"
        showZero={showZero}
      />
    </Box>
  );
}
