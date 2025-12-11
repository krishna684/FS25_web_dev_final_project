import PropTypes from 'prop-types';
import { Circle, CheckCircle2, Clock, Tag, User, MoreVertical } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';

/**
 * Enhanced Task Card Component
 * Displays task with all metadata, priority, category, assignee, and interactions
 */
const TaskCard = ({ task, onToggle, onClick, onEdit, onDelete, showTeam = false, bulkMode = false, isSelected = false }) => {
    const {
        _id,
        title,
        description,
        status,
        priority,
        dueDate,
        category,
        assignedTo,
        team
    } = task;

    const isCompleted = status === 'done';
    const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

    const formatDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleCardClick = (e) => {
        // Don't trigger if clicking on checkbox or actions
        if (e.target.closest('button, input')) return;
        onClick?.(task);
    };

    return (
        <div
            className={`card card-interactive transition-all duration-200 ${isCompleted ? 'opacity-60' : ''} ${isSelected && bulkMode ? 'ring-2 ring-primary bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onClick={handleCardClick}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox - Bulk Mode or Complete Toggle */}
                {bulkMode ? (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onClick?.(task)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(_id);
                        }}
                        className="mt-1 flex-shrink-0 transition-colors"
                        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        {isCompleted ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                            <Circle size={20} className="text-[var(--text-secondary)] hover:text-[var(--primary)]" />
                        )}
                    </button>
                )}

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className={`font-semibold text-sm mb-1 ${isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>
                        {title}
                    </h4>

                    {/* Description */}
                    {description && (
                        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                            {description}
                        </p>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Priority */}
                        {priority && (
                            <PriorityBadge priority={priority} size="small" />
                        )}

                        {/* Due Date */}
                        {dueDate && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${isOverdue
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                                }`}>
                                <Clock size={12} />
                                <span>{formatDate(dueDate)}</span>
                            </div>
                        )}

                        {/* Category */}
                        {category && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-purple-50 text-purple-600 dark:bg-purple-900/20">
                                <Tag size={12} />
                                <span>{category}</span>
                            </div>
                        )}

                        {/* Assignee */}
                        {assignedTo && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                <User size={12} />
                                <span>{assignedTo.name || assignedTo}</span>
                            </div>
                        )}

                        {/* Team */}
                        {showTeam && team && (
                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 text-xs">
                                {team.name || team}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Show dropdown menu
                        }}
                        className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Task options"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        status: PropTypes.string,
        priority: PropTypes.oneOf(['high', 'medium', 'low']),
        dueDate: PropTypes.string,
        category: PropTypes.string,
        assignedTo: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string
            })
        ]),
        team: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string
            })
        ])
    }).isRequired,
    onToggle: PropTypes.func,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    showTeam: PropTypes.bool,
    bulkMode: PropTypes.bool,
    isSelected: PropTypes.bool
};

export default TaskCard;
