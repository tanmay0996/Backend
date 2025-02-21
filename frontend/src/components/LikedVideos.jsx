// frontend/src/components/LikedVideos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/likes/videos", {
          withCredentials: true,
        });
        console.log("API response:", response.data);
        
        // The aggregation returns an array of objects with { likedVideo: { ... } }
        const videos = response?.data?.data || [];
        setLikedVideos(videos);
      } catch (err) {
        setError("Failed to fetch liked videos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!Array.isArray(likedVideos)) return <div>No videos available</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 ">Liked Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedVideos.map(({ likedVideo }) => (
          <VideoCard
            key={likedVideo._id}
            _id={likedVideo._id}
            title={likedVideo.title}
            views={`${likedVideo.views || 0} Views`}
            // Use createdAt if it exists; fallback to an empty string to avoid invalid dates
            time={
              likedVideo.createdAt
                ? new Date(likedVideo.createdAt).toLocaleDateString()
                : ""
            }
            user={likedVideo.ownerDetails?.username || "Unknown"}
            // If thumbnail is an object, use thumbnail.url(it's not a obj in my case)
            thumbnail={likedVideo.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
