import { Box, TableCell, TableSortLabel } from "@mui/material";
import type { ReactNode } from "react";
import type { SortOrder } from "../../api/types";

interface SortableHeaderCellProps<T extends string> {
  label: ReactNode;
  column: T;
  activeSortBy: T;
  sortOrder: SortOrder;
  onSort: (column: T) => void;
  width?: number | string;
  align?: "left" | "right" | "center";
}

export function SortableHeaderCell<T extends string>({
  label,
  column,
  activeSortBy,
  sortOrder,
  onSort,
  width,
  align = "left",
}: SortableHeaderCellProps<T>) {
  const active = activeSortBy === column;

  return (
    <TableCell
      width={width}
      align={align}
      sortDirection={active ? sortOrder : false}
      sx={{ py: 1.25 }}
    >
      <TableSortLabel
        active={active}
        direction={active ? sortOrder : "asc"}
        onClick={() => onSort(column)}
        sx={{
          "&.MuiTableSortLabel-root": {
            color: "text.secondary",
          },
          "&.Mui-active": {
            color: "text.primary",
          },
          "& .MuiTableSortLabel-icon": {
            opacity: active ? 1 : 0.4,
          },
        }}
      >
        <Box component="span" sx={{ fontWeight: 600 }}>
          {label}
        </Box>
      </TableSortLabel>
    </TableCell>
  );
}

/** Click inactive column → sensible default order; click active → toggle. */
export function nextSortState<T extends string>(
  column: T,
  currentSortBy: T,
  currentSortOrder: SortOrder,
  defaultOrderFor: (column: T) => SortOrder = () => "asc",
): { sortBy: T; sortOrder: SortOrder } {
  if (column === currentSortBy) {
    return {
      sortBy: column,
      sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
    };
  }

  return {
    sortBy: column,
    sortOrder: defaultOrderFor(column),
  };
}
