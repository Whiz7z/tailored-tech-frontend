import { api } from "./client";
import type { DataRoom, FolderContents } from "./types";

export async function listDataRooms(): Promise<DataRoom[]> {
  const { data } = await api.get<DataRoom[]>("/datarooms");
  return data;
}

export async function getDataRoom(id: string): Promise<DataRoom> {
  const { data } = await api.get<DataRoom>(`/datarooms/${id}`);
  return data;
}

export async function createDataRoom(name: string): Promise<DataRoom> {
  const { data } = await api.post<DataRoom>("/datarooms", { name });
  return data;
}

export async function renameDataRoom(id: string, name: string): Promise<DataRoom> {
  const { data } = await api.patch<DataRoom>(`/datarooms/${id}`, { name });
  return data;
}

export async function deleteDataRoom(id: string): Promise<void> {
  await api.delete(`/datarooms/${id}`);
}

export async function getContents(
  roomId: string,
  folderId: string | null,
): Promise<FolderContents> {
  const { data } = await api.get<FolderContents>(`/datarooms/${roomId}/contents`, {
    params: folderId ? { folderId } : undefined,
  });
  return data;
}
