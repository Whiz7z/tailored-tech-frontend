import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type {
  ContentsSortBy,
  FileItem,
  Folder,
  SortOrder,
} from "../../../api/types";
import {
  SortableHeaderCell,
  nextSortState,
} from "../../common/SortableHeaderCell";
import { FileRow } from "./FileRow";
import { FolderRow } from "./FolderRow";

interface ContentsTableProps {
  roomId: string;
  folders: Folder[];
  files: FileItem[];
  isFetching?: boolean;
  sortBy: ContentsSortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: ContentsSortBy, sortOrder: SortOrder) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onRenameFile: (file: FileItem) => void;
  onDeleteFile: (file: FileItem) => void;
}

function defaultOrderFor(column: ContentsSortBy): SortOrder {
  return column === "updatedAt" ? "desc" : "asc";
}

export function ContentsTable({
  roomId,
  folders,
  files,
  isFetching = false,
  sortBy,
  sortOrder,
  onSortChange,
  onRenameFolder,
  onDeleteFolder,
  onRenameFile,
  onDeleteFile,
}: ContentsTableProps) {
  const handleSort = (column: ContentsSortBy) => {
    const next = nextSortState(column, sortBy, sortOrder, defaultOrderFor);
    onSortChange(next.sortBy, next.sortOrder);
  };

  return (
    <TableContainer
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        opacity: isFetching ? 0.85 : 1,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <SortableHeaderCell
              label="Name"
              column="name"
              activeSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <TableCell width={120}>Type</TableCell>
            <SortableHeaderCell
              label="Size"
              column="size"
              activeSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              width={120}
            />
            <SortableHeaderCell
              label="Updated"
              column="updatedAt"
              activeSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              width={180}
            />
            <TableCell align="right" width={120}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folders.map((folder) => (
            <FolderRow
              key={folder.id}
              roomId={roomId}
              folder={folder}
              onRename={onRenameFolder}
              onDelete={onDeleteFolder}
            />
          ))}
          {files.map((file) => (
            <FileRow
              key={file.id}
              roomId={roomId}
              file={file}
              onRename={onRenameFile}
              onDelete={onDeleteFile}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
