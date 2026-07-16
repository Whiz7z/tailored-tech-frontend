import { api } from "./client";
import type { Folder } from "./types";

export async function createFolder(input: {
  dataRoomId: string;
  parentId?: string | null;
  name: string;
}): Promise<Folder> {
  const { data } = await api.post<Folder>("/folders", input);
  return data;
}

export async function renameFolder(id: string, name: string): Promise<Folder> {
  const { data } = await api.patch<Folder>(`/folders/${id}`, { name });
  return data;
}

export async function deleteFolder(id: string): Promise<void> {
  await api.delete(`/folders/${id}`);
}
