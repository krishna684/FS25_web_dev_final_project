import PropTypes from 'prop-types';
import { Circle, CheckCircle2, Clock, Calendar } from 'lucide-react';


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

        if (isToday) return { text: 'Today', color: '#F59E0B' }; // Orange
        if (isTomorrow) return { text: 'Tomorrow', color: '#F59E0B' }; // Orange

        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Overdue', color: '#EF4444' }; // Red

        // Future
        return {
            text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            color: '#6B7280' // Gray
        };
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'high': return { border: '#EF4444', badgeBg: '#FEE2E2', badgeText: '#991B1B', label: 'HIGH' };
            case 'medium': return { border: '#F97316', badgeBg: '#FED7AA', badgeText: '#9A3412', label: 'MED' };
            case 'low': return { border: '#9CA3AF', badgeBg: '#E5E7EB', badgeText: '#374151', label: 'LOW' };
            default: return { border: '#9CA3AF', badgeBg: '#E5E7EB', badgeText: '#374151', label: 'LOW' };
        }
    };

    if (focusTasks.length === 0) {
        return (
            <div className="card h-full">
                <div className="card-header">
                    <h3 className="card-title">Today's Focus</h3>
                </div>
                <div className="py-8 text-center flex-1 flex flex-col justify-center items-center">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-green-500 opacity-50" />
                    <p className="text-[var(--text-secondary)] text-sm">
                        All caught up! No priority tasks right now.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-full flex flex-col">
            <div className="card-header shrink-0">
                <h3 className="card-title">Today's Focus</h3>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pt-1">
                {focusTasks.map((task) => {
                    const dateInfo = formatDueDate(task.dueDate);
                    const styles = getPriorityStyles(task.priority || 'low');

                    return (
                        <div
                            key={task._id}
                            className="relative flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-[var(--border)] group hover:shadow-md transition-shadow"
                            style={{
                                borderLeftWidth: '3px',
                                borderLeftColor: styles.border,
                                height: '64px'
                            }}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete?.(task._id);
                                }}
                                className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--primary)] transition-colors"
                            >
                                <Circle size={20} />
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                                {/* Top Row: Title + Priority Badge */}
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <h4 className="font-semibold text-[15px] truncate text-[var(--text-main)] w-full pr-16 bg-transparent">
                                        {task.title}
                                    </h4>

                                    {/* Absolute positioned badge to ensure it stays in corner */}
                                    <div className="absolute top-3 right-8">
                                        <span
                                            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                            style={{
                                                backgroundColor: styles.badgeBg,
                                                color: styles.badgeText
                                            }}
                                        >
                                            {styles.label}
                                        </span>
                                    </div>

                                    {/* Warning: Menu dots overlap with badge in small space? The mockup shows badge then dots. */}
                                    {/* Using absolute for badge might overlap title. Let's try flex instead if space permits. */}
                                </div>

                                {/* Bottom Row: Date • Category • Comments */}
                                <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] truncate">
                                    {dateInfo && (
                                        <div className="flex items-center gap-1 shrink-0" style={{ color: dateInfo.color }}>
                                            <Calendar size={12} />
                                            <span>{dateInfo.text}</span>
                                        </div>
                                    )}

                                    {(dateInfo && task.category) && <span>•</span>}

                                    {task.category && (
                                        <span className="truncate max-w-[100px]">{task.category}</span>
                                    )}

                                    {/* Mock Comment Count since data might not exist yet */}
                                    {/* <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs">💬</span>
                                        <span>0</span>
                                    </div> */}
                                </div>
                            </div>

                            {/* Menu Dots */}
                            <button
                                className="shrink-0 absolute top-3 right-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                                aria-label="Menu"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
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
