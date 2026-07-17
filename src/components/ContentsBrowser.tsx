import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ApiError, getErrorMessage } from "../api/client";
import type { FileItem, Folder } from "../api/types";
import { ensureArray } from "../api/validate";
import { useFolderContents } from "../hooks/useDataRooms";
import { useDeleteFile, useRenameFile, useUploadFile } from "../hooks/useFiles";
import {
  useCreateFolder,
  useDeleteFolder,
  useRenameFolder,
} from "../hooks/useFolders";
import { formatBytes, formatDate } from "../utils/format";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";
import { FolderBreadcrumbs } from "./FolderBreadcrumbs";
import { ItemNameWithCounts } from "./ItemNameWithCounts";
import { ListPagination } from "./ListPagination";
import { NameDialog } from "./NameDialog";

interface ContentsBrowserProps {
  roomId: string;
  folderId: string | null;
  page: number;
}

type DialogState =
  | { type: "create-folder" }
  | { type: "rename-folder"; item: Folder }
  | { type: "rename-file"; item: FileItem }
  | { type: "delete-folder"; item: Folder }
  | { type: "delete-file"; item: FileItem }
  | null;

const rowLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
  maxWidth: "100%",
} as const;

export function ContentsBrowser({ roomId, folderId, page }: ContentsBrowserProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const contentsQuery = useFolderContents(roomId, folderId, page);
  const createFolder = useCreateFolder(roomId, folderId);
  const renameFolder = useRenameFolder(roomId, folderId);
  const deleteFolder = useDeleteFolder(roomId, folderId);
  const uploadFile = useUploadFile(roomId, folderId);
  const renameFile = useRenameFile(roomId, folderId);
  const deleteFile = useDeleteFile(roomId, folderId);

  const pagination = contentsQuery.data?.pagination;

  useEffect(() => {
    if (pagination && pagination.page !== page) {
      if (folderId) {
        void navigate({
          to: "/rooms/$roomId/folders/$folderId",
          params: { roomId, folderId },
          search: { page: pagination.page },
          replace: true,
        });
      } else {
        void navigate({
          to: "/rooms/$roomId",
          params: { roomId },
          search: { page: pagination.page },
          replace: true,
        });
      }
    }
  }, [navigate, page, pagination, roomId, folderId]);

  const setPage = (nextPage: number) => {
    if (folderId) {
      void navigate({
        to: "/rooms/$roomId/folders/$folderId",
        params: { roomId, folderId },
        search: { page: nextPage },
      });
    } else {
      void navigate({
        to: "/rooms/$roomId",
        params: { roomId },
        search: { page: nextPage },
      });
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogError(null);
  };

  const handleApiError = (error: unknown) => {
    const message = getErrorMessage(error);
    if (error instanceof ApiError && error.code === "DUPLICATE_NAME") {
      setDialogError(message);
      return;
    }
    enqueueSnackbar(message, { variant: "error" });
    closeDialog();
  };

  const onUploadClick = () => fileInputRef.current?.click();

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      enqueueSnackbar("Only PDF files are allowed", { variant: "error" });
      return;
    }

    try {
      await uploadFile.mutateAsync(file);
      enqueueSnackbar(`Uploaded ${file.name}`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  if (contentsQuery.isLoading && !contentsQuery.data) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (contentsQuery.isError && !contentsQuery.data) {
    return (
      <Alert severity="error">{getErrorMessage(contentsQuery.error)}</Alert>
    );
  }

  if (!contentsQuery.data) {
    return (
      <Alert severity="error">
        Folder contents are unavailable. Check VITE_API_URL and try again.
      </Alert>
    );
  }

  const { folders, files, breadcrumb } = contentsQuery.data;
  const safeFolders = ensureArray(folders);
  const safeFiles = ensureArray(files);
  const safeBreadcrumb = ensureArray(breadcrumb);
  const totalItems = pagination?.totalItems ?? 0;
  const isEmpty = totalItems === 0;

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Link to="/" search={{ page: 1 }} style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} size="small">
            All data rooms
          </Button>
        </Link>
      </Box>

      <FolderBreadcrumbs roomId={roomId} items={safeBreadcrumb} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {safeBreadcrumb[safeBreadcrumb.length - 1]?.name ?? "Contents"}
          </Typography>
          <Typography color="text.secondary">
            Folders and PDF documents in this location
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderOutlinedIcon />}
            onClick={() => setDialog({ type: "create-folder" })}
          >
            New folder
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadFileOutlinedIcon />}
            onClick={onUploadClick}
            disabled={uploadFile.isPending}
          >
            Upload PDF
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={onFileSelected}
          />
        </Box>
      </Box>

      {isEmpty ? (
        <EmptyState
          title="This folder is empty"
          description="Create a nested folder or upload a PDF to start organizing due diligence documents."
          action={
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setDialog({ type: "create-folder" })}
              >
                New folder
              </Button>
              <Button variant="contained" onClick={onUploadClick}>
                Upload PDF
              </Button>
            </Box>
          }
        />
      ) : (
        <>
          <TableContainer
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              opacity: contentsQuery.isFetching ? 0.85 : 1,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width={120}>Type</TableCell>
                  <TableCell width={120}>Size</TableCell>
                  <TableCell width={180}>Updated</TableCell>
                  <TableCell align="right" width={120}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safeFolders.map((folder) => (
                  <TableRow key={folder.id} hover>
                    <TableCell>
                      <Link
                        to="/rooms/$roomId/folders/$folderId"
                        params={{ roomId, folderId: folder.id }}
                        search={{ page: 1 }}
                        style={rowLinkStyle}
                      >
                        <ItemNameWithCounts
                          icon={
                            <FolderOutlinedIcon color="primary" fontSize="small" />
                          }
                          name={folder.name}
                          folderCount={folder.folderCount}
                          fileCount={folder.fileCount}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>Folder</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>{formatDate(folder.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rename">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDialog({ type: "rename-folder", item: folder })
                          }
                        >
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDialog({ type: "delete-folder", item: folder })
                          }
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {safeFiles.map((file) => (
                  <TableRow key={file.id} hover>
                    <TableCell>
                      <Link
                        to="/rooms/$roomId/files/$fileId"
                        params={{ roomId, fileId: file.id }}
                        style={rowLinkStyle}
                      >
                        <DescriptionOutlinedIcon
                          color="secondary"
                          fontSize="small"
                        />
                        <span>{file.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{formatDate(file.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rename">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDialog({ type: "rename-file", item: file })
                          }
                        >
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDialog({ type: "delete-file", item: file })
                          }
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination && (
            <ListPagination
              pagination={pagination}
              onPageChange={setPage}
              isFetching={contentsQuery.isFetching}
            />
          )}
        </>
      )}

      <NameDialog
        open={dialog?.type === "create-folder"}
        title="Create folder"
        confirmLabel="Create"
        loading={createFolder.isPending}
        error={dialogError}
        onClose={closeDialog}
        onSubmit={async (name) => {
          try {
            setDialogError(null);
            await createFolder.mutateAsync(name);
            enqueueSnackbar("Folder created", { variant: "success" });
            closeDialog();
          } catch (error) {
            handleApiError(error);
          }
        }}
      />

      <NameDialog
        open={dialog?.type === "rename-folder"}
        title="Rename folder"
        initialValue={dialog?.type === "rename-folder" ? dialog.item.name : ""}
        loading={renameFolder.isPending}
        error={dialogError}
        onClose={closeDialog}
        onSubmit={async (name) => {
          if (dialog?.type !== "rename-folder") return;
          try {
            setDialogError(null);
            await renameFolder.mutateAsync({ id: dialog.item.id, name });
            enqueueSnackbar("Folder renamed", { variant: "success" });
            closeDialog();
          } catch (error) {
            handleApiError(error);
          }
        }}
      />

      <NameDialog
        open={dialog?.type === "rename-file"}
        title="Rename file"
        initialValue={dialog?.type === "rename-file" ? dialog.item.name : ""}
        loading={renameFile.isPending}
        error={dialogError}
        onClose={closeDialog}
        onSubmit={async (name) => {
          if (dialog?.type !== "rename-file") return;
          try {
            setDialogError(null);
            const nextName = name.toLowerCase().endsWith(".pdf")
              ? name
              : `${name}.pdf`;
            await renameFile.mutateAsync({ id: dialog.item.id, name: nextName });
            enqueueSnackbar("File renamed", { variant: "success" });
            closeDialog();
          } catch (error) {
            handleApiError(error);
          }
        }}
      />

      <ConfirmDialog
        open={dialog?.type === "delete-folder"}
        title="Delete folder?"
        description={
          dialog?.type === "delete-folder"
            ? `Delete "${dialog.item.name}" and all nested folders and files? This cannot be undone.`
            : ""
        }
        loading={deleteFolder.isPending}
        onClose={closeDialog}
        onConfirm={async () => {
          if (dialog?.type !== "delete-folder") return;
          try {
            await deleteFolder.mutateAsync(dialog.item.id);
            enqueueSnackbar("Folder deleted", { variant: "success" });
            closeDialog();
          } catch (error) {
            enqueueSnackbar(getErrorMessage(error), { variant: "error" });
          }
        }}
      />

      <ConfirmDialog
        open={dialog?.type === "delete-file"}
        title="Delete file?"
        description={
          dialog?.type === "delete-file"
            ? `Delete "${dialog.item.name}"? This cannot be undone.`
            : ""
        }
        loading={deleteFile.isPending}
        onClose={closeDialog}
        onConfirm={async () => {
          if (dialog?.type !== "delete-file") return;
          try {
            await deleteFile.mutateAsync(dialog.item.id);
            enqueueSnackbar("File deleted", { variant: "success" });
            closeDialog();
            if (window.location.pathname.includes(`/files/${dialog.item.id}`)) {
              if (folderId) {
                void navigate({
                  to: "/rooms/$roomId/folders/$folderId",
                  params: { roomId, folderId },
                  search: { page: 1 },
                });
              } else {
                void navigate({
                  to: "/rooms/$roomId",
                  params: { roomId },
                  search: { page: 1 },
                });
              }
            }
          } catch (error) {
            enqueueSnackbar(getErrorMessage(error), { variant: "error" });
          }
        }}
      />
    </Box>
  );
}
