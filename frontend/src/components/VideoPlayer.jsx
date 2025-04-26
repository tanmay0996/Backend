// src/components/VideoPlayer.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Import Link for navigation
import Comments from "../components/Comments"; // Import the Comments component
import { AuthContext } from "../context/AuthContext";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/video/v/${videoId}`,
          { withCredentials: true }
        );
        const videoData = response.data.data;
        setVideo(videoData);
        setLikeCount(videoData.likeCount || 0);
        setIsLiked(videoData.isLiked || false);
        // Optionally, if your video API returns subscription status, initialize it here:
        // setIsSubscribed(videoData.isSubscribed || false);
      } catch (err) {
        console.error("Error fetching video:", err);
        // Show specific message if user is not authenticated
        if (err.response && err.response.status === 401) {
          setError("User is not signed in");
        } else {
          setError("Failed to load video details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // New useEffect to check subscription status after video data is loaded
  useEffect(() => {
    if (user && video && video.owner) {
      // Call your endpoint to get all channels the user is subscribed to
      axios
        .get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/subscriptions/u/${user._id}`, {
          withCredentials: true,
        })
        .then((response) => {
          const subscribedChannels = response.data.data;
          // Check if the current video's channel is in the user's subscribed channels
          const subscribed = subscribedChannels.some(
            (item) => item.subscribedChannel._id === video.owner._id
          );
          setIsSubscribed(subscribed);
        })
        .catch((err) => {
          console.error("Error checking subscription status:", err);
        });
    }
  }, [user, video]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      const { isLiked: updatedLikeStatus } = response.data.data;
      setLikeCount((prevCount) =>
        updatedLikeStatus ? prevCount + 1 : prevCount - 1
      );
      setIsLiked(updatedLikeStatus);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/subscriptions/c/${video.owner._id}`,
        {},
        { withCredentials: true }
      );
      console.log("Toggled subscription for channel:", video.owner._id);
      console.log("Current subscription status:", response.data.data.subscribed);
      setIsSubscribed(response.data.data.subscribed);
    } catch (err) {
      console.error("Error toggling subscription:", err);
    }
  };

  if (loading) return <div className="p-4 text-white">Loading video...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        {error === "User is not signed in" ? (
          <>User is not <Link to="/register">sign in</Link></>
        ) : (
          error
        )}
      </div>
    );
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
              <span>{isLiked ? "👍" : "👍"}</span>
              <span>
                Like {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
              </span>
            </button>
            <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded">
              <span>↗</span>
              <span>Share</span>
            </button>
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-full ${
                isSubscribed ? "bg-gray-600 hover:bg-gray-500" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
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
