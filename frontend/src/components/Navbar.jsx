// src/components/Navbar.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        logout(); // Clear client state
        setShowDropdown(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Treat 401 as "already logged out" on the server side
        logout(); // Clear client state
        setShowDropdown(false);
      } else {
        console.error("Error logging out:", error);
      }
    }
  };
  
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <input
        type="text"
        placeholder="Search"
        className="bg-gray-700 text-white px-4 py-2 rounded w-1/2 outline-none"
      />
      <div>
        {user ? (
          <div className="flex items-center relative">
            <span className="text-white mr-2">{user.fullName}</span>
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg py-2 z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-600 rounded mr-2 inline-block"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-500 rounded inline-block"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
