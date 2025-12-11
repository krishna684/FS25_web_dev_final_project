// src/components/layout/NewButtonDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Plus, CheckSquare, Users } from "lucide-react";

const NewButtonDropdown = ({ onNewTask, onNewTeam }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleNewTask = () => {
    setOpen(false);
    onNewTask && onNewTask();
  };

  const handleNewTeam = () => {
    setOpen(false);
    onNewTeam && onNewTeam();
  };

  return (
    <div className="relative" ref={ref}>
      {/* Circle + button – same style as Search / Bell / Moon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn"
        aria-label="New"
      >
        <Plus size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-2xl animate-slideUp"
          style={{ 
            zIndex: 99999,
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Menu Items */}
          <div className="p-2" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <button
              onClick={handleNewTask}
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
              <CheckSquare
                size={16}
                className="group-hover/item:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              />
              <span className="text-sm font-medium group-hover/item:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-main)' }}>
                New Task
              </span>
            </button>

            <button
              onClick={handleNewTeam}
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
              <Users
                size={16}
                className="group-hover/item:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              />
              <span className="text-sm font-medium group-hover/item:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-main)' }}>
                New Team
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewButtonDropdown;
