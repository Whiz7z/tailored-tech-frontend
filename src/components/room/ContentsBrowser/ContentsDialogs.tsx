import { ConfirmDialog } from "../../common/ConfirmDialog";
import { NameDialog } from "../../common/NameDialog";
import type { ContentsDialogState } from "./types";

interface ContentsDialogsProps {
  dialog: ContentsDialogState;
  dialogError: string | null;
  createPending: boolean;
  renameFolderPending: boolean;
  deleteFolderPending: boolean;
  renameFilePending: boolean;
  deleteFilePending: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => Promise<void>;
  onRenameFolder: (name: string) => Promise<void>;
  onRenameFile: (name: string) => Promise<void>;
  onDeleteFolder: () => Promise<void>;
  onDeleteFile: () => Promise<void>;
}

export function ContentsDialogs({
  dialog,
  dialogError,
  createPending,
  renameFolderPending,
  deleteFolderPending,
  renameFilePending,
  deleteFilePending,
  onClose,
  onCreateFolder,
  onRenameFolder,
  onRenameFile,
  onDeleteFolder,
  onDeleteFile,
}: ContentsDialogsProps) {
  return (
    <>
      <NameDialog
        open={dialog?.type === "create-folder"}
        title="Create folder"
        confirmLabel="Create"
        loading={createPending}
        error={dialogError}
        onClose={onClose}
        onSubmit={onCreateFolder}
      />

      <NameDialog
        open={dialog?.type === "rename-folder"}
        title="Rename folder"
        initialValue={dialog?.type === "rename-folder" ? dialog.item.name : ""}
        loading={renameFolderPending}
        error={dialogError}
        onClose={onClose}
        onSubmit={onRenameFolder}
      />

      <NameDialog
        open={dialog?.type === "rename-file"}
        title="Rename file"
        initialValue={dialog?.type === "rename-file" ? dialog.item.name : ""}
        loading={renameFilePending}
        error={dialogError}
        onClose={onClose}
        onSubmit={onRenameFile}
      />

      <ConfirmDialog
        open={dialog?.type === "delete-folder"}
        title="Delete folder?"
        description={
          dialog?.type === "delete-folder"
            ? `Delete "${dialog.item.name}" and all nested folders and files? This cannot be undone.`
            : ""
        }
        loading={deleteFolderPending}
        onClose={onClose}
        onConfirm={onDeleteFolder}
      />

      <ConfirmDialog
        open={dialog?.type === "delete-file"}
        title="Delete file?"
        description={
          dialog?.type === "delete-file"
            ? `Delete "${dialog.item.name}"? This cannot be undone.`
            : ""
        }
        loading={deleteFilePending}
        onClose={onClose}
        onConfirm={onDeleteFile}
      />
    </>
  );
}
