import { useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ApiError, getErrorMessage } from "../../../api/client";
import type {
  ContentsSortBy,
  ContentsTypeFilter,
  FileItem,
  Folder,
  SortOrder,
} from "../../../api/types";
import { ensureArray } from "../../../api/validate";
import { useFolderContents } from "../../../hooks/useDataRooms";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useDeleteFile, useRenameFile, useUploadFile } from "../../../hooks/useFiles";
import {
  useCreateFolder,
  useDeleteFolder,
  useRenameFolder,
} from "../../../hooks/useFolders";
import {
  DEFAULT_CONTENTS_SEARCH,
  contentsSearchToListParams,
  type ContentsSearch,
} from "../../../utils/search";
import type { ContentsDialogState } from "./types";

interface UseContentsBrowserArgs {
  roomId: string;
  folderId: string | null;
  search: ContentsSearch;
}

export function useContentsBrowser({
  roomId,
  folderId,
  search,
}: UseContentsBrowserArgs) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState<ContentsDialogState>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search.q);
  const debouncedQ = useDebouncedValue(searchInput.trim(), 300);

  const contentsQuery = useFolderContents(
    roomId,
    folderId,
    contentsSearchToListParams(search),
  );
  const createFolder = useCreateFolder(roomId, folderId);
  const renameFolder = useRenameFolder(roomId, folderId);
  const deleteFolder = useDeleteFolder(roomId, folderId);
  const uploadFile = useUploadFile(roomId, folderId);
  const renameFile = useRenameFile(roomId, folderId);
  const deleteFile = useDeleteFile(roomId, folderId);

  const pagination = contentsQuery.data?.pagination;

  const navigateSearch = (next: ContentsSearch, replace = false) => {
    if (folderId) {
      void navigate({
        to: "/rooms/$roomId/folders/$folderId",
        params: { roomId, folderId },
        search: next,
        replace,
      });
      return;
    }

    void navigate({
      to: "/rooms/$roomId",
      params: { roomId },
      search: next,
      replace,
    });
  };

  useEffect(() => {
    setSearchInput(search.q);
  }, [search.q]);

  useEffect(() => {
    if (debouncedQ === search.q) return;
    navigateSearch({ ...search, q: debouncedQ, page: 1 }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigateSearch depends on room/folder
  }, [debouncedQ, search.q]);

  useEffect(() => {
    if (!pagination || pagination.page === search.page) return;
    navigateSearch({ ...search, page: pagination.page }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.page, search.page]);

  const updateSearch = (patch: Partial<ContentsSearch>) => {
    navigateSearch({
      ...search,
      ...patch,
      page: patch.page ?? 1,
    });
  };

  const setPage = (nextPage: number) => {
    navigateSearch({ ...search, page: nextPage });
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogError(null);
  };

  const handleApiError = (error: unknown) => {
    const message = getErrorMessage(error);
    if (error instanceof ApiError && error.code === "DUPLICATE_NAME") {
      setDialogError(message);
      return;
    }
    enqueueSnackbar(message, { variant: "error" });
    closeDialog();
  };

  const onUploadClick = () => fileInputRef.current?.click();

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      enqueueSnackbar("Only PDF files are allowed", { variant: "error" });
      return;
    }

    try {
      await uploadFile.mutateAsync(file);
      enqueueSnackbar(`Uploaded ${file.name}`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  const onCreateFolder = async (name: string) => {
    try {
      setDialogError(null);
      await createFolder.mutateAsync(name);
      enqueueSnackbar("Folder created", { variant: "success" });
      closeDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const onRenameFolder = async (name: string) => {
    if (dialog?.type !== "rename-folder") return;
    try {
      setDialogError(null);
      await renameFolder.mutateAsync({ id: dialog.item.id, name });
      enqueueSnackbar("Folder renamed", { variant: "success" });
      closeDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const onRenameFile = async (name: string) => {
    if (dialog?.type !== "rename-file") return;
    try {
      setDialogError(null);
      const nextName = name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
      await renameFile.mutateAsync({ id: dialog.item.id, name: nextName });
      enqueueSnackbar("File renamed", { variant: "success" });
      closeDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const onDeleteFolder = async () => {
    if (dialog?.type !== "delete-folder") return;
    try {
      await deleteFolder.mutateAsync(dialog.item.id);
      enqueueSnackbar("Folder deleted", { variant: "success" });
      closeDialog();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  const onDeleteFile = async () => {
    if (dialog?.type !== "delete-file") return;
    try {
      await deleteFile.mutateAsync(dialog.item.id);
      enqueueSnackbar("File deleted", { variant: "success" });
      closeDialog();

      if (!window.location.pathname.includes(`/files/${dialog.item.id}`)) {
        return;
      }

      navigateSearch({ ...DEFAULT_CONTENTS_SEARCH });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  const folders = ensureArray(contentsQuery.data?.folders);
  const files = ensureArray(contentsQuery.data?.files);
  const breadcrumb = ensureArray(contentsQuery.data?.breadcrumb);
  const title = breadcrumb[breadcrumb.length - 1]?.name ?? "Contents";
  const totalItems = pagination?.totalItems ?? 0;

  const hasActiveFilters =
    Boolean(search.q) ||
    search.type !== DEFAULT_CONTENTS_SEARCH.type ||
    search.sortBy !== DEFAULT_CONTENTS_SEARCH.sortBy ||
    search.sortOrder !== DEFAULT_CONTENTS_SEARCH.sortOrder;

  return {
    fileInputRef,
    dialog,
    dialogError,
    contentsQuery,
    createFolder,
    renameFolder,
    deleteFolder,
    uploadFile,
    renameFile,
    deleteFile,
    pagination,
    folders,
    files,
    breadcrumb,
    title,
    isEmpty: totalItems === 0,
    hasActiveFilters,
    searchInput,
    search,
    setDialog,
    setPage,
    setSearchInput,
    setType: (type: ContentsTypeFilter) => updateSearch({ type }),
    setSort: (sortBy: ContentsSortBy, sortOrder: SortOrder) =>
      updateSearch({ sortBy, sortOrder }),
    clearFilters: () => navigateSearch(DEFAULT_CONTENTS_SEARCH),
    closeDialog,
    onUploadClick,
    onFileSelected,
    onCreateFolder,
    onRenameFolder,
    onRenameFile,
    onDeleteFolder,
    onDeleteFile,
    openCreateFolder: () => setDialog({ type: "create-folder" }),
    openRenameFolder: (item: Folder) => setDialog({ type: "rename-folder", item }),
    openDeleteFolder: (item: Folder) => setDialog({ type: "delete-folder", item }),
    openRenameFile: (item: FileItem) => setDialog({ type: "rename-file", item }),
    openDeleteFile: (item: FileItem) => setDialog({ type: "delete-file", item }),
  };
}
