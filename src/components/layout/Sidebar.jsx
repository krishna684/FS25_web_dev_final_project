import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const sidebarWidth = isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)";

  const NavItem = ({ to, icon: Icon, label, exact = false }) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
        ${isActive ? 'bg-[var(--primary)] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
      `}
      style={({ isActive }) => ({
        backgroundColor: isActive ? 'var(--primary)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-secondary)'
      })}
    >
      <Icon size={20} />
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className="sidebar flex flex-col justify-between"
      style={{
        width: sidebarWidth,
        transition: 'width 0.3s ease',
        background: 'var(--bg-sidebar)',
        color: 'white',
        height: 'calc(100vh - var(--header-height))',
        borderRight: '1px solid var(--border)'
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-4">

        {/* Personal Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs uppercase text-gray-500 font-bold mb-3 px-3 tracking-wider">
              Personal
            </h3>
          )}
          <nav className="flex flex-col gap-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/tasks" icon={CheckSquare} label="My Tasks" />
            <NavItem to="/calendar" icon={CalendarIcon} label="Calendar" />
          </nav>
        </div>

        {/* Team Section */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2 px-3">
              <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                Teams
              </h3>
              <button className="text-gray-400 hover:text-white">
                <Plus size={14} />
              </button>
            </div>
          )}
          <nav className="flex flex-col gap-1">
            <NavItem to="/teams" icon={Users} label="All Teams" />
            {/* Can map actual teams here later */}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800">
        <nav className="flex flex-col gap-1 mb-4">
          <NavItem to="/notifications" icon={Bell} label="Notifications" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <NavItem to="/help" icon={HelpCircle} label="Help & Docs" />
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded hover:bg-gray-800 text-gray-400"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
