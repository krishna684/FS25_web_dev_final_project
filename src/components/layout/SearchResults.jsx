import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, User, X } from 'lucide-react';

const SearchResults = ({ results, onClose }) => {
    const hasResults = results && (results.tasks?.length > 0 || results.teams?.length > 0 || results.users?.length > 0);

    if (!hasResults) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Tasks Section */}
                {results.tasks?.length > 0 && (
                    <div className="p-2">
                        <h4 className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                            <CheckSquare size={12} /> Tasks
                        </h4>
                        {results.tasks.map(task => (
                            <Link
                                key={task._id}
                                to={`/tasks?highlight=${task._id}`} // Or a specific task detail modal if available
                                onClick={onClose}
                                className="block px-3 py-2 rounded-md hover:bg-[var(--bg-body)] transition-colors group"
                            >
                                <div className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] text-left">
                                    {task.title}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    {task.status}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Separator */}
                {(results.tasks?.length > 0 && (results.teams?.length > 0 || results.users?.length > 0)) && <div className="h-px bg-[var(--border)] mx-2 my-1" />}

                {/* Teams Section */}
                {results.teams?.length > 0 && (
                    <div className="p-2">
                        <h4 className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                            <Users size={12} /> Teams
                        </h4>
                        {results.teams.map(team => (
                            <Link
                                key={team._id}
                                to={`/teams/${team._id}`}
                                onClick={onClose}
                                className="block px-3 py-2 rounded-md hover:bg-[var(--bg-body)] transition-colors"
                            >
                                <div className="text-sm font-medium text-[var(--text-main)] text-left">{team.name}</div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Separator */}
                {((results.tasks?.length > 0 || results.teams?.length > 0) && results.users?.length > 0) && <div className="h-px bg-[var(--border)] mx-2 my-1" />}

                {/* People Section */}
                {results.users?.length > 0 && (
                    <div className="p-2">
                        <h4 className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> People
                        </h4>
                        {results.users.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-body)] transition-colors cursor-default"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-[var(--text-main)] text-left">{user.name}</div>
                                    <div className="text-xs text-[var(--text-secondary)] text-left">{user.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-[var(--bg-body)] border-t border-[var(--border)] text-center">
                <span className="text-xs text-[var(--text-secondary)]">Press ESC to close</span>
            </div>
        </div>
    );
};

export default SearchResults;
