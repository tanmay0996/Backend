// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {/* The Outlet renders the matched child route component */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
