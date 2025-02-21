// src/components/WatchHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import VideoCard from "./VideoCard";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/history", {
        withCredentials: true,
      })
      .then((response) => {
        setVideos(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch watch history");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading watch history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Watch History
      </Typography>
      <Grid container spacing={2}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <VideoCard
              _id={video._id}
              title={video.title}
              views={video.views}
              time={video.time}
              user={video.user}
              thumbnail={video.thumbnail}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WatchHistory;
