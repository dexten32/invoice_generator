import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import SetupPasswordModal from '../auth/SetupPasswordModal/SetupPasswordModal';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="app-layout">
      <SetupPasswordModal />
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main 
        className="main-content-scroll custom-scrollbar"
        style={{ 
          transition: 'all 0.25s ease',
        }}
      >
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
