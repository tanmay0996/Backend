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
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/video/v/${videoId}`,
          { withCredentials: true }
        );
        const videoData = response.data.data;
        setVideo(videoData);

        // Initialize like count and status from API response.
        setLikeCount(videoData.likeCount || 0);
        setIsLiked(videoData.isLiked || false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleLike = async () => {
    try {
      // Call the toggle like API endpoint.
      const response = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      // The API is expected to return { data: { isLiked: true/false } }.
      const { isLiked: updatedLikeStatus } = response.data.data;

      // Update the like count based on whether the video is now liked or unliked.
      setLikeCount((prevCount) =>
        updatedLikeStatus ? prevCount + 1 : prevCount - 1
      );
      setIsLiked(updatedLikeStatus);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) return <div className="p-4 text-white">Loading video...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!video) return <div className="p-4 text-white">No video found.</div>;

  return (
    <div className="w-full bg-gray-900 text-white min-h-screen p-4">
      {/* Video Player */}
      <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
        <video className="w-full h-96 object-cover" controls>
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Details and Action Buttons */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            {video.owner && (
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-12 h-12 rounded-full mr-4 border-2 border-gray-700"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <p className="text-gray-400 text-sm">
                {new Date(video.createdAt).toLocaleDateString()} • {video.views} Views
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
            >
              {/* Optionally, update icon appearance based on like state */}
              <span>{isLiked ? "👍" : "👍"}</span>
              <span>
                Like {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
              </span>
            </button>
            <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded">
              <span>↗</span>
              <span>Share</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        <p className="mt-4 text-gray-300">{video.description}</p>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <Comments videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoPlayer;
