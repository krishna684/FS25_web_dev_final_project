import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">TF</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className="sidebar-link">
          My Tasks
        </NavLink>
        <NavLink to="/calendar" className="sidebar-link">
          Calendar
        </NavLink>
        <NavLink to="/teams" className="sidebar-link">
          Teams
        </NavLink>
        <NavLink to="/notifications" className="sidebar-link">
          Notifications
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
