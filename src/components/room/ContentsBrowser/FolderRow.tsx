import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { TableCell, TableRow } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { Folder } from "../../../api/types";
import { formatDate } from "../../../utils/format";
import { DEFAULT_CONTENTS_SEARCH } from "../../../utils/search";
import { ItemNameWithCounts } from "../../common/ItemNameWithCounts";
import { RowActions } from "../../common/RowActions";
import { contentsRowLinkStyle } from "./types";
interface FolderRowProps {
  roomId: string;
  folder: Folder;
  onRename: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export function FolderRow({ roomId, folder, onRename, onDelete }: FolderRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Link
          to="/rooms/$roomId/folders/$folderId"
          params={{ roomId, folderId: folder.id }}
          search={DEFAULT_CONTENTS_SEARCH}
          style={contentsRowLinkStyle}
        >
          <ItemNameWithCounts
            icon={<FolderOutlinedIcon color="primary" fontSize="small" />}
            name={folder.name}
            folderCount={folder.folderCount}
            fileCount={folder.fileCount}
          />
        </Link>
      </TableCell>
      <TableCell>Folder</TableCell>
      <TableCell>—</TableCell>
      <TableCell>{formatDate(folder.updatedAt)}</TableCell>
      <TableCell align="right">
        <RowActions
          onRename={() => onRename(folder)}
          onDelete={() => onDelete(folder)}
        />
      </TableCell>
    </TableRow>
  );
}
