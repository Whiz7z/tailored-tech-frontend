export type ApiErrorCode =
  | "NOT_FOUND"
  | "DUPLICATE_NAME"
  | "INVALID_FILE_TYPE"
  | "VALIDATION_ERROR"
  | "FILE_TOO_LARGE"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface DataRoom {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  dataRoomId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  dataRoomId: string;
  folderId: string | null;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
  type: "room" | "folder";
}

export interface FolderContents {
  folders: Folder[];
  files: FileItem[];
  breadcrumb: BreadcrumbItem[];
}
