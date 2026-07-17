import type { DataRoom } from "../../api/types";

export type HomeDialogState =
  | { type: "create" }
  | { type: "rename"; room: DataRoom }
  | { type: "delete"; room: DataRoom }
  | null;

export const homeRowLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
  maxWidth: "100%",
} as const;
