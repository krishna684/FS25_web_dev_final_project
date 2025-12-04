import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">TaskFlow</h1>
      </div>
      <div className="navbar-right">
        <NotificationBell />
        <div className="navbar-user">
          <span>{user?.name || user?.email}</span>
          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
