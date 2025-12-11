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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import teamApi from "../../api/teams";
import { useAuth } from "../../context/AuthContext";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const sidebarWidth = isCollapsed
    ? "var(--sidebar-width-collapsed)"
    : "var(--sidebar-width)";
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
        console.error("Failed to fetch teams for sidebar", err);
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
      className={({ isActive }) =>
        [
          "sidebar-nav-item",
          "nav-link",
          "flex items-center",
          isCollapsed ? "justify-center px-0" : "gap-3",
          isActive ? "active" : ""
        ]
          .filter(Boolean)
          .join(" ")
      }
      title={isCollapsed ? label : ""}
      style={{
        padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
        minHeight: '44px',
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className="sidebar flex flex-col justify-between transition-all duration-300"
      style={{
        width: sidebarWidth,
        height: "calc(100vh - var(--header-height))",
        borderRight: "1px solid var(--border)"
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6 overflow-y-auto" style={{ padding: isCollapsed ? '1rem 0.5rem' : '1rem' }}>
        {/* User Profile Card - Show icon when collapsed, full card when expanded */}
        {user && (
          <>
            {isCollapsed ? (
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {/* Online status */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--accent)] border-2 border-[rgba(15,23,42,1)] rounded-full animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="sidebar-profile-card bg-gradient-to-br from-[rgba(37,99,235,0.15)] via-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,1)] border border-[rgba(148,163,184,0.4)] p-5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {/* Online status */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--accent)] border-2 border-[rgba(15,23,42,1)] rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate mb-1">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {user.email || ""}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Section - Combined Personal and Teams */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs uppercase text-gray-400 font-bold mb-3 px-3 tracking-wider">
              Navigation
            </h3>
          )}
          <nav className="flex flex-col gap-1">
            {/* Personal Navigation Items */}
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/tasks" icon={CheckSquare} label="My Tasks" />
            <NavItem to="/calendar" icon={CalendarIcon} label="Calendar" />

            {/* User's Individual Teams (2-3 max) */}
            {!loadingTeams &&
              teams.length > 0 &&
              teams.slice(0, 3).map((team) => (
                <NavLink
                  key={team._id}
                  to={`/teams/${team._id}`}
                  className={({ isActive }) =>
                    [
                      "sidebar-nav-item",
                      "nav-link",
                      "flex items-center",
                      isCollapsed ? "justify-center px-0" : "gap-3",
                      isActive ? "active" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                  title={isCollapsed ? team.name : ""}
                  style={{
                    padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
                    minHeight: '44px',
                  }}
                >
                  <div className="w-5 h-5 rounded bg-[var(--team)] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm text-white">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {team.name}
                      </span>
                      {team.members && (
                        <span className="text-xs text-gray-300 ml-2 flex-shrink-0">
                          {team.members.length}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}

            {/* All Teams Link */}
            <NavItem to="/teams" icon={Users} label="All Teams" />

            {/* Additional Navigation Items */}
            <NavItem to="/notifications" icon={Bell} label="Notifications" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
            <NavItem to="/help" icon={HelpCircle} label="Help & Docs" />
          </nav>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-xl mt-4 border-0 outline-none
             bg-[#0B1220]
             text-gray-300 hover:text-white
             hover:bg-[rgba(148,163,184,0.18)]
             transition-all duration-200"
          style={{ border: 'none' }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
