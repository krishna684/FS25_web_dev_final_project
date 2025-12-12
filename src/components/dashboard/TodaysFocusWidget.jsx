import PropTypes from 'prop-types';
import { Circle, CheckCircle2, MoreVertical } from 'lucide-react';
import { formatDueDate, getDueDateStatus, getDueDateColor, getPriorityConfig, getCommentCount } from '../../utils/taskHelpers';

/**
 * Today's Focus Widget - Compact Cards (56-64px)
 * Shows top 3 priority tasks with metadata
 */
const TodaysFocusWidget = ({ tasks = [], onToggleComplete, onTaskClick }) => {
    // Get today's tasks or high priority incomplete tasks
    const focusTasks = tasks
        .filter(t => t.status !== 'done')
        .sort((a, b) => {
            // Sort by priority first (high > medium > low)
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            const aPriority = priorityOrder[a.priority] ?? 1;
            const bPriority = priorityOrder[b.priority] ?? 1;

            if (aPriority !== bPriority) return aPriority - bPriority;

            // Then by due date
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return a.dueDate ? -1 : 1;
        })
        .slice(0, 3);

    if (focusTasks.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Today's Focus</h3>
                </div>
                <div className="py-8 text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-green-500 opacity-50" />
                    <p className="text-[var(--text-secondary)] text-sm">
                        All caught up! No priority tasks right now.
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        Great job staying on top of your work! 🎉
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Today's Focus</h3>
                <span className="text-xs text-[var(--text-secondary)]">
                    Top {focusTasks.length} priority task{focusTasks.length > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex flex-col" style={{ gap: '22px' }}>
                {focusTasks.map((task, index) => {
                    const dueDateStatus = getDueDateStatus(task.dueDate);
                    const dueDateColor = getDueDateColor(dueDateStatus);
                    const priorityConfig = getPriorityConfig(task.priority);
                    const commentCount = getCommentCount(task.comments);

                    return (
                        <div
                            key={task._id || index}
                            className="dashboard-task-card group"
                            style={{
                                borderLeft: `3px solid ${priorityConfig.borderColor}`
                            }}
                            onClick={() => onTaskClick?.(task)}
                            role="button"
                        >
                            <div className="flex items-center gap-3">
                                {/* Checkbox */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleComplete?.(task._id);
                                    }}
                                    className="flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                    aria-label={`Mark "${task.title}" as complete`}
                                >
                                    <Circle size={18} strokeWidth={2} />
                                </button>

                                {/* Task Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Title Row */}
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="task-card-title truncate">
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="task-priority-badge"
                                                style={{
                                                    backgroundColor: priorityConfig.bgColor,
                                                    color: priorityConfig.textColor
                                                }}
                                            >
                                                {priorityConfig.label}
                                            </span>
                                            <button
                                                className="task-menu-button opacity-0 group-hover:opacity-100"
                                                aria-label="Task options"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Metadata Row */}
                                    <div className="task-metadata">
                                        <span 
                                            className="metadata-item"
                                            style={{ color: task.dueDate ? dueDateColor : 'var(--text-tertiary)' }}
                                        >
                                            📅 {task.dueDate ? formatDueDate(task.dueDate) : 'No date'}
                                        </span>
                                        <span className="metadata-separator">•</span>
                                        <span className="metadata-item">
                                            {task.category || 'Uncategorized'}
                                        </span>
                                        <span className="metadata-separator">•</span>
                                        <span className="metadata-item">
                                            💬 {commentCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Add Hint */}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-tertiary)] text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface-alt)] rounded text-xs font-mono">Ctrl+K</kbd> to quickly add a new task
                </p>
            </div>
        </div>
    );
};

TodaysFocusWidget.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        status: PropTypes.string,
        priority: PropTypes.oneOf(['high', 'medium', 'low']),
        dueDate: PropTypes.string,
        category: PropTypes.string
    })),
    onToggleComplete: PropTypes.func,
    onTaskClick: PropTypes.func
};

export default TodaysFocusWidget;
