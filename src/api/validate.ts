import { ApiError } from "./errors";
import type {
  BreadcrumbItem,
  DataRoom,
  FileItem,
  Folder,
  FolderContents,
  PaginatedResponse,
  PaginationMeta,
} from "./types";

function invalid(message: string): never {
  throw new ApiError("INTERNAL_ERROR", message);
}

export function assertObject(
  value: unknown,
  label: string,
): asserts value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    invalid(`Invalid ${label} response from API. Check VITE_API_URL.`);
  }
}

export function assertArray<T>(
  value: unknown,
  label: string,
  itemGuard: (item: unknown) => item is T,
): T[] {
  if (!Array.isArray(value)) {
    invalid(`Invalid ${label} response from API. Check VITE_API_URL.`);
  }
  if (!value.every(itemGuard)) {
    invalid(`Invalid ${label} items from API.`);
  }
  return value;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export function isDataRoom(value: unknown): value is DataRoom {
  if (value === null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    isString(item.name) &&
    isString(item.createdAt) &&
    isString(item.updatedAt) &&
    isNumber(item.folderCount) &&
    isNumber(item.fileCount)
  );
}

export function isFolder(value: unknown): value is Folder {
  if (value === null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    isString(item.name) &&
    isString(item.dataRoomId) &&
    isNullableString(item.parentId) &&
    isString(item.createdAt) &&
    isString(item.updatedAt) &&
    isNumber(item.folderCount) &&
    isNumber(item.fileCount)
  );
}

export function isFileItem(value: unknown): value is FileItem {
  if (value === null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    isString(item.name) &&
    isString(item.dataRoomId) &&
    isNullableString(item.folderId) &&
    isString(item.mimeType) &&
    isNumber(item.size) &&
    isString(item.createdAt) &&
    isString(item.updatedAt)
  );
}

export function isBreadcrumbItem(value: unknown): value is BreadcrumbItem {
  if (value === null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isNullableString(item.id) &&
    isString(item.name) &&
    (item.type === "room" || item.type === "folder")
  );
}

export function isPaginationMeta(value: unknown): value is PaginationMeta {
  if (value === null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isNumber(item.page) &&
    isNumber(item.pageSize) &&
    isNumber(item.totalItems) &&
    isNumber(item.totalPages) &&
    isBoolean(item.hasNextPage) &&
    isBoolean(item.hasPreviousPage)
  );
}

export function parseDataRoom(value: unknown): DataRoom {
  if (!isDataRoom(value)) {
    invalid("Invalid data room response from API.");
  }
  return value;
}

export function parsePaginatedDataRooms(
  value: unknown,
): PaginatedResponse<DataRoom> {
  assertObject(value, "paginated data rooms");
  return {
    items: assertArray(value.items, "data rooms list", isDataRoom),
    pagination: parsePaginationMeta(value.pagination),
  };
}

export function parsePaginationMeta(value: unknown): PaginationMeta {
  if (!isPaginationMeta(value)) {
    invalid("Invalid pagination metadata from API.");
  }
  return value;
}

export function parseFolder(value: unknown): Folder {
  if (!isFolder(value)) {
    invalid("Invalid folder response from API.");
  }
  return value;
}

export function parseFileItem(value: unknown): FileItem {
  if (!isFileItem(value)) {
    invalid("Invalid file response from API.");
  }
  return value;
}

export function parseFolderContents(value: unknown): FolderContents {
  assertObject(value, "folder contents");
  return {
    folders: assertArray(value.folders, "folders", isFolder),
    files: assertArray(value.files, "files", isFileItem),
    breadcrumb: assertArray(value.breadcrumb, "breadcrumb", isBreadcrumbItem),
    pagination: parsePaginationMeta(value.pagination),
  };
}

export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}
