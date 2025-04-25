import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Chip
} from "@mui/material";
import { FaTimes } from "react-icons/fa";

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
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Environment variables:", import.meta.env);
        
        // Prepare request parameters
        const params = { 
          page: 1, 
          limit: 10
        };
        
        // Add search query if present
        if (searchQuery) {
          params.query = searchQuery;
        }
        
        console.log(
          "Making API request to:",
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video`
        );

        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video`,
          { params, withCredentials: true }
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
  }, [searchQuery]); // Re-fetch when search query changes

  const clearSearch = () => {
    navigate('/');
  };

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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                  flexGrow: 1
                }}
              >
                {searchQuery ? 'Search Results' : 'Recommended'}
              </Typography>
              
              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={clearSearch}
                  deleteIcon={<FaTimes />}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    color: 'text.primary',
                    '& .MuiChip-deleteIcon': {
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'text.primary'
                      }
                    }
                  }}
                />
              )}
            </Box>

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
                        // description={video.description}
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
                  {searchQuery 
                    ? `No videos found matching "${searchQuery}"`
                    : "No videos available."
                  }
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