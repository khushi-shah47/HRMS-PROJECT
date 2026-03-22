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
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
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
        /* Custom Scrollbar - Neutral transparent thumb works in both */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #88888844;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #88888866;
        }
        .page-content::-webkit-scrollbar {
          width: 6px;
        }
        .page-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .page-content::-webkit-scrollbar-thumb {
          background: #88888844;
          border-radius: 3px;
        }
        .page-content::-webkit-scrollbar-thumb:hover {
          background: #88888866;
        }
      `}</style>
    </Box>
  );
}

