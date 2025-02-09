// src/components/VideoPlayer.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comments from "./Comments"; // Import the Comments component

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/video/v/${videoId}`,
          { withCredentials: true }
        );
        setVideo(response.data.data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <div className="p-4">Loading video...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!video) return <div className="p-4">No video found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="w-full bg-black rounded-lg overflow-hidden">
        <video className="w-full h-96 p-1" controls>
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Details */}
      <div className="mt-4 p-2">
        {video.owner && (
          <div className="flex items-center mb-2">
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="w-10 h-10 rounded-full mr-2"
            />
            <span className="text-lg font-bold">{video.owner.username}</span>
          </div>
        )}

        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-500">
          {new Date(video.createdAt).toLocaleDateString()} • {video.views} Views
        </p>
        <p className="mt-2 text-gray-700">{video.description}</p>
      </div>

      {/* Comments Section */}
      <Comments videoId={videoId} />
    </div>
  );
};

export default VideoPlayer;
