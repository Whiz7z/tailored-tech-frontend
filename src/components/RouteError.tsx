import { Alert, Box, Button, Typography } from "@mui/material";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { getErrorMessage } from "../api/client";

export function RouteError({ error, reset }: ErrorComponentProps) {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Something went wrong
      </Typography>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={reset}>
            Try again
          </Button>
        }
        sx={{ mb: 2 }}
      >
        {getErrorMessage(error)}
      </Alert>
      <Button component={Link} to="/" variant="outlined">
        Go to data rooms
      </Button>
    </Box>
  );
}
