import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider
} from "@mui/material";

// Tailwind‑inspired dark theme (gray‑900, gray‑800, text-white/gray-400)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111827", // bg-gray-900
      paper: "#1f2937"    // bg-gray-800
    },
    text: {
      primary: "#ffffff", // text-white
      secondary: "#9ca3af"// text-gray-400
    }
  }
});

const VideoUpload = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setValue("videoFile", file);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile);
    formData.append("thumbnail", data.thumbnail);

    try {
      setUploading(true);
      setMessage("");
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      setMessage("Video published successfully!");
      reset();
      setVideoFile(null);
      setThumbnailPreview(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("User is not logged in!!!!");
      } else {
        setMessage("Failed to publish video. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          p: 6,
          width: "100%",
          maxWidth: "768px",
          mx: "auto",
          borderRadius: 2,
          boxShadow: 3,
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
          Upload Your Video
        </Typography>

        {/* Video File Upload Section */}
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'grey.600',
            borderRadius: 1,
            p: 4,
            textAlign: 'center',
            '&:hover': { borderColor: 'purple.500' }
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Drag and drop video files to upload
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ bgcolor: 'purple.600', '&:hover': { bgcolor: 'purple.700' } }}
          >
            Select Video
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
            />
          </Button>
          {videoFile && (
            <Typography variant="body2" sx={{ color: 'success.main', mt: 1 }}>
              {videoFile.name}
            </Typography>
          )}
        </Box>

        {/* Thumbnail + Video Info */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4
          }}
        >
          {/* Thumbnail Upload Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Thumbnail *
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grey.600',
                borderRadius: 1,
                height: 160,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Button
                component="label"
                sx={{ width: '100%', height: '100%' }}
              >
                {thumbnailPreview ? (
                  <Box
                    component="img"
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="h2">📷</Typography>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailUpload}
                />
              </Button>
            </Box>
          </Box>

          {/* Title & Description */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Title *
              </Typography>
              <input
                {...register("title", { required: true })}
                placeholder="Enter video title"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description *
              </Typography>
              <textarea
                {...register("description", { required: true })}
                placeholder="Write something about the video"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '4px',
                  color: '#fff',
                  height: '112px',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            sx={{ bgcolor: 'purple.600', '&:hover': { bgcolor: 'purple.700' } }}
          >
            {uploading ? 'Uploading...' : 'Publish'}
          </Button>
        </Box>

        {/* Status Message */}
        {message && (
          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'warning.main', mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default VideoUpload;
