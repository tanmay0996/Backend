import React from "react";
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

const VideoCard = ({ _id, title, views, time, user, thumbnail }) => {
  // Build metadata array only with non-empty values
  const metadataItems = [];
  if (views) metadataItems.push(views);
  if (time) metadataItems.push(time);
  const metadata = metadataItems.join(" • ");

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
          {/* Render metadata line only if there is content */}
          {metadata && (
            <Typography variant="body2" color="text.secondary">
              {metadata}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {user}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;
