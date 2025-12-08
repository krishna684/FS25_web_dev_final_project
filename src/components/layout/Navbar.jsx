import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { Search, Settings, Moon, Sun } from "lucide-react";
import SearchResults from "./SearchResults";
import searchApi from "../../api/search";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  // Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  // Click outside listener could be added here or handled by blur, 
  // but for simplicity we rely on layout or close button.

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleCloseSearch = () => {
    setShowResults(false);
    setQuery("");
  };

  return (
    <header className="navbar h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-surface)] z-20 sticky top-0 transition-colors duration-300">
      {/* Left: Logo */}
      <div className="navbar-left flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
            TF
          </div>
          <span className="font-bold text-xl text-[var(--text-main)] tracking-tight">TaskFlow</span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="navbar-center flex-1 max-w-lg mx-8 hidden md:block">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results) setShowResults(true); }}
            placeholder="Search tasks, teams, or people..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-body)] border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-400 text-[var(--text-main)]"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}

          {showResults && (
            <SearchResults results={results} onClose={handleCloseSearch} />
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="navbar-right flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-body)] transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationBell />

        <div className="flex items-center gap-3 pl-2 border-l border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm ring-2 ring-white dark:ring-gray-700">
            {user?.name?.[0] || 'U'}
          </div>

          <div className="flex flex-col items-end">
            <button
              onClick={logout}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
