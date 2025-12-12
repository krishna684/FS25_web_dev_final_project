import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserMenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger avatar – same size as other icon buttons */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn user-avatar-btn relative"
        aria-label="User menu"
        title={user?.name || "User"}
      >
        {initial}
        <span className="user-status-dot" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-2xl animate-slideUp"
          style={{ 
            zIndex: 99999,
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* User Info Header */}
          <div 
            className="px-4 py-3 border-b rounded-t-lg"
            style={{
              borderBottomColor: 'var(--border)',
              backgroundColor: 'var(--bg-muted)',
            }}
          >
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>
              {user?.name || "User"}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {user?.email || ""}
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-2" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 text-left group/item border-0 outline-none"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <User
                size={16}
                className="group-hover/item:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              />
              <span className="text-sm font-medium group-hover/item:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-main)' }}>
                Profile
              </span>
            </button>

            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 text-left group/item mt-2 border-0 outline-none"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Settings
                size={16}
                className="group-hover/item:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              />
              <span className="text-sm font-medium group-hover/item:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-main)' }}>
                Settings
              </span>
            </button>
          </div>

          {/* Logout */}
          <div className="px-2 pb-2" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 text-left group/item border-0 outline-none"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--danger)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--danger-lighter)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut
                size={16}
                className="group-hover/item:scale-110 transition-transform"
                style={{ color: 'var(--danger)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;
