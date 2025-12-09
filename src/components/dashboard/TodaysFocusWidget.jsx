import PropTypes from 'prop-types';
import { Circle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';

/**
 * Today's Focus Widget
 * Shows top 3 priority tasks for quick access
 */
const TodaysFocusWidget = ({ tasks = [], onToggleComplete }) => {
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

    const formatDueDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';

        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays <= 7) return `In ${diffDays} days`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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

            <div className="space-y-3">
                {focusTasks.map((task, index) => {
                    const dueLabel = formatDueDate(task.dueDate);
                    const isOverdue = dueLabel === 'Overdue';

                    return (
                        <div
                            key={task._id || index}
                            className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]"
                        >
                            {/* Checkbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete?.(task._id);
                                }}
                                className="mt-0.5 flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                aria-label={`Mark "${task.title}" as complete`}
                            >
                                <Circle size={20} strokeWidth={2} />
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-medium text-sm text-[var(--text-main)] truncate">
                                        {task.title}
                                    </h4>
                                    {task.priority && (
                                        <PriorityBadge priority={task.priority} size="small" showLabel={false} />
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                                    {dueLabel && (
                                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                                            <Clock size={12} />
                                            <span>{dueLabel}</span>
                                        </div>
                                    )}
                                    {task.category && (
                                        <span className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-xs">
                                            {task.category}
                                        </span>
                                    )}
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
    onToggleComplete: PropTypes.func
};

export default TodaysFocusWidget;
