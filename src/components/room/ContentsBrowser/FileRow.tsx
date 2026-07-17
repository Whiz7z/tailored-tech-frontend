import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, TableCell, TableRow } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { FileItem } from "../../../api/types";
import { formatBytes, formatDate } from "../../../utils/format";
import { RowActions } from "../../common/RowActions";
import { contentsRowLinkStyle } from "./types";

interface FileRowProps {
  roomId: string;
  file: FileItem;
  onRename: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
}

export function FileRow({ roomId, file, onRename, onDelete }: FileRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Link
          to="/rooms/$roomId/files/$fileId"
          params={{ roomId, fileId: file.id }}
          style={contentsRowLinkStyle}
        >
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
            <DescriptionOutlinedIcon color="secondary" fontSize="small" />
            <span>{file.name}</span>
          </Box>
        </Link>
      </TableCell>
      <TableCell>PDF</TableCell>
      <TableCell>{formatBytes(file.size)}</TableCell>
      <TableCell>{formatDate(file.updatedAt)}</TableCell>
      <TableCell align="right">
        <RowActions
          onRename={() => onRename(file)}
          onDelete={() => onDelete(file)}
        />
      </TableCell>
    </TableRow>
  );
}
