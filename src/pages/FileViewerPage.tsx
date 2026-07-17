import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { getErrorMessage } from "../api/client";
import { FileViewerNav } from "../components/file/FileViewerNav";
import { PdfViewer } from "../components/file/PdfViewer";
import { useFileViewer } from "../components/file/useFileViewer";
import { formatBytes } from "../utils/format";

interface FileViewerPageProps {
  roomId: string;
  fileId: string;
}

export function FileViewerPage({ roomId, fileId }: FileViewerPageProps) {
  const { fileQuery, blobUrl, contentError, loadingContent } =
    useFileViewer(fileId);

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
      <FileViewerNav roomId={roomId} folderId={file.folderId} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">{file.name}</Typography>
        <Typography color="text.secondary">{formatBytes(file.size)}</Typography>
      </Box>

      <PdfViewer
        title={file.name}
        blobUrl={blobUrl}
        loading={loadingContent}
        error={contentError}
      />
    </Box>
  );
}
