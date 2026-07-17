import { api } from "./client";
import type { Folder } from "./types";
import { parseFolder } from "./validate";

export async function createFolder(input: {
  dataRoomId: string;
  parentId?: string | null;
  name: string;
}): Promise<Folder> {
  const { data } = await api.post("/folders", input);
  return parseFolder(data);
}

export async function renameFolder(id: string, name: string): Promise<Folder> {
  const { data } = await api.patch(`/folders/${id}`, { name });
  return parseFolder(data);
}

export async function deleteFolder(id: string): Promise<void> {
  await api.delete(`/folders/${id}`);
}
