// WatchHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
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

// Tailwind-inspired dark theme (gray-900, gray-800, black accents)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      // bg-gray-900
      default: "#111827",
      // bg-gray-800 (used for cards/papers)
      paper: "#1f2937"
    },
    text: {
      primary: "#ffffff",     // text-white
      secondary: "#9ca3af"    // text-gray-400
    }
  }
});

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/users/history`, {
        withCredentials: true
      })
      .then((res) => {
        setVideos(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        // Show specific message if user is not authenticated
        if (err.response && err.response.status === 401) {
          setError("User is not signed in");
        } else {
          setError("Failed to fetch watch history");
        }
        setLoading(false);
      });
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
              Watch History
            </Typography>

            {videos.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {videos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 20px rgba(255,255,255,0.1)"
                        }
                      }}
                    >
                      <VideoCard
                        _id={video._id}
                        title={video.title}
                        user={video.owner?.username || "Unknown"}
                        thumbnail={video.thumbnail}
                        views={`${video.views || 0} Views`}
                        time={new Date(video.createdAt).toLocaleDateString()}
                        avatar={video.owner?.avatar}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4, bgcolor: "background.default" }}>
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  No watch history found
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default WatchHistory;
