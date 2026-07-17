import { api } from "./client";
import type {
  ContentsListParams,
  DataRoom,
  DataRoomListParams,
  FolderContents,
  PaginatedResponse,
} from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";
import {
  parseDataRoom,
  parseFolderContents,
  parsePaginatedDataRooms,
} from "./validate";

const defaultDataRoomListParams: DataRoomListParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  q: "",
  sortBy: "updatedAt",
  sortOrder: "desc",
  hasContent: "all",
};

const defaultContentsListParams: ContentsListParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  q: "",
  type: "all",
  sortBy: "name",
  sortOrder: "asc",
};

export async function listDataRooms(
  params: DataRoomListParams = defaultDataRoomListParams,
): Promise<PaginatedResponse<DataRoom>> {
  const { data } = await api.get("/datarooms", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      ...(params.q ? { q: params.q } : {}),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      ...(params.hasContent !== "all" ? { hasContent: params.hasContent } : {}),
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
  params: ContentsListParams = defaultContentsListParams,
): Promise<FolderContents> {
  const { data } = await api.get(`/datarooms/${roomId}/contents`, {
    params: {
      ...(folderId ? { folderId } : {}),
      page: params.page,
      pageSize: params.pageSize,
      ...(params.q ? { q: params.q } : {}),
      ...(params.type !== "all" ? { type: params.type } : {}),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return parseFolderContents(data);
}
