import { api } from "./client";
import type { DataRoom, FolderContents } from "./types";
import {
  parseDataRoom,
  parseDataRooms,
  parseFolderContents,
} from "./validate";

export async function listDataRooms(): Promise<DataRoom[]> {
  const { data } = await api.get("/datarooms");
  return parseDataRooms(data);
}

export async function getDataRoom(id: string): Promise<DataRoom> {
  const { data } = await api.get(`/datarooms/${id}`);
  return parseDataRoom(data);
}

export async function createDataRoom(name: string): Promise<DataRoom> {
  const { data } = await api.post("/datarooms", { name });
  return parseDataRoom(data);
}

export async function renameDataRoom(id: string, name: string): Promise<DataRoom> {
  const { data } = await api.patch(`/datarooms/${id}`, { name });
  return parseDataRoom(data);
}

export async function deleteDataRoom(id: string): Promise<void> {
  await api.delete(`/datarooms/${id}`);
}

export async function getContents(
  roomId: string,
  folderId: string | null,
): Promise<FolderContents> {
  const { data } = await api.get(`/datarooms/${roomId}/contents`, {
    params: folderId ? { folderId } : undefined,
  });
  return parseFolderContents(data);
}
