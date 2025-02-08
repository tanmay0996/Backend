// src/components/VideoCard.js
import React from "react";

const VideoCard = ({ title, views, time, user, thumbnail }) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <img src={thumbnail} alt={title} className="w-full h-32 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-400">{views} • {time}</p>
      <p className="text-gray-500">{user}</p>
    </div>
  );
};

export default VideoCard;
