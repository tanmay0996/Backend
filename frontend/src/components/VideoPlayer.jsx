// src/components/VideoPlayer.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; 
import Comments from "../components/Comments"; 
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
        setIsSubscribed(videoData.owner?.isSubscribed || false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Check subscription status only for authenticated users
  useEffect(() => {
    if (user && video && video.owner && !video.owner.hasOwnProperty('isSubscribed')) {
      // Only make this call if the subscription status wasn't included in the video response
      axios
        .get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/subscriptions/u/${user._id}`, {
          withCredentials: true,
        })
        .then((response) => {
          const subscribedChannels = response.data.data;
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
    if (!user) {
      alert("Please sign in to like videos");
      return;
    }

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
      alert("Failed to toggle like. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please sign in to subscribe to channels");
      return;
    }

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
      alert("Failed to toggle subscription. Please try again.");
    }
  };

  if (loading) return <div className="p-4" style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>Loading video...</div>;
  if (error) return <div className="p-4 text-red-500" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</div>;
  if (!video) return <div className="p-4" style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>No video found.</div>;

  return (
    <div className="w-full min-h-screen p-4" style={{ backgroundColor: '#F5F5DC', color: '#333333', fontFamily: 'Inter, sans-serif' }}>
      {/* Video Player */}
      <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: '#000000', border: '2px solid #A0522D' }}>
        <video className="w-full h-96 object-cover" controls>
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Details and Action Buttons */}
      <div className="mt-6 p-4 rounded-lg shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            {video.owner && (
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-12 h-12 rounded-full mr-4 border-2" style={{ borderColor: '#A0522D' }}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#333333', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{video.title}</h1>
              <p className="text-sm" style={{ color: '#666666', fontFamily: 'Inter, sans-serif' }}>
                {new Date(video.createdAt).toLocaleDateString()} • {video.views} Views
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 px-3 py-2 rounded"
              style={{
                backgroundColor: user ? (isLiked ? '#E35336' : '#F4A460') : '#cccccc',
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                cursor: user ? 'pointer' : 'not-allowed',
                opacity: user ? 1 : 0.75
              }}
              disabled={!user}
            >
              <span>{isLiked ? "👍" : "👍"}</span>
              <span>
                Like {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
              </span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 rounded" style={{ backgroundColor: '#F4A460', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              <span>↗</span>
              <span>Share</span>
            </button>
            <button
              onClick={handleSubscribe}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: !user ? '#cccccc' : (isSubscribed ? '#A0522D' : '#E35336'),
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                cursor: user ? 'pointer' : 'not-allowed',
                opacity: user ? 1 : 0.75
              }}
              disabled={!user}
            >
              {!user ? "Sign in to Subscribe" : isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        <p className="mt-4" style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>{video.description}</p>

        {/* Show sign in prompt for non-authenticated users */}
        {!user && (
          <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#FFF8DC', border: '1px solid #E35336' }}>
            <p style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>
              <Link to="/register" style={{ color: '#E35336', textDecoration: 'underline', fontWeight: 600 }}>
                Sign in
              </Link>{" "}
              to like videos, subscribe to channels, and add comments.
            </p>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#333333', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Comments</h2>
        <Comments videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoPlayer;