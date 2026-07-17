import { Alert, Box, CircularProgress } from "@mui/material";

interface PdfViewerProps {
  title: string;
  blobUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function PdfViewer({ title, blobUrl, loading, error }: PdfViewerProps) {
  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!blobUrl) {
    return null;
  }

  return (
    <Box
      component="iframe"
      title={title}
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
  );
}
