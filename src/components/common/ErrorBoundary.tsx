import { Alert, Box, Button, Typography } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { getErrorMessage } from "../../api/client";

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI crash prevented by ErrorBoundary:", error, info);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {this.props.title ?? "Something went wrong"}
          </Typography>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={this.reset}>
                Try again
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {getErrorMessage(this.state.error)}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => {
              this.reset();
              window.location.assign("/");
            }}
          >
            Go to data rooms
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
