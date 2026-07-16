import { api } from "./client";
import type { FileItem } from "./types";

export async function getFile(id: string): Promise<FileItem> {
  const { data } = await api.get<FileItem>(`/files/${id}`);
  return data;
}

export async function uploadFile(input: {
  dataRoomId: string;
  folderId?: string | null;
  file: File;
}): Promise<FileItem> {
  const form = new FormData();
  form.append("file", input.file);
  form.append("dataRoomId", input.dataRoomId);
  if (input.folderId) {
    form.append("folderId", input.folderId);
  }

  const { data } = await api.post<FileItem>("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function renameFile(id: string, name: string): Promise<FileItem> {
  const { data } = await api.patch<FileItem>(`/files/${id}`, { name });
  return data;
}

export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}`);
}

export function getFileContentUrl(id: string): string {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
  return `${base}/files/${id}/content`;
}
