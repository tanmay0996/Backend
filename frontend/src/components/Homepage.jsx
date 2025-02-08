// src/components/Homepage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";

const Homepage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch videos from the backend
    const fetchVideos = async () => {
      try {
        // Calling your getAllVideos endpoint
        const response = await axios.get("http://localhost:8000/api/v1/video", {
          params: {
            page: 1,
            limit: 10,
          },
        });

        // Check if the response has a `docs` property (if you're using a paginate plugin)
        const videoData = response.data.data.docs || response.data.data;
        console.log(videoData)
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="p-4">Loading videos...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Trending Tours</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              _id={video._id}
              title={video.title}
              // Display views (if not available, default to 0 Views)
              views={`${video.views || 0} Views`}
              // Format the createdAt date to a readable format
              time={new Date(video.createdAt).toLocaleDateString()}
              // Assuming your aggregation adds owner details into `ownerDetails`
              user={video.ownerDetails?.username || "Unknown"}
              // The thumbnail field is assumed to be a URL string stored in your video document
              thumbnail={video.thumbnail}
            />
          ))
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
