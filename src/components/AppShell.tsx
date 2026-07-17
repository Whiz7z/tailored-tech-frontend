import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 500px at 10% -10%, rgba(31,75,63,0.14), transparent 55%), radial-gradient(900px 420px at 90% 0%, rgba(196,92,38,0.12), transparent 50%), linear-gradient(180deg, #F7F2E8 0%, #EDE6D8 100%)",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,252,248,0.86)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            Acme Data Room
          </Typography>
          <Box
            component={Link}
            to="/"
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": { color: "text.primary" },
            }}
          >
            All data rooms
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
