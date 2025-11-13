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
            height: 140,
            width: '100%',
            objectFit: 'cover'
          }}
        />
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Row: Avatar and details */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Avatar
              src={avatar}
              alt={user}
              variant="circular" 
              sx={{ width: 32, height: 32, mt: 0.25, flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                component="div"
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.25, 
                  lineHeight: 1.3,
                  fontSize: '0.875rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mb: 0.25,
                  display: 'block',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user}
              </Typography>
              {metadata && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    mb: description ? 0.5 : 0,
                    display: 'block',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {metadata}
                </Typography>
              )}
              {description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.7rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word'
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