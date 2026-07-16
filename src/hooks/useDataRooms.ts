import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as dataroomsApi from "../api/datarooms";
import { queryKeys } from "../api/queryKeys";

export function useDataRooms() {
  return useQuery({
    queryKey: queryKeys.datarooms,
    queryFn: dataroomsApi.listDataRooms,
  });
}

export function useDataRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.dataroom(id),
    queryFn: () => dataroomsApi.getDataRoom(id),
    enabled: Boolean(id),
  });
}

export function useCreateDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => dataroomsApi.createDataRoom(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms });
    },
  });
}

export function useRenameDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      dataroomsApi.renameDataRoom(id, name),
    onSuccess: (room) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dataroom(room.id) });
    },
  });
}

export function useDeleteDataRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataroomsApi.deleteDataRoom(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.datarooms });
    },
  });
}

export function useFolderContents(roomId: string, folderId: string | null) {
  return useQuery({
    queryKey: queryKeys.contents(roomId, folderId),
    queryFn: () => dataroomsApi.getContents(roomId, folderId),
    enabled: Boolean(roomId),
  });
}
