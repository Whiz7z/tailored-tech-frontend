import { Alert, Box, CircularProgress } from "@mui/material";
import { getErrorMessage } from "../api/client";
import { ListFilters } from "../components/common/ListFilters";
import { ListPagination } from "../components/common/ListPagination";
import { DataRoomsDialogs } from "../components/home/DataRoomsDialogs";
import { DataRoomsEmptyState } from "../components/home/DataRoomsEmptyState";
import { DataRoomsHeader } from "../components/home/DataRoomsHeader";
import { DataRoomsTable } from "../components/home/DataRoomsTable";
import { useHomePage } from "../components/home/useHomePage";

const CONTENT_FILTER_OPTIONS = [
  { value: "all" as const, label: "All rooms" },
  { value: "withContent" as const, label: "With content" },
  { value: "empty" as const, label: "Empty" },
];

export function HomePage() {
  const home = useHomePage();

  if (home.roomsQuery.isLoading && !home.roomsQuery.data) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (home.roomsQuery.isError && !home.roomsQuery.data) {
    return <Alert severity="error">{getErrorMessage(home.roomsQuery.error)}</Alert>;
  }

  return (
    <Box>
      <DataRoomsHeader onCreate={home.openCreate} />

      <ListFilters
        search={home.searchInput}
        searchPlaceholder="Search data rooms…"
        onSearchChange={home.setSearchInput}
        filterValue={home.search.hasContent}
        filterLabel="Content"
        filterOptions={CONTENT_FILTER_OPTIONS}
        onFilterChange={home.setHasContent}
      />

      {home.totalItems === 0 ? (
        <DataRoomsEmptyState
          onCreate={home.openCreate}
          hasActiveFilters={home.hasActiveFilters}
          onClearFilters={home.clearFilters}
        />
      ) : (
        <>
          <DataRoomsTable
            rooms={home.rooms}
            isFetching={home.roomsQuery.isFetching}
            sortBy={home.search.sortBy}
            sortOrder={home.search.sortOrder}
            onSortChange={home.setSort}
            onRename={home.openRename}
            onDelete={home.openDelete}
          />
          {home.pagination && (
            <ListPagination
              pagination={home.pagination}
              onPageChange={home.setPage}
              isFetching={home.roomsQuery.isFetching}
            />
          )}
        </>
      )}

      <DataRoomsDialogs
        dialog={home.dialog}
        dialogError={home.dialogError}
        createPending={home.createRoom.isPending}
        renamePending={home.renameRoom.isPending}
        deletePending={home.deleteRoom.isPending}
        onClose={home.closeDialog}
        onCreate={home.onCreate}
        onRename={home.onRename}
        onDelete={home.onDelete}
      />
    </Box>
  );
}
