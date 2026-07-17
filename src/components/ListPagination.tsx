import { Box, Pagination, Typography } from "@mui/material";
import type { PaginationMeta } from "../api/types";

interface ListPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  isFetching?: boolean;
}

export function ListPagination({
  pagination,
  onPageChange,
  disabled = false,
  isFetching = false,
}: ListPaginationProps) {
  if (pagination.totalItems === 0 || pagination.totalPages <= 1) {
    return null;
  }

  const from = (pagination.page - 1) * pagination.pageSize + 1;
  const to = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        mt: 2,
        opacity: isFetching ? 0.7 : 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {from}–{to} of {pagination.totalItems}
      </Typography>
      <Pagination
        color="primary"
        page={pagination.page}
        count={pagination.totalPages}
        onChange={(_event, page) => onPageChange(page)}
        disabled={disabled || isFetching}
        siblingCount={1}
        boundaryCount={1}
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
