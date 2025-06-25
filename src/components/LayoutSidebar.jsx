import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/components/Sidebar.css';
import '../styles/pages/Home.css';

const LayoutSidebar = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutSidebar;