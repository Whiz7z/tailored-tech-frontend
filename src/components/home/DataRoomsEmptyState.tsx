import { Button } from "@mui/material";
import { EmptyState } from "../common/EmptyState";

interface DataRoomsEmptyStateProps {
  onCreate: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function DataRoomsEmptyState({
  onCreate,
  hasActiveFilters = false,
  onClearFilters,
}: DataRoomsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <EmptyState
        title="No matching data rooms"
        description="Try a different search term, clear filters, or create a new data room."
        action={
          <Button variant="outlined" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      title="No data rooms yet"
      description="Create your first data room to start uploading folders and PDF documents for due diligence."
      action={
        <Button variant="contained" onClick={onCreate}>
          Create data room
        </Button>
      }
    />
  );
}
