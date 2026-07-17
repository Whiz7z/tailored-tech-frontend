import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { getErrorMessage } from "../../../api/client";
import { ListFilters } from "../../common/ListFilters";
import { ListPagination } from "../../common/ListPagination";
import { DEFAULT_HOME_SEARCH, type ContentsSearch } from "../../../utils/search";
import { FolderBreadcrumbs } from "../FolderBreadcrumbs";
import { ContentsDialogs } from "./ContentsDialogs";
import { ContentsEmptyState } from "./ContentsEmptyState";
import { ContentsTable } from "./ContentsTable";
import { ContentsToolbar } from "./ContentsToolbar";
import { useContentsBrowser } from "./useContentsBrowser";

const TYPE_FILTER_OPTIONS = [
  { value: "all" as const, label: "All items" },
  { value: "folder" as const, label: "Folders only" },
  { value: "file" as const, label: "Files only" },
];

interface ContentsBrowserProps {
  roomId: string;
  folderId: string | null;
  search: ContentsSearch;
}

export function ContentsBrowser({
  roomId,
  folderId,
  search,
}: ContentsBrowserProps) {
  const browser = useContentsBrowser({ roomId, folderId, search });

  if (browser.contentsQuery.isLoading && !browser.contentsQuery.data) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (browser.contentsQuery.isError && !browser.contentsQuery.data) {
    return (
      <Alert severity="error">
        {getErrorMessage(browser.contentsQuery.error)}
      </Alert>
    );
  }

  if (!browser.contentsQuery.data) {
    return (
      <Alert severity="error">
        Folder contents are unavailable. Check VITE_API_URL and try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Link to="/" search={DEFAULT_HOME_SEARCH} style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} size="small">
            All data rooms
          </Button>
        </Link>
      </Box>

      <FolderBreadcrumbs roomId={roomId} items={browser.breadcrumb} />

      <ContentsToolbar
        title={browser.title}
        uploadPending={browser.uploadFile.isPending}
        fileInputRef={browser.fileInputRef}
        onCreateFolder={browser.openCreateFolder}
        onUploadClick={browser.onUploadClick}
        onFileSelected={browser.onFileSelected}
      />

      <ListFilters
        search={browser.searchInput}
        searchPlaceholder="Search folders and files…"
        onSearchChange={browser.setSearchInput}
        filterValue={browser.search.type}
        filterLabel="Type"
        filterOptions={TYPE_FILTER_OPTIONS}
        onFilterChange={browser.setType}
      />

      {browser.isEmpty ? (
        <ContentsEmptyState
          onCreateFolder={browser.openCreateFolder}
          onUploadClick={browser.onUploadClick}
          hasActiveFilters={browser.hasActiveFilters}
          onClearFilters={browser.clearFilters}
        />
      ) : (
        <>
          <ContentsTable
            roomId={roomId}
            folders={browser.folders}
            files={browser.files}
            isFetching={browser.contentsQuery.isFetching}
            sortBy={browser.search.sortBy}
            sortOrder={browser.search.sortOrder}
            onSortChange={browser.setSort}
            onRenameFolder={browser.openRenameFolder}
            onDeleteFolder={browser.openDeleteFolder}
            onRenameFile={browser.openRenameFile}
            onDeleteFile={browser.openDeleteFile}
          />
          {browser.pagination && (
            <ListPagination
              pagination={browser.pagination}
              onPageChange={browser.setPage}
              isFetching={browser.contentsQuery.isFetching}
            />
          )}
        </>
      )}

      <ContentsDialogs
        dialog={browser.dialog}
        dialogError={browser.dialogError}
        createPending={browser.createFolder.isPending}
        renameFolderPending={browser.renameFolder.isPending}
        deleteFolderPending={browser.deleteFolder.isPending}
        renameFilePending={browser.renameFile.isPending}
        deleteFilePending={browser.deleteFile.isPending}
        onClose={browser.closeDialog}
        onCreateFolder={browser.onCreateFolder}
        onRenameFolder={browser.onRenameFolder}
        onRenameFile={browser.onRenameFile}
        onDeleteFolder={browser.onDeleteFolder}
        onDeleteFile={browser.onDeleteFile}
      />
    </Box>
  );
}
