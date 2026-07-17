import { api } from "./client";
import type {
  DataRoom,
  FolderContents,
  PaginatedResponse,
  PaginationParams,
} from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";
import {
  parseDataRoom,
  parseFolderContents,
  parsePaginatedDataRooms,
} from "./validate";

export async function listDataRooms(
  params: PaginationParams = { page: 1, pageSize: DEFAULT_PAGE_SIZE },
): Promise<PaginatedResponse<DataRoom>> {
  const { data } = await api.get("/datarooms", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return parsePaginatedDataRooms(data);
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
  params: PaginationParams = { page: 1, pageSize: DEFAULT_PAGE_SIZE },
): Promise<FolderContents> {
  const { data } = await api.get(`/datarooms/${roomId}/contents`, {
    params: {
      ...(folderId ? { folderId } : {}),
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return parseFolderContents(data);
}
