import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";

interface DataRoomsHeaderProps {
  onCreate: () => void;
}

export function DataRoomsHeader({ onCreate }: DataRoomsHeaderProps) {
  return (
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
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
        New data room
      </Button>
    </Box>
  );
}
