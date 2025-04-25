import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box
} from "@mui/material";

const VideoCard = ({
  _id,
  title,
  views,
  time,
  user,
  thumbnail,
  avatar // added prop for user avatar
}) => {
  // Build metadata array only with non-empty values
  const metadataItems = [];
  if (views) metadataItems.push(views);
  if (time) metadataItems.push(time);
  const metadata = metadataItems.join(" • ");

  return (
    <Card sx={{ width: '100%', margin: "0" }}>
      <CardActionArea component={Link} to={`/video/v/${_id}`}>
        <CardMedia
          component="img"
          image={thumbnail || '/placeholder-image.jpg'}
          alt={title}
          sx={{ 
            height: 180,
            width: '100%',
            objectFit: 'cover'
          }}
        />
        <CardContent>
          {/* Container for avatar and text details */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            {/* Avatar on the left */}
            <Avatar
              src={avatar}
              alt={user}
              variant="circular" 
              sx={{ width: 40, height: 40, mt: 0.5 }} // slightly move avatar up and set size
            />
            {/* Details on the right: title, user name, metadata */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ fontWeight: 600, mb: 0.01 }} // bold title and small bottom margin
              >
                {title}
              </Typography>
              {/* Channel/user name line */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2}}>
                {user}
              </Typography>
              {/* Render metadata (views and time) below */}
              {metadata && (
                <Typography variant="body2" color="text.secondary">
                  {metadata}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;