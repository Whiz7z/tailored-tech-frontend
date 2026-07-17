import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Box, Button, Typography } from "@mui/material";
import type { ChangeEvent, RefObject } from "react";

interface ContentsToolbarProps {
  title: string;
  uploadPending?: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onCreateFolder: () => void;
  onUploadClick: () => void;
  onFileSelected: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ContentsToolbar({
  title,
  uploadPending = false,
  fileInputRef,
  onCreateFolder,
  onUploadClick,
  onFileSelected,
}: ContentsToolbarProps) {
  return (
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
          {title}
        </Typography>
        <Typography color="text.secondary">
          Folders and PDF documents in this location
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant="outlined"
          startIcon={<CreateNewFolderOutlinedIcon />}
          onClick={onCreateFolder}
        >
          New folder
        </Button>
        <Button
          variant="contained"
          startIcon={<UploadFileOutlinedIcon />}
          onClick={onUploadClick}
          disabled={uploadPending}
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
  );
}
