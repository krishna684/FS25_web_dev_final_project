import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import teamApi from "../../api/teams";
import { useAuth } from "../../context/AuthContext";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const sidebarWidth = isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Fetch user's teams
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await teamApi.getAll();
        setTeams(res.data || []);
      } catch (err) {
        console.error('Failed to fetch teams for sidebar', err);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

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
      title={isCollapsed ? label : ''}
    >
      <Icon size={20} />
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className="sidebar flex flex-col justify-between transition-all duration-300"
      style={{
        width: sidebarWidth,
        background: 'var(--bg-sidebar)',
        color: 'white',
        height: 'calc(100vh - var(--header-height))',
        borderRight: '1px solid var(--border)'
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-4 overflow-y-auto">

        {/* User Profile Card - Only show when not collapsed */}
        {!isCollapsed && user && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 transition-all duration-200 hover:border-gray-600 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Online status */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
              </div>
            </div>
          </div>
        )}

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
              <button
                className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                onClick={() => navigate('/teams')}
                title="Create new team"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          <nav className="flex flex-col gap-1">
            {/* User's Individual Teams (2-3 max) */}
            {!loadingTeams && teams.length > 0 && teams.slice(0, 3).map((team) => (
              <NavLink
                key={team._id}
                to={`/teams/${team._id}`}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                  ${isActive ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)'
                })}
                title={isCollapsed ? team.name : ''}
              >
                <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{team.name}</span>
                    {team.members && (
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {team.members.length}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}

            {/* Loading state */}
            {loadingTeams && !isCollapsed && (
              <div className="px-3 py-2 text-xs text-gray-500">Loading teams...</div>
            )}

            {/* Empty state */}
            {!loadingTeams && teams.length === 0 && !isCollapsed && (
              <div className="px-3 py-2 text-xs text-gray-500">No teams yet</div>
            )}

            {/* Separator if there are teams */}
            {!loadingTeams && teams.length > 0 && !isCollapsed && (
              <div className="h-px bg-gray-700 my-1 mx-3"></div>
            )}

            {/* All Teams Link - Always show at bottom */}
            <NavItem to="/teams" icon={Users} label="All Teams" />
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
          className="w-full flex items-center justify-center p-2 rounded hover:bg-gray-800 text-gray-400 transition-all duration-200 hover:text-white"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
