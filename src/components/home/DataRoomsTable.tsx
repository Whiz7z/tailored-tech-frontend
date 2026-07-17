import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { DataRoom, DataRoomSortBy, SortOrder } from "../../api/types";
import {
  SortableHeaderCell,
  nextSortState,
} from "../common/SortableHeaderCell";
import { DataRoomRow } from "./DataRoomRow";

interface DataRoomsTableProps {
  rooms: DataRoom[];
  isFetching?: boolean;
  sortBy: DataRoomSortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: DataRoomSortBy, sortOrder: SortOrder) => void;
  onRename: (room: DataRoom) => void;
  onDelete: (room: DataRoom) => void;
}

function defaultOrderFor(column: DataRoomSortBy): SortOrder {
  return column === "name" ? "asc" : "desc";
}

export function DataRoomsTable({
  rooms,
  isFetching = false,
  sortBy,
  sortOrder,
  onSortChange,
  onRename,
  onDelete,
}: DataRoomsTableProps) {
  const handleSort = (column: DataRoomSortBy) => {
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
            <SortableHeaderCell
              label="Updated"
              column="updatedAt"
              activeSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              width={200}
            />
            <TableCell align="right" width={120}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <DataRoomRow
              key={room.id}
              room={room}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
