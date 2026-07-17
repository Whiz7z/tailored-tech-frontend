import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IconButton, Tooltip } from "@mui/material";

interface RowActionsProps {
  onRename: () => void;
  onDelete: () => void;
}

export function RowActions({ onRename, onDelete }: RowActionsProps) {
  return (
    <>
      <Tooltip title="Rename">
        <IconButton size="small" onClick={onRename}>
          <DriveFileRenameOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={onDelete}>
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}
