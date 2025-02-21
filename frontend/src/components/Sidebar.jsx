// src/components/Sidebar.js
import React from "react";
import { FaHome, FaClock, FaVideo, FaFolder, FaUsers, } from "react-icons/fa";
import { PiUploadFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-900 p-5">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-purple-500 p-2 rounded">▶</span> YouTube
      </h1>
      <ul className="mt-5 space-y-3">
        {/* <li className="bg-purple-600 p-2 rounded flex items-center gap-2">
          <FaHome /> Home
        </li> */}
        <li>
          <Link to="/"
          className="bg-purple-600 p-2 rounded flex items-center gap-2"
          >
          <FaHome />Home
          </Link>
        </li>
        <li >

          <Link
            to="/liked-videos"
            className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded"
          >
            <FaClock /> Liked Videos
          </Link>
        </li>
        <li>
  <Link
    to="/history"
    className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded"
  >
    <FaVideo /> History
  </Link>
</li>

        <li className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded">
          <FaFolder /> My Content
        </li>
        <li className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded">
          <FaUsers /> Subscriptions
        </li>
        
      
        <li>
          <Link to="/video-upload"
          className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded"
          >
          <PiUploadFill/>Upload-Video
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
