import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import type {
  DataRoom,
  DataRoomHasContent,
  DataRoomSortBy,
  SortOrder,
} from "../../api/types";
import {
  useCreateDataRoom,
  useDataRooms,
  useDeleteDataRoom,
  useRenameDataRoom,
} from "../../hooks/useDataRooms";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import {
  DEFAULT_CONTENTS_SEARCH,
  DEFAULT_HOME_SEARCH,
  homeSearchToListParams,
  type HomeSearch,
} from "../../utils/search";
import type { HomeDialogState } from "./types";

const routeApi = getRouteApi("/");

export function useHomePage() {
  const navigate = useNavigate({ from: "/" });
  const search = routeApi.useSearch();
  const { enqueueSnackbar } = useSnackbar();
  const [dialog, setDialog] = useState<HomeDialogState>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search.q);
  const debouncedQ = useDebouncedValue(searchInput.trim(), 300);

  const roomsQuery = useDataRooms(homeSearchToListParams(search));
  const createRoom = useCreateDataRoom();
  const renameRoom = useRenameDataRoom();
  const deleteRoom = useDeleteDataRoom();
  const pagination = roomsQuery.data?.pagination;

  useEffect(() => {
    setSearchInput(search.q);
  }, [search.q]);

  useEffect(() => {
    if (debouncedQ === search.q) return;
    void navigate({
      search: { ...search, q: debouncedQ, page: 1 },
      replace: true,
    });
  }, [debouncedQ, navigate, search]);

  useEffect(() => {
    if (pagination && pagination.page !== search.page) {
      void navigate({
        search: { ...search, page: pagination.page },
        replace: true,
      });
    }
  }, [navigate, pagination, search]);

  const updateSearch = (patch: Partial<HomeSearch>) => {
    void navigate({
      search: {
        ...search,
        ...patch,
        page: patch.page ?? 1,
      },
    });
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogError(null);
  };

  const setPage = (nextPage: number) => {
    void navigate({ search: { ...search, page: nextPage } });
  };

  const onCreate = async (name: string) => {
    try {
      setDialogError(null);
      const room = await createRoom.mutateAsync(name);
      enqueueSnackbar("Data room created", { variant: "success" });
      closeDialog();
      void navigate({
        to: "/rooms/$roomId",
        params: { roomId: room.id },
        search: DEFAULT_CONTENTS_SEARCH,
      });
    } catch (error) {
      setDialogError(getErrorMessage(error));
    }
  };

  const onRename = async (name: string) => {
    if (dialog?.type !== "rename") return;
    try {
      setDialogError(null);
      await renameRoom.mutateAsync({ id: dialog.room.id, name });
      enqueueSnackbar("Data room renamed", { variant: "success" });
      closeDialog();
    } catch (error) {
      setDialogError(getErrorMessage(error));
    }
  };

  const onDelete = async () => {
    if (dialog?.type !== "delete") return;
    try {
      await deleteRoom.mutateAsync(dialog.room.id);
      enqueueSnackbar("Data room deleted", { variant: "success" });
      closeDialog();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  const hasActiveFilters =
    Boolean(search.q) ||
    search.hasContent !== DEFAULT_HOME_SEARCH.hasContent ||
    search.sortBy !== DEFAULT_HOME_SEARCH.sortBy ||
    search.sortOrder !== DEFAULT_HOME_SEARCH.sortOrder;

  return {
    roomsQuery,
    pagination,
    rooms: roomsQuery.data?.items ?? [],
    totalItems: pagination?.totalItems ?? 0,
    hasActiveFilters,
    searchInput,
    search,
    dialog,
    dialogError,
    createRoom,
    renameRoom,
    deleteRoom,
    setPage,
    setSearchInput,
    setSort: (sortBy: DataRoomSortBy, sortOrder: SortOrder) =>
      updateSearch({ sortBy, sortOrder }),
    setHasContent: (hasContent: DataRoomHasContent) =>
      updateSearch({ hasContent }),
    clearFilters: () =>
      void navigate({ search: DEFAULT_HOME_SEARCH }),
    closeDialog,
    onCreate,
    onRename,
    onDelete,
    openCreate: () => setDialog({ type: "create" }),
    openRename: (room: DataRoom) => setDialog({ type: "rename", room }),
    openDelete: (room: DataRoom) => setDialog({ type: "delete", room }),
  };
}
