// src/components/Navbar.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        logout(); // Clear client state
        handleMenuClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout(); // Clear client state
        handleMenuClose();
      } else {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          sx={{
            bgcolor: "grey.800",
            borderRadius: 1,
            width: "50%",
            "& .MuiOutlinedInput-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey.700" },
          }}
          InputProps={{
            sx: { color: "white" },
          }}
        />
        <Box>
          {user ? (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2, color: "white" }}>
                {user.fullName}
              </Typography>
              <IconButton onClick={handleAvatarClick}>
                <Avatar src={user.avatar} alt="User Avatar" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ mr: 2, bgcolor: "grey.600" }}
              >
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" color="primary">
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
