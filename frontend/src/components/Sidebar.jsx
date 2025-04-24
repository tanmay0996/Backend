// src/components/Sidebar.js
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  useMediaQuery
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaClock, FaVideo, FaFolder, FaUsers } from "react-icons/fa";
import { PiUploadFill } from "react-icons/pi";
import axios from "axios";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;

const Sidebar = ({ mobile = false, onClose }) => {
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const { user } = useContext(AuthContext);
  const subscriberId = user?._id;
  const isMobileView = useMediaQuery("(max-width:768px)");
  const location = useLocation();

  useEffect(() => {
    if (showSubscriptions && subscribedChannels.length === 0) fetchSubscribedChannels();
  }, [showSubscriptions]);

  const fetchSubscribedChannels = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/subscriptions/u/${subscriberId}`,
        { withCredentials: true }
      );
      setSubscribedChannels(res.data.data);
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  };

  const handleSubscriptionsClick = () => setShowSubscriptions(prev => !prev);
  const isActive = (path) => path && location.pathname === path;

  // Tailwind‑inspired dark colors
  const colors = {
    bg: "#111827",           // bg-gray-900
    paper: "#1f2937",        // bg-gray-800
    textPrimary: "#ffffff",  // text-white
    textSecondary: "#9ca3af",// text-gray-400
    hover: "#374151",        // bg-gray-700
    selected: "#4b5563",     // bg-gray-600
    uploadBg: "#dc2626",     // bg-red-600
    uploadHover: "#b91c1c"   // bg-red-700
  };

  const menuItems = [
    { icon: <FaHome />, text: "Home", to: "/" },
    { icon: <FaClock />, text: "Liked Videos", to: "/liked-videos" },
    { icon: <FaVideo />, text: "History", to: "/history" },
    { icon: <FaFolder />, text: "My Content", to: null }
  ];

  return (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: colors.bg,
        color: colors.textPrimary,
        height: "100vh",
        p: 2,
        display: mobile && !isMobileView ? "none" : "block",
        borderRight: `1px solid ${colors.hover}`
      }}
      onClick={onClose}
    >
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 4,
          color: colors.textPrimary,
          fontWeight: 600
        }}
      >
        <Box
          sx={{
            bgcolor: colors.textSecondary,
            p: 1,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ▶
        </Box>
        ViewTube
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.to ? Link : "button"}
              to={item.to || undefined}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: isActive(item.to) ? colors.selected : "transparent",
                "&:hover": { bgcolor: colors.hover }
              }}
            >
              <ListItemIcon sx={{ color: colors.textSecondary, minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: colors.textPrimary }} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Subscriptions */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSubscriptionsClick}
            sx={{
              mb: 1,
              borderRadius: 1,
              "&:hover": { bgcolor: colors.hover }
            }}
          >
            <ListItemIcon sx={{ color: colors.textSecondary, minWidth: 36 }}>
              <FaUsers />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" sx={{ color: colors.textPrimary }} />
            {showSubscriptions ? (
              <ExpandLess sx={{ color: colors.textSecondary }} />
            ) : (
              <ExpandMore sx={{ color: colors.textSecondary }} />
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={showSubscriptions} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subscribedChannels.length === 0 ? (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText
                  primary="No subscriptions found"
                  sx={{ color: colors.textSecondary }}
                />
              </ListItem>
            ) : (
              subscribedChannels.map((item) => (
                <ListItem
                  key={item.subscribedChannel._id}
                  component={Link}
                  to={`/channel/${item.subscribedChannel._id}`}
                  disablePadding
                  sx={{ pl: 4, mb: 1 }}
                >
                  <ListItemButton
                    sx={{
                      p: 0,
                      borderRadius: 1,
                      "&:hover": { bgcolor: colors.hover }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box
                        component="img"
                        src={item.subscribedChannel.avatar}
                        alt={item.subscribedChannel.username}
                        sx={{ width: 24, height: 24, borderRadius: "50%" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.subscribedChannel.username}
                      sx={{ color: colors.textPrimary }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Collapse>

        {/* Upload */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/video-upload"
            sx={{
              mt: 2,
              borderRadius: 1,
              bgcolor: colors.uploadBg,
              "&:hover": { bgcolor: colors.uploadHover }
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
              <PiUploadFill />
            </ListItemIcon>
            <ListItemText primary="Upload Video" sx={{ color: "#fff" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
