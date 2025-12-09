import { useState, useEffect, useRef } from 'react';
import { Plus, CheckSquare, Users } from 'lucide-react';

const NewButtonDropdown = ({ onNewTask, onNewTeam }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleNewTask = () => {
        setIsOpen(false);
        onNewTask?.();
    };

    const handleNewTeam = () => {
        setIsOpen(false);
        onNewTeam?.();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary flex items-center gap-2 px-3 py-1.5 text-sm"
            >
                <Plus size={16} />
                New
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                        onClick={handleNewTask}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-body)] transition-colors text-left border-b border-[var(--border-light)]"
                    >
                        <CheckSquare size={18} className="text-[var(--primary)]" />
                        <span className="text-sm font-medium text-[var(--text-main)]">New Task</span>
                    </button>

                    <button
                        onClick={handleNewTeam}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-body)] transition-colors text-left"
                    >
                        <Users size={18} className="text-[var(--accent)]" />
                        <span className="text-sm font-medium text-[var(--text-main)]">New Team</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewButtonDropdown;
