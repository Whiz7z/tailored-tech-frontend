import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as foldersApi from "../api/folders";
import { queryKeys } from "../api/queryKeys";

export function useCreateFolder(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      foldersApi.createFolder({
        dataRoomId: roomId,
        parentId: folderId,
        name,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents.byLocation(roomId, folderId),
      });
    },
  });
}

export function useRenameFolder(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      foldersApi.renameFolder(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents.byLocation(roomId, folderId),
      });
    },
  });
}

export function useDeleteFolder(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.deleteFolder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents.byLocation(roomId, folderId),
      });
    },
  });
}
