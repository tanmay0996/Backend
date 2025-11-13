import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Drawer, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F5F5DC', color: '#333333', fontFamily: 'Inter, sans-serif' }}>
      {!isMobile && <Sidebar />}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            bgcolor: "#F5F5DC",
            color: "#333333",
          },
        }}
      >
        <Sidebar mobile onClose={toggleDrawer} />
      </Drawer>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={toggleDrawer} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
