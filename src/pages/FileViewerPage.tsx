import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import { useFile } from "../hooks/useFiles";
import { formatBytes } from "../utils/format";

interface FileViewerPageProps {
  roomId: string;
  fileId: string;
}

export function FileViewerPage({ roomId, fileId }: FileViewerPageProps) {
  const fileQuery = useFile(fileId);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadContent() {
      setLoadingContent(true);
      setContentError(null);
      try {
        const response = await api.get(`/files/${fileId}/content`, {
          responseType: "blob",
        });
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          setContentError(getErrorMessage(error, "Failed to load PDF"));
        }
      } finally {
        if (!cancelled) {
          setLoadingContent(false);
        }
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId]);

  if (fileQuery.isLoading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fileQuery.isError || !fileQuery.data) {
    return (
      <Alert severity="error">
        {getErrorMessage(fileQuery.error, "File not found")}
      </Alert>
    );
  }

  const file = fileQuery.data;

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} size="small">
            All data rooms
          </Button>
        </Link>
        {file.folderId ? (
          <Link
            to="/rooms/$roomId/folders/$folderId"
            params={{ roomId, folderId: file.folderId }}
            style={{ textDecoration: "none" }}
          >
            <Button startIcon={<ArrowBackIcon />} size="small">
              Back to folder
            </Button>
          </Link>
        ) : (
          <Link
            to="/rooms/$roomId"
            params={{ roomId }}
            style={{ textDecoration: "none" }}
          >
            <Button startIcon={<ArrowBackIcon />} size="small">
              Back to folder
            </Button>
          </Link>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">{file.name}</Typography>
        <Typography color="text.secondary">{formatBytes(file.size)}</Typography>
      </Box>

      {loadingContent && (
        <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {contentError && <Alert severity="error">{contentError}</Alert>}

      {blobUrl && !loadingContent && (
        <Box
          component="iframe"
          title={file.name}
          src={blobUrl}
          sx={{
            width: "100%",
            height: "75vh",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        />
      )}
    </Box>
  );
}
