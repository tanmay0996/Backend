import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider
} from "@mui/material";

// Tailwind‑inspired dark theme (gray‑900, gray‑800, text-white/gray-400)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111827", // bg-gray-900
      paper: "#1f2937"    // bg-gray-800
    },
    text: {
      primary: "#ffffff", // text-white
      secondary: "#9ca3af"// text-gray-400
    }
  }
});

const RegistrationForm = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    avatar: null,
    coverImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!(formData.avatar instanceof File)) {
      alert("Invalid avatar file. Please select a valid file.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("avatar", formData.avatar);
    if (formData.coverImage instanceof File) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    // Debug: log entries
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/users/register`,
        formDataToSend,
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUser(response.data.data);
        navigate("/");
      } else {
        console.log("Registration failed:", response.data);
        alert("User registration failed");
      }
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred during registration.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Container maxWidth="sm">
          <Box
            component="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Register
            </Typography>

            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { bgcolor: "background.default", color: "text.primary" } }}
            />
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { bgcolor: "background.default", color: "text.primary" } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { bgcolor: "background.default", color: "text.primary" } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { bgcolor: "background.default", color: "text.primary" } }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { bgcolor: "background.default", color: "text.primary" } }}
            />

            {/* Avatar Upload */}
            <Box>
              <Button
                variant="contained"
                component="label"
                sx={{ bgcolor: "purple.600", '&:hover': { bgcolor: "purple.700" } }}
              >
                Select Avatar *
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {formData.avatar && (
                <Typography sx={{ color: 'success.main', mt: 1 }}>
                  {formData.avatar.name}
                </Typography>
              )}
            </Box>

            {/* Cover Image Upload */}
            <Box>
              <Button
                variant="contained"
                component="label"
                sx={{ bgcolor: "purple.600", '&:hover': { bgcolor: "purple.700" } }}
              >
                Select Cover Image
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {formData.coverImage && (
                <Typography sx={{ color: 'success.main', mt: 1 }}>
                  {formData.coverImage.name}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "purple.600", '&:hover': { bgcolor: "purple.700" }, mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RegistrationForm;
