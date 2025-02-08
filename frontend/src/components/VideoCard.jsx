// src/components/VideoCard.js
import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ _id, title, views, time, user, thumbnail }) => {
  return (
    <Link to={`/video/v/${_id}`}>
      <div className="cursor-pointer border p-2 rounded hover:shadow-lg">
        <img src={thumbnail} alt={title} className="w-full h-auto rounded" />
        <div className="mt-2">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-400">{views} • {time}</p>
          <p className="text-xs text-gray-500">{user}</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
