import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
  InputAdornment
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaClock, FaVideo, FaFolder, FaUsers, FaSearch } from "react-icons/fa";
import { PiUploadFill } from "react-icons/pi";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  // Add state for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleProfileClick = (e) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setMenuAnchor(e.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Clear user context
    logout();
    // Close menus/drawers
    handleMenuClose();
    setDrawerOpen(false);
    // Force redirect to register
    // Using window.location to ensure full navigation
    window.location.replace('/register');
  };

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Navigate to homepage with search query
      navigate(`/home?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const colors = {
    appBar: "#111827",        // bg-gray-900
    searchBg: "#1f2937",      // bg-gray-800
    searchBorder: "#374151",  // border-gray-700
    drawerBg: "#111827",      // bg-gray-900
    divider: "#374151",       // border-gray-700
    textPrimary: "#ffffff",   // text-white
    textSecondary: "#9ca3af", // text-gray-400
    hover: "#374151",         // bg-gray-700
    uploadBg: "#dc2626",      // bg-red-600
    uploadHover: "#b91c1c"    // bg-red-700
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: colors.appBar, boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ width: isMobile ? '100%' : '50%' }}>
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
              sx={{
                bgcolor: colors.searchBg,
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: colors.searchBorder },
                  '&:hover fieldset': { borderColor: colors.searchBorder },
                  '&.Mui-focused fieldset': { borderColor: colors.searchBorder }
                }
              }}
              InputProps={{
                sx: { color: colors.textPrimary },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      sx={{ color: colors.textSecondary }}
                      onClick={() => navigate(`/?query=${encodeURIComponent(searchTerm)}`)}
                    >
                      {/* <FaSearch size={16}/> */}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {user && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                sx={{
                  color: colors.textPrimary,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {user.fullName}
              </Typography>
              <IconButton
                onClick={handleProfileClick}
                sx={{ p: 0, cursor: 'pointer' }}
              >
                <Avatar src={user.avatar} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Desktop "Logout" menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 250,
              bgcolor: colors.drawerBg,
              color: colors.textPrimary,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }
          }}
        >
          <Box>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={user?.avatar} />
              <Typography sx={{ color: colors.textPrimary }}>{user?.fullName}</Typography>
            </Box>
            <Divider sx={{ bgcolor: colors.divider }} />

            <List>
              {[
                { icon: <FaHome />, text: 'Home', to: '/home' },
                { icon: <FaClock />, text: 'Liked Videos', to: '/liked-videos' },
                { icon: <FaVideo />, text: 'History', to: '/history' },
                { icon: <FaFolder />, text: 'My Content', to: null },
                { icon: <FaUsers />, text: 'Subscriptions', to: null },
                { icon: <PiUploadFill />, text: 'Upload Video', to: '/video-upload' }
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={item.to ? Link : 'button'}
                    to={item.to || undefined}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: 'transparent',
                      '&:hover': { bgcolor: colors.hover }
                    }}
                  >
                    <ListItemIcon sx={{ color: colors.textSecondary, minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ color: item.text === 'Upload Video' ? '#fff' : colors.textPrimary }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Divider sx={{ bgcolor: colors.divider }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ '&:hover': { bgcolor: colors.hover } }}>
                <ListItemText
                  primary="Logout"
                  sx={{ textAlign: 'center', color: '#f44336' }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
