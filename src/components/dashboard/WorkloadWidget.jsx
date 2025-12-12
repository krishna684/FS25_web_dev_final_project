import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * This Week's Workload Widget
 * Shows daily task distribution and completion progress
 */
const WorkloadWidget = ({ tasks = [] }) => {
    // Get current week dates (Sunday to Saturday)
    const getWeekDates = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            week.push(date);
        }
        return week;
    };

    const weekDates = getWeekDates();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate tasks per day
    const getTasksForDay = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
            return taskDate === dateStr;
        });
    };

    // Get completion stats for the week
    const weekStats = weekDates.map(date => {
        const dayTasks = getTasksForDay(date);
        const completed = dayTasks.filter(t => t.status === 'done').length;
        const total = dayTasks.length;
        return { date, completed, total };
    });

    const maxTasks = Math.max(...weekStats.map(s => s.total), 5);
    const totalThisWeek = weekStats.reduce((sum, s) => sum + s.total, 0);
    const completedThisWeek = weekStats.reduce((sum, s) => sum + s.completed, 0);
    const completionRate = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <h3 className="card-title">This Week's Workload</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {totalThisWeek} tasks · {completionRate}% complete
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {completionRate >= 50 ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                            <TrendingUp size={16} />
                            <span>{completionRate}%</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <span>{completionRate}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily bars */}
            <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {weekStats.map((stat, index) => {
                    const heightPercent = maxTasks > 0 ? (stat.total / maxTasks) * 100 : 0;
                    const completedPercent = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            {/* Bar container */}
                            <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-t overflow-hidden" style={{ height: `${Math.max(heightPercent, 10)}%` }}>
                                {/* Completed portion */}
                                {stat.completed > 0 && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all duration-300"
                                        style={{ height: `${completedPercent}%` }}
                                        title={`${stat.completed} of ${stat.total} completed`}
                                    />
                                )}
                                {/* Incomplete portion */}
                                {stat.total - stat.completed > 0 && (
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 ${isToday(stat.date) ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'} transition-all duration-300`}
                                        style={{ height: `${100 - completedPercent}%` }}
                                    />
                                )}
                                {/* Task count label */}
                                {stat.total > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white drop-shadow">
                                            {stat.total}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Day label */}
                            <div className={`text-xs text-center ${isToday(stat.date) ? 'font-bold text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                                {dayNames[index]}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-[var(--text-secondary)]">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-[var(--text-secondary)]">Today</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
                    <span className="text-[var(--text-secondary)]">Pending</span>
                </div>
            </div>
        </div>
    );
};

WorkloadWidget.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        status: PropTypes.string,
        dueDate: PropTypes.string
    }))
};

export default WorkloadWidget;
