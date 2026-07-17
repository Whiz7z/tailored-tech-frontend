import { Box, Button } from "@mui/material";
import { EmptyState } from "../../common/EmptyState";

interface ContentsEmptyStateProps {
  onCreateFolder: () => void;
  onUploadClick: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function ContentsEmptyState({
  onCreateFolder,
  onUploadClick,
  hasActiveFilters = false,
  onClearFilters,
}: ContentsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <EmptyState
        title="No matching items"
        description="Try a different search term or clear filters to see everything in this folder."
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
      title="This folder is empty"
      description="Create a nested folder or upload a PDF to start organizing due diligence documents."
      action={
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          <Button variant="outlined" onClick={onCreateFolder}>
            New folder
          </Button>
          <Button variant="contained" onClick={onUploadClick}>
            Upload PDF
          </Button>
        </Box>
      }
    />
  );
}
