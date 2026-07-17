import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";
import { Link } from "@tanstack/react-router";
import {
  DEFAULT_CONTENTS_SEARCH,
  DEFAULT_HOME_SEARCH,
} from "../../utils/search";

interface FileViewerNavProps {
  roomId: string;
  folderId: string | null;
}

export function FileViewerNav({ roomId, folderId }: FileViewerNavProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      <Link to="/" search={DEFAULT_HOME_SEARCH} style={{ textDecoration: "none" }}>
        <Button startIcon={<ArrowBackIcon />} size="small">
          All data rooms
        </Button>
      </Link>
      {folderId ? (
        <Link
          to="/rooms/$roomId/folders/$folderId"
          params={{ roomId, folderId }}
          search={DEFAULT_CONTENTS_SEARCH}
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
          search={DEFAULT_CONTENTS_SEARCH}
          style={{ textDecoration: "none" }}
        >
          <Button startIcon={<ArrowBackIcon />} size="small">
            Back to folder
          </Button>
        </Link>
      )}
    </Box>
  );
}
