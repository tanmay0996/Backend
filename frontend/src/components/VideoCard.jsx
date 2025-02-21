// src/components/VideoCard.js
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

const VideoCard = ({ _id, title, views, time, user, thumbnail }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "auto" }}>
      <CardActionArea component={Link} to={`/video/v/${_id}`}>
        <CardMedia
          component="img"
          image={thumbnail}
          alt={title}
          sx={{ height: 180 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {views} • {time}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;
