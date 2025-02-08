// src/components/Homepage.js
import React from "react";
import VideoCard from "./VideoCard";


const Homepage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Trending Tours</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <VideoCard
          title="Sample"
          views="8 Views"
          time="4 weeks ago"
          user="abcde"
          thumbnail="https://via.placeholder.com/200"
        />
        <VideoCard
          title="First Video"
          views="58 Views"
          time="9 weeks ago"
          user="one"
          thumbnail="https://via.placeholder.com/200"
        />
      </div>
    </div>
  );
};

export default Homepage;
