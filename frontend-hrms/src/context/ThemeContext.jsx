import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  // Check local storage for saved theme preference or default to light
  const storedTheme = localStorage.getItem("hrms_theme") || "light";
  const [mode, setMode] = useState(storedTheme);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("hrms_theme", newMode);
          return newMode;
        });
      },
      mode
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1E3A8A" : "#60A5FA", 
          },
          secondary: {
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
          },
          background: {
            default: mode === "light" ? "#F8FAFC" : "#0F172A",
            paper: mode === "light" ? "#FFFFFF" : "#1E293B",
          },
          divider: mode === "light" ? "#E2E8F0" : "#334155",
          text: {
            primary: mode === "light" ? "#0F172A" : "#F8FAFC",
            secondary: mode === "light" ? "#64748B" : "#94A3B8"
          }
        },
        // Custom colors for roles that work in both modes
        roleColors: {
          admin: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#1E3A8A" : "#60A5FA"
          },
          manager: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#1E3A8A" : "#60A5FA"
          },
          hr: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#1E3A8A" : "#60A5FA"
          },
          developer: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#1E3A8A" : "#60A5FA"
          },
          intern: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#1E3A8A" : "#60A5FA"
          }
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          button: {
            textTransform: "none",
            fontWeight: 600
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "background-color 0.2s ease, color 0.2s ease",
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none", 
                boxShadow: mode === "light" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none",
                border: mode === "light" ? "none" : "1px solid #334155",
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              }
            }
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
                color: mode === "light" ? "#0F172A" : "#F8FAFC",
                boxShadow: "none",
                borderBottom: `1px solid ${mode === "light" ? "#E2E8F0" : "#334155"}`,
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#FFFFFF" : "#0F172A",
                borderRight: `1px solid ${mode === "light" ? "#E2E8F0" : "#334155"}`,
              }
            }
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                backgroundColor: mode === "light" ? "#F8FAFC" : "#1E293B",
              }
            }
          }
        }
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}