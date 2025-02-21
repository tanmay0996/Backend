// src/components/WatchHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/history", {
        withCredentials: true,
      }) // Ensure this endpoint returns videoUrl, desc, thumbnailUrl, etc.
      .then((response) => {
        // Assuming response.data.data contains the array of videos
        setVideos(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch watch history");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading watch history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Watch History</h2>
      <div className="grid grid-cols-1 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="border p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
            <div className="mb-2">
              {video.videoFile ? (
                <video controls className="w-full max-h-64">
                  <source src={video.videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full"
                />
              )}
            </div>
            {video.desc && (
              <p className="text-gray-700 mb-2">{video.description}</p>
            )}
            {video.owner && (
              <div className="flex items-center">
                <img
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>
                  {video.owner.fullName} (@{video.owner.username})
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
