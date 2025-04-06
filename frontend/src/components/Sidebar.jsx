// src/components/Sidebar.js
import React, { useState ,useContext} from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { FaHome, FaClock, FaVideo, FaFolder, FaUsers } from "react-icons/fa";
import { PiUploadFill } from "react-icons/pi";
import axios from "axios";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import {AuthContext} from "../context/AuthContext"

const Sidebar = () => {
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  // Replace this with the actual subscriber id from your auth/context
  const { user } = useContext(AuthContext);
  const subscriberId = user?._id;;

  const fetchSubscribedChannels = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/subscriptions/u/${subscriberId}`,
        { withCredentials: true }
      );
      setSubscribedChannels(response.data.data);
    } catch (error) {
      console.error("Error fetching subscribed channels:", error);
    }
  };

  const handleSubscriptionsClick = () => {
    // Toggle the dropdown. If opening and channels haven't been fetched yet, fetch them.
    setShowSubscriptions((prev) => {
      const newValue = !prev;
      if (newValue && subscribedChannels.length === 0) {
        fetchSubscribedChannels();
      }
      return newValue;
    });
  };

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "black",
        color: "white",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
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
          <ListItemButton onClick={handleSubscriptionsClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <FaUsers />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" />
            {showSubscriptions ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={showSubscriptions} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subscribedChannels.length === 0 ? (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="No subscriptions found" />
              </ListItem>
            ) : (
              subscribedChannels.map((item) => (
                <ListItem
                  key={item.subscribedChannel._id}
                  sx={{ pl: 4 }}
                  button
                  component={Link}
                  to={`/channel/${item.subscribedChannel._id}`}
                >
                  <ListItemIcon>
                    <img
                      src={item.subscribedChannel.avatar}
                      alt={item.subscribedChannel.username}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.subscribedChannel.username} />
                </ListItem>
              ))
            )}
          </List>
        </Collapse>
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
