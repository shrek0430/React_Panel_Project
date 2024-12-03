import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);  

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);  
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth >= 992) {
      setIsSidebarVisible(true);  
    } else {
      setIsSidebarVisible(false);  
    }
  }, [windowWidth]);  

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleLinkClick = () => {
    closeSidebar(); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div
        style={{
          flex: isSidebarVisible || windowWidth >= 992 ? '0 0 16.666%' : '0 0 0%',
          transition: 'flex 0.3s ease',
          display: isSidebarVisible || windowWidth >= 992 ? 'block' : 'none',
          position: windowWidth < 992 ? 'fixed' : 'relative',
          zIndex: 1020,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Sidebar handleLinkClick={handleLinkClick} />
      </div>

      {isSidebarVisible && windowWidth < 992 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1010,
          }}
          onClick={closeSidebar}
        ></div>
      )}

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <Navbar toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div style={{ flex: '1', padding: '20px' }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
