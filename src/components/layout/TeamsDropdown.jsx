import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronDown } from 'lucide-react';
import teamApi from '../../api/teams';

const TeamsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            try {
                const res = await teamApi.getAll();
                setTeams(res.data || []);
            } catch (err) {
                console.error('Failed to fetch teams', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && teams.length === 0) {
            fetchTeams();
        }
    }, [isOpen, teams.length]);

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

    // Get pinned and recent teams (mock pinning for now)
    const pinnedTeams = teams.filter(t => t.isPinned).slice(0, 3);
    const recentTeams = teams.filter(t => !t.isPinned).slice(0, 5);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav-link flex items-center gap-1"
            >
                <Users size={16} />
                Teams
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-[var(--text-secondary)]">Loading...</div>
                        ) : teams.length === 0 ? (
                            <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
                                No teams yet. Create your first team!
                            </div>
                        ) : (
                            <>
                                {/* Pinned Teams */}
                                {pinnedTeams.length > 0 && (
                                    <div>
                                        <div className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase bg-[var(--bg-body)]">
                                            Pinned
                                        </div>
                                        {pinnedTeams.map((team) => (
                                            <Link
                                                key={team._id}
                                                to={`/teams/${team._id}`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-body)] transition-colors border-b border-[var(--border-light)]"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                                                    {team.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="flex-1 text-sm font-medium text-[var(--text-main)] truncate">
                                                    {team.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Recent Teams */}
                                {recentTeams.length > 0 && (
                                    <div>
                                        <div className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase bg-[var(--bg-body)]">
                                            Recent
                                        </div>
                                        {recentTeams.map((team) => (
                                            <Link
                                                key={team._id}
                                                to={`/teams/${team._id}`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-body)] transition-colors border-b border-[var(--border-light)]"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                    {team.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="flex-1 text-sm font-medium text-[var(--text-main)] truncate">
                                                    {team.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-[var(--border)] bg-[var(--bg-body)]">
                        <Link
                            to="/teams"
                            onClick={() => setIsOpen(false)}
                            className="block w-full px-3 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--bg-surface)] transition-colors text-center"
                        >
                            View All Teams
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsDropdown;
