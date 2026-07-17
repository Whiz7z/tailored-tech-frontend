import { ConfirmDialog } from "../common/ConfirmDialog";
import { NameDialog } from "../common/NameDialog";
import type { HomeDialogState } from "./types";

interface DataRoomsDialogsProps {
  dialog: HomeDialogState;
  dialogError: string | null;
  createPending: boolean;
  renamePending: boolean;
  deletePending: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function DataRoomsDialogs({
  dialog,
  dialogError,
  createPending,
  renamePending,
  deletePending,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: DataRoomsDialogsProps) {
  return (
    <>
      <NameDialog
        open={dialog?.type === "create"}
        title="Create data room"
        label="Data room name"
        confirmLabel="Create"
        loading={createPending}
        error={dialogError}
        onClose={onClose}
        onSubmit={onCreate}
      />

      <NameDialog
        open={dialog?.type === "rename"}
        title="Rename data room"
        label="Data room name"
        initialValue={dialog?.type === "rename" ? dialog.room.name : ""}
        loading={renamePending}
        error={dialogError}
        onClose={onClose}
        onSubmit={onRename}
      />

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="Delete data room?"
        description={
          dialog?.type === "delete"
            ? `Delete "${dialog.room.name}" and all of its folders and files? This cannot be undone.`
            : ""
        }
        loading={deletePending}
        onClose={onClose}
        onConfirm={onDelete}
      />
    </>
  );
}
