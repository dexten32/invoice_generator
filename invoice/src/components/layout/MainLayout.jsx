import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative custom-scrollbar">
        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-full page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
