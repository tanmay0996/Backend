import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline
} from "@mui/material";

// Tailwind‑inspired dark theme (gray‑900, gray‑800, text-white/gray-400)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111827",  // bg-gray-900
      paper: "#1f2937"     // bg-gray-800
    },
    text: {
      primary: "#ffffff",  // text-white
      secondary: "#9ca3af" // text-gray-400
    }
  }
});

const Homepage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Environment variables:", import.meta.env);
        console.log(
          "Making API request to:",
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video`
        );

        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video`,
          { params: { page: 1, limit: 10 }, withCredentials: true }
        );

        console.log("Full response:", response);
        console.log("Response data:", response.data);

        if (!response.data || !response.data.data) {
          console.error("Unexpected response structure", response.data);
          setVideos([]);
        } else {
          const videoData = response.data.data.docs || response.data.data;
          console.log("Processed video data:", videoData);
          setVideos(videoData);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        console.log(
          "Error details:",
          error.response ? error.response.data : "No response"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
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
              Recommended
            </Typography>

            {videos.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {videos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video._id}>
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        '&:hover': {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 20px rgba(255,255,255,0.1)"
                        }
                      }}
                    >
                      <VideoCard
                        _id={video._id}
                        title={video.title}
                        views={`${video.views || 0} Views`}
                        time={new Date(video.createdAt).toLocaleDateString()}
                        user={video.ownerDetails?.username || "Unknown"}
                        thumbnail={video.thumbnail}
                        avatar={video.ownerDetails?.avatar}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4, bgcolor: "background.default" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "text.secondary" }}
                >
                  No videos available.
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Homepage;
