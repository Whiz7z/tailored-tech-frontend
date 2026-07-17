import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
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
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../api/client";
import type { DataRoom } from "../api/types";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { ItemNameWithCounts } from "../components/ItemNameWithCounts";
import { ListPagination } from "../components/ListPagination";
import { NameDialog } from "../components/NameDialog";
import {
  useCreateDataRoom,
  useDataRooms,
  useDeleteDataRoom,
  useRenameDataRoom,
} from "../hooks/useDataRooms";
import { formatDate } from "../utils/format";

const routeApi = getRouteApi("/");

type DialogState =
  | { type: "create" }
  | { type: "rename"; room: DataRoom }
  | { type: "delete"; room: DataRoom }
  | null;

const rowLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
  maxWidth: "100%",
} as const;

export function HomePage() {
  const navigate = useNavigate({ from: "/" });
  const { page } = routeApi.useSearch();
  const { enqueueSnackbar } = useSnackbar();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const roomsQuery = useDataRooms(page);
  const createRoom = useCreateDataRoom();
  const renameRoom = useRenameDataRoom();
  const deleteRoom = useDeleteDataRoom();

  const pagination = roomsQuery.data?.pagination;

  useEffect(() => {
    if (pagination && pagination.page !== page) {
      void navigate({
        search: { page: pagination.page },
        replace: true,
      });
    }
  }, [navigate, page, pagination]);

  const closeDialog = () => {
    setDialog(null);
    setDialogError(null);
  };

  const setPage = (nextPage: number) => {
    void navigate({
      search: { page: nextPage },
    });
  };

  if (roomsQuery.isLoading && !roomsQuery.data) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (roomsQuery.isError && !roomsQuery.data) {
    return <Alert severity="error">{getErrorMessage(roomsQuery.error)}</Alert>;
  }

  const rooms = roomsQuery.data?.items ?? [];
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-end" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Data Rooms
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            Organize acquisition due diligence documents into secure virtual data
            rooms with nested folders and PDF files.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ type: "create" })}
        >
          New data room
        </Button>
      </Box>

      {totalItems === 0 ? (
        <EmptyState
          title="No data rooms yet"
          description="Create your first data room to start uploading folders and PDF documents for due diligence."
          action={
            <Button variant="contained" onClick={() => setDialog({ type: "create" })}>
              Create data room
            </Button>
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
              opacity: roomsQuery.isFetching ? 0.85 : 1,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width={200}>Updated</TableCell>
                  <TableCell align="right" width={120}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id} hover>
                    <TableCell>
                      <Link
                        to="/rooms/$roomId"
                        params={{ roomId: room.id }}
                        search={{ page: 1 }}
                        style={rowLinkStyle}
                      >
                        <ItemNameWithCounts
                          icon={
                            <MeetingRoomOutlinedIcon
                              color="primary"
                              fontSize="small"
                            />
                          }
                          name={room.name}
                          folderCount={room.folderCount}
                          fileCount={room.fileCount}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(room.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rename">
                        <IconButton
                          size="small"
                          onClick={() => setDialog({ type: "rename", room })}
                        >
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDialog({ type: "delete", room })}
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
              isFetching={roomsQuery.isFetching}
            />
          )}
        </>
      )}

      <NameDialog
        open={dialog?.type === "create"}
        title="Create data room"
        label="Data room name"
        confirmLabel="Create"
        loading={createRoom.isPending}
        error={dialogError}
        onClose={closeDialog}
        onSubmit={async (name) => {
          try {
            setDialogError(null);
            const room = await createRoom.mutateAsync(name);
            enqueueSnackbar("Data room created", { variant: "success" });
            closeDialog();
            void navigate({
              to: "/rooms/$roomId",
              params: { roomId: room.id },
              search: { page: 1 },
            });
          } catch (error) {
            setDialogError(getErrorMessage(error));
          }
        }}
      />

      <NameDialog
        open={dialog?.type === "rename"}
        title="Rename data room"
        label="Data room name"
        initialValue={dialog?.type === "rename" ? dialog.room.name : ""}
        loading={renameRoom.isPending}
        error={dialogError}
        onClose={closeDialog}
        onSubmit={async (name) => {
          if (dialog?.type !== "rename") return;
          try {
            setDialogError(null);
            await renameRoom.mutateAsync({ id: dialog.room.id, name });
            enqueueSnackbar("Data room renamed", { variant: "success" });
            closeDialog();
          } catch (error) {
            setDialogError(getErrorMessage(error));
          }
        }}
      />

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="Delete data room?"
        description={
          dialog?.type === "delete"
            ? `Delete "${dialog.room.name}" and all of its folders and files? This cannot be undone.`
            : ""
        }
        loading={deleteRoom.isPending}
        onClose={closeDialog}
        onConfirm={async () => {
          if (dialog?.type !== "delete") return;
          try {
            await deleteRoom.mutateAsync(dialog.room.id);
            enqueueSnackbar("Data room deleted", { variant: "success" });
            closeDialog();
          } catch (error) {
            enqueueSnackbar(getErrorMessage(error), { variant: "error" });
          }
        }}
      />
    </Box>
  );
}
