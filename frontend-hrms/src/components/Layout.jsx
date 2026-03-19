import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "background.default", minHeight: "100vh" }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Topbar onMenuClick={handleDrawerToggle} />

        <Box 
          sx={{ 
            p: 3, 
            maxWidth: 1400, 
            margin: "auto", 
            width: "100%",
            mt: { xs: 8, md: 0 },
            backgroundColor: "background.paper",
            flexGrow: 1,
            overflow: "auto"
          }}
          className="page-content"
        >
          <Outlet />
        </Box>
      </Box>

      {/* Global Scrollbar Styles */}
      <style>{`
        /* Dynamic Theme Scrollbars */
        :root {
          --scrollbar-track-light: #f1f1f1;
          --scrollbar-thumb-light: #c1c1c1;
          --scrollbar-thumb-hover-light: #a1a1a1;
          --scrollbar-track-dark: #334155;
          --scrollbar-thumb-dark: #64748b;
          --scrollbar-thumb-hover-dark: #94a3b8;
          --scrollbar-accent: #60a5fa;
        }
        [data-mui-color-scheme="light"] {
          --scrollbar-track: var(--scrollbar-track-light);
          --scrollbar-thumb: var(--scrollbar-thumb-light);
          --scrollbar-thumb-hover: var(--scrollbar-thumb-hover-light);
        }
        [data-mui-color-scheme="dark"] {
          --scrollbar-track: var(--scrollbar-track-dark);
          --scrollbar-thumb: var(--scrollbar-thumb-dark);
          --scrollbar-thumb-hover: var(--scrollbar-thumb-hover-dark);
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }
        .page-content::-webkit-scrollbar {
          width: 6px;
        }
        .page-content::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
        }
        .page-content::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 3px;
        }
        .page-content::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }
      `}</style>
    </Box>
  );
}
