import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1F4B3F",
      contrastText: "#F7F4EF",
    },
    secondary: {
      main: "#C45C26",
    },
    background: {
      default: "#F3EFE7",
      paper: "#FFFCF8",
    },
    text: {
      primary: "#1C1A17",
      secondary: "#5C574F",
    },
    divider: "rgba(28, 26, 23, 0.12)",
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
