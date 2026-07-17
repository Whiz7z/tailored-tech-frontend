import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as dataroomsApi from "../api/datarooms";
import { queryKeys } from "../api/queryKeys";
import type { ContentsListParams, DataRoomListParams } from "../api/types";

export function useDataRooms(params: DataRoomListParams) {
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
  params: ContentsListParams,
) {
  return useQuery({
    queryKey: queryKeys.contents.list(roomId, folderId, params),
    queryFn: () => dataroomsApi.getContents(roomId, folderId, params),
    enabled: Boolean(roomId),
    placeholderData: keepPreviousData,
  });
}
