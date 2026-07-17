import type {
  ContentsListParams,
  ContentsSortBy,
  ContentsTypeFilter,
  DataRoomHasContent,
  DataRoomListParams,
  DataRoomSortBy,
  SortOrder,
} from "../api/types";
import { DEFAULT_PAGE_SIZE } from "../api/types";

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

const SORT_ORDERS = ["asc", "desc"] as const;
const DATA_ROOM_SORT_BY = ["name", "createdAt", "updatedAt"] as const;
const HAS_CONTENT = ["all", "withContent", "empty"] as const;
const CONTENTS_TYPES = ["all", "folder", "file"] as const;
const CONTENTS_SORT_BY = ["name", "updatedAt", "size"] as const;

export type HomeSearch = Omit<DataRoomListParams, "pageSize">;

export const DEFAULT_HOME_SEARCH: HomeSearch = {
  page: 1,
  q: "",
  sortBy: "updatedAt",
  sortOrder: "desc",
  hasContent: "all",
};

export function parseHomeSearch(search: Record<string, unknown>): HomeSearch {
  return {
    page: parsePositiveInt(search.page, 1),
    q: parseString(search.q).trim().slice(0, 200),
    sortBy: parseEnum<DataRoomSortBy>(
      search.sortBy,
      DATA_ROOM_SORT_BY,
      "updatedAt",
    ),
    sortOrder: parseEnum<SortOrder>(search.sortOrder, SORT_ORDERS, "desc"),
    hasContent: parseEnum<DataRoomHasContent>(
      search.hasContent,
      HAS_CONTENT,
      "all",
    ),
  };
}

export type ContentsSearch = Omit<ContentsListParams, "pageSize">;

export const DEFAULT_CONTENTS_SEARCH: ContentsSearch = {
  page: 1,
  q: "",
  type: "all",
  sortBy: "name",
  sortOrder: "asc",
};

export function parseContentsSearch(
  search: Record<string, unknown>,
): ContentsSearch {
  return {
    page: parsePositiveInt(search.page, 1),
    q: parseString(search.q).trim().slice(0, 200),
    type: parseEnum<ContentsTypeFilter>(search.type, CONTENTS_TYPES, "all"),
    sortBy: parseEnum<ContentsSortBy>(
      search.sortBy,
      CONTENTS_SORT_BY,
      "name",
    ),
    sortOrder: parseEnum<SortOrder>(search.sortOrder, SORT_ORDERS, "asc"),
  };
}

export function homeSearchToListParams(
  search: HomeSearch,
  pageSize = DEFAULT_PAGE_SIZE,
): DataRoomListParams {
  return { ...search, pageSize };
}

export function contentsSearchToListParams(
  search: ContentsSearch,
  pageSize = DEFAULT_PAGE_SIZE,
): ContentsListParams {
  return { ...search, pageSize };
}
