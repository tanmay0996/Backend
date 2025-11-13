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
  avatar,
  description
}) => {
  // Build metadata array only with non-empty values
  const metadataItems = [];
  if (views) metadataItems.push(views);
  if (time) metadataItems.push(time);
  const metadata = metadataItems.join(" • ");

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea component={Link} to={`/video/v/${_id}`}>  
        <CardMedia
          component="img"
          image={thumbnail?.url || thumbnail}
          alt={title}
          sx={{ 
            height: 180,
            width: '100%',
            objectFit: 'cover'
          }}
        />
        <CardContent>
          {/* Row: Avatar and details */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar
              src={avatar}
              alt={user}
              variant="circular" 
              sx={{ width: 40, height: 40, mt: 0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.2 }}
                noWrap
              >
                {title}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }} noWrap>
                {user}
              </Typography>

              {metadata && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: description ? 1 : 0 }}
                  noWrap
                >
                  {metadata}
                </Typography>
              )}

              {description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {description}
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
