import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/components/Sidebar.css';
import '../styles/pages/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Bienvenido a Mi Tienda Online</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;