import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as dataroomsApi from "../api/datarooms";
import { createPaginationParams, queryKeys } from "../api/queryKeys";
import { DEFAULT_PAGE_SIZE } from "../api/types";

export function useDataRooms(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  const params = createPaginationParams(page, pageSize);

  return useQuery({
    queryKey: queryKeys.datarooms.list(params),
    queryFn: () => dataroomsApi.listDataRooms(params),
    placeholderData: keepPreviousData,
  });
}

export function useDataRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.datarooms.detail(id),
    queryFn: () => dataroomsApi.getDataRoom(id),
    enabled: Boolean(id),
  });
}

export function useCreateDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => dataroomsApi.createDataRoom(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms.all });
    },
  });
}

export function useRenameDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      dataroomsApi.renameDataRoom(id, name),
    onSuccess: (room) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.datarooms.detail(room.id),
      });
    },
  });
}

export function useDeleteDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataroomsApi.deleteDataRoom(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms.all });
    },
  });
}

export function useFolderContents(
  roomId: string,
  folderId: string | null,
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const params = createPaginationParams(page, pageSize);

  return useQuery({
    queryKey: queryKeys.contents.list(roomId, folderId, params),
    queryFn: () => dataroomsApi.getContents(roomId, folderId, params),
    enabled: Boolean(roomId),
    placeholderData: keepPreviousData,
  });
}
