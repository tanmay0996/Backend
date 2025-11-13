// src/pages/LikedVideos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline
} from "@mui/material";

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F5DC",  // Beige
      paper: "#ffffff"     // White
    },
    text: {
      primary: "#333333",  // Dark text
      secondary: "#666666" // Gray text
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
});

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/likes/videos`,
          { withCredentials: true }
        );
        setLikedVideos(response?.data?.data || []);
      } catch (err) {
        console.error(err);
        // Show specific message if user is not authenticated
        if (err.response && err.response.status === 401) {
          setError("User is not signed in");
        } else {
          setError("Failed to fetch liked videos");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            bgcolor: "background.default"
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Container sx={{ py: 4 }}>
          <Alert severity="error">
            {error === "User is not signed in" ? (
              <>User is not <Link href="/register">sign in</Link></>
            ) : (
              error
            )}
          </Alert>
        </Container>
      ) : likedVideos.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            bgcolor: "background.default"
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            No liked videos found
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: "background.default",
            minHeight: "100vh",
            py: { xs: 3, sm: 5, md: 8 }
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "text.primary",
                fontWeight: 700,
                mb: { xs: 2, sm: 4 }
              }}
            >
              Liked Videos
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {likedVideos.map(({ likedVideo }) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={likedVideo._id}>
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      border: '1px solid #e0e0e0',
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 4px 20px rgba(227, 83, 54, 0.2)"
                      }
                    }}
                  >
                    <VideoCard
                      _id={likedVideo._id}
                      title={likedVideo.title}
                      views={`${likedVideo.views || 0} Views`}
                      time={
                        likedVideo.createdAt
                          ? new Date(likedVideo.createdAt).toLocaleDateString()
                          : ""
                      }
                      user={likedVideo.ownerDetails?.username || "Unknown"}
                      thumbnail={likedVideo.thumbnail}
                      avatar={likedVideo.ownerDetails?.avatar}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default LikedVideos;
