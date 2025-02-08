// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 ">
      <input
        type="text"
        placeholder="Search"
        className="bg-gray-700 text-white px-4 py-2 rounded w-1/2 outline-none"
      />
      <div>
      <Link
          to="/login"
          className="px-4 py-2 bg-gray-600 rounded mr-2 inline-block"
        >
          Login
        </Link>
        {/* <button className="px-4 py-2 bg-blue-500 rounded">Sign up</button> */}
        <Link to="/register"
         className="px-4 py-2 bg-blue-500 rounded"
        >
        Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
