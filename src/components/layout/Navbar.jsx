import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import TeamsDropdown from "./TeamsDropdown";
import NewButtonDropdown from "./NewButtonDropdown";
import UserMenuDropdown from "./UserMenuDropdown";
import SearchResults from "./SearchResults";
import searchApi from "../../api/search";
import { Search, Home, CheckSquare, Calendar, Moon, Sun, ArrowLeft, Grid, User } from "lucide-react";
import Logo from "../common/Logo";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const navCenterRef = useRef(null);
  const navLeftRef = useRef(null);
  const navRightRef = useRef(null);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const res = await searchApi.search(query);
          setResults(res.data);
          setShowResults(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleCloseSearch = () => {
    setShowResults(false);
    setQuery("");
  };

  const handleMobileSearchOpen = () => {
    setMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
    setQuery("");
    setShowResults(false);
  };

  const handleNewTask = () => {
    navigate('/tasks');
  };

  const handleNewTeam = () => {
    navigate('/teams');
  };

  return (
    <nav className="navbar bg-[var(--navbar-bg)] border-b-4 border-[var(--primary)] sticky top-0 z-50 shadow-md" style={{ transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <div className="container max-w-[1250px] mx-auto flex justify-between items-center px-3 py-3">

        {/* LEFT - Logo */}
        <div 
          ref={navLeftRef}
          className={`nav-left flex items-center flex-1 ${mobileSearchOpen ? 'hidden' : 'flex'}`}
        >
          <NavLink to="/dashboard" className="logo text-[var(--primary)] hover:text-blue-600 transition-colors text-xl font-semibold no-underline">
            TaskFlow
          </NavLink>
        </div>

        {/* CENTER - Search Bar */}
        <div 
          ref={navCenterRef}
          className={`nav-center flex justify-center items-center mx-0 transition-all ${
            mobileSearchOpen 
              ? 'flex-[1] w-full' 
              : 'flex-[8] hidden md:flex'
          }`}
        >
          {/* Back Arrow (Mobile Only) */}
          <button
            onClick={handleMobileSearchClose}
            className={`text-[var(--primary)] hover:text-blue-600 mr-6 cursor-pointer ${
              mobileSearchOpen ? 'block' : 'hidden'
            }`}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Search Input */}
          <div className="relative flex items-center w-full max-w-[600px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (results) setShowResults(true);
              }}
              placeholder="Search tasks, teams..."
              className="w-full md:w-[70%] bg-[var(--bg-surface)] border border-[var(--primary)] border-r-0 pl-3 pr-2 py-1.5 outline-none text-[var(--text-main)] text-base placeholder-[var(--text-tertiary)]"
              style={{ color: 'var(--text-main)', backgroundColor: 'var(--bg-surface)' }}
            />
            <button 
              className="px-7 py-[7px] bg-[var(--bg-surface)] text-[var(--primary)] hover:text-blue-600 border border-[var(--primary)] border-l-0 cursor-pointer transition-colors"
              style={{ backgroundColor: 'var(--bg-surface)' }}
              onClick={() => {
                if (query.trim()) {
                  // Trigger search
                  setShowResults(true);
                }
              }}
            >
              <Search size={20} />
            </button>

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
              <SearchResults results={results} onClose={handleCloseSearch} />
            )}
          </div>
        </div>

        {/* RIGHT - Actions */}
        <div 
          ref={navRightRef}
          className={`nav-right flex justify-end items-center gap-2 flex-[3] ${mobileSearchOpen ? 'hidden' : 'flex'}`}
        >
          {/* Mobile Search Icon */}
          <button
            onClick={handleMobileSearchOpen}
            className="md:hidden text-[var(--primary)] hover:text-blue-600 cursor-pointer transition-colors p-2"
          >
            <Search size={20} />
          </button>

          {/* New Button (Desktop) */}
          <div className="hidden md:block">
            <NewButtonDropdown
              onNewTask={handleNewTask}
              onNewTeam={handleNewTeam}
            />
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-[var(--primary)] hover:text-blue-600 cursor-pointer transition-colors p-2"
            title="Toggle Dark Mode"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          <UserMenuDropdown />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
