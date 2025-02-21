// src/components/Sidebar.js
import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FaHome, FaClock, FaVideo, FaFolder, FaUsers } from "react-icons/fa";
import { PiUploadFill } from "react-icons/pi";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "grey.900",
        color: "white",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Box sx={{ bgcolor: "purple.500", p: 1, borderRadius: "4px" }}>▶</Box>
        YouTube
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ bgcolor: "purple.600", borderRadius: 1 }}>
            <ListItemIcon sx={{ color: "white" }}>
              <FaHome />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/liked-videos">
            <ListItemIcon sx={{ color: "white" }}>
              <FaClock />
            </ListItemIcon>
            <ListItemText primary="Liked Videos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/history">
            <ListItemIcon sx={{ color: "white" }}>
              <FaVideo />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <FaFolder />
            </ListItemIcon>
            <ListItemText primary="My Content" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <FaUsers />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/video-upload">
            <ListItemIcon sx={{ color: "white" }}>
              <PiUploadFill />
            </ListItemIcon>
            <ListItemText primary="Upload Video" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
