import type { FileItem, Folder } from "../../../api/types";

export type ContentsDialogState =
  | { type: "create-folder" }
  | { type: "rename-folder"; item: Folder }
  | { type: "rename-file"; item: FileItem }
  | { type: "delete-folder"; item: Folder }
  | { type: "delete-file"; item: FileItem }
  | null;

export const contentsRowLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
  maxWidth: "100%",
} as const;
