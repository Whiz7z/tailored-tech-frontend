import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as filesApi from "../api/files";
import { queryKeys } from "../api/queryKeys";

export function useFile(id: string) {
  return useQuery({
    queryKey: queryKeys.file(id),
    queryFn: () => filesApi.getFile(id),
    enabled: Boolean(id),
  });
}

export function useUploadFile(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      filesApi.uploadFile({
        dataRoomId: roomId,
        folderId,
        file,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents(roomId, folderId),
      });
    },
  });
}

export function useRenameFile(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      filesApi.renameFile(id, name),
    onSuccess: (file) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents(roomId, folderId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.file(file.id) });
    },
  });
}

export function useDeleteFile(roomId: string, folderId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filesApi.deleteFile(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contents(roomId, folderId),
      });
      void queryClient.removeQueries({ queryKey: queryKeys.file(id) });
    },
  });
}
