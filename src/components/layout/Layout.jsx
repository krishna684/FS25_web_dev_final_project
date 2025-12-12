import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-shell" style={{ flexDirection: 'column' }}>
      {/* Navbar is persistent at the top */}
      <Navbar />

      <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Sidebar below header */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Area */}
        <main className="app-content" style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--bg-body)'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
