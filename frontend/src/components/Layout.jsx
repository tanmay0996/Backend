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
    <div className="flex h-screen bg-black text-white">
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
            bgcolor: "black",
            color: "white",
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
