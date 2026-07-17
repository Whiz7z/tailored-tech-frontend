import type { PaginationParams } from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";

export const queryKeys = {
  datarooms: {
    all: ["datarooms"] as const,
    lists: () => [...queryKeys.datarooms.all, "list"] as const,
    list: (params: PaginationParams) =>
      [...queryKeys.datarooms.lists(), params] as const,
    details: () => [...queryKeys.datarooms.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.datarooms.details(), id] as const,
  },
  contents: {
    all: ["contents"] as const,
    lists: () => [...queryKeys.contents.all, "list"] as const,
    list: (
      roomId: string,
      folderId: string | null,
      params: PaginationParams,
    ) => [...queryKeys.contents.lists(), roomId, folderId, params] as const,
    byLocation: (roomId: string, folderId: string | null) =>
      [...queryKeys.contents.lists(), roomId, folderId] as const,
  },
  file: (id: string) => ["file", id] as const,
};

export function createPaginationParams(
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): PaginationParams {
  return {
    page: Math.max(1, page),
    pageSize,
  };
}
