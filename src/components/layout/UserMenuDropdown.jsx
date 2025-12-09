import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserMenuDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleProfile = () => {
        setIsOpen(false);
        navigate('/profile');
    };

    const handleSettings = () => {
        setIsOpen(false);
        navigate('/settings');
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--bg-body)] transition-all duration-200 group hover:shadow-sm"
                aria-label="User menu"
            >
                <div className="relative">
                    <div
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm ring-2 ring-white dark:ring-gray-800 shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                        title={user?.name || 'User'}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse" title="Online"></div>
                </div>
                <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden animate-slideUp"
                    style={{
                        zIndex: 99999
                    }}
                >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1 bg-white dark:bg-gray-800">
                        <button
                            onClick={handleProfile}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 text-left group/item"
                        >
                            <User size={16} className="text-gray-600 dark:text-gray-400 group-hover/item:text-[var(--primary)] transition-colors" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-[var(--primary)] transition-colors">Profile</span>
                        </button>

                        <button
                            onClick={handleSettings}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 text-left group/item"
                        >
                            <Settings size={16} className="text-gray-600 dark:text-gray-400 group-hover/item:text-[var(--primary)] transition-colors" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-[var(--primary)] transition-colors">Settings</span>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 py-1 bg-white dark:bg-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-left group/item"
                        >
                            <LogOut size={16} className="text-red-500 group-hover/item:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-red-500">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenuDropdown;
