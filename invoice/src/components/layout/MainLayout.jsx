import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content-scroll custom-scrollbar">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
