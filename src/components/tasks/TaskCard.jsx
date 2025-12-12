import PropTypes from 'prop-types';
import { Circle, CheckCircle2, Clock, Tag, User, MoreVertical, Calendar, MessageSquare, Paperclip } from 'lucide-react';


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
        team,
        comments = [], // Assuming comments count comes from here or similar
        attachments = [] // Assuming attachments count comes from here
    } = task;

    const isCompleted = status === 'done';
    const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

    const formatDateTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);

        // Format: Dec 15, 2:00pm
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const getPriorityStyles = (p) => {
        switch (p) {
            case 'high': return { border: '#EF4444', badgeBg: '#FEE2E2', badgeText: '#991B1B', label: 'HIGH' };
            case 'medium': return { border: '#F97316', badgeBg: '#FED7AA', badgeText: '#9A3412', label: 'MED' };
            case 'low': return { border: '#9CA3AF', badgeBg: '#E5E7EB', badgeText: '#374151', label: 'LOW' };
            default: return { border: 'transparent', badgeBg: '#E5E7EB', badgeText: '#374151', label: 'LOW' };
        }
    };

    const priorityStyles = getPriorityStyles(priority);

    const handleCardClick = (e) => {
        if (e.target.closest('button, input, a')) return;
        onClick?.(task);
    };

    return (
        <div
            className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col ${isCompleted ? 'opacity-60' : ''} ${isSelected && bulkMode ? 'ring-2 ring-primary' : ''}`}
            style={{
                height: 'auto',
                minHeight: '130px',
                borderLeft: `4px solid ${priorityStyles.border}`
            }}
            onClick={handleCardClick}
        >
            {/* 1. Header Row */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                    {/* Priority Badge */}
                    <span
                        className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                            backgroundColor: priorityStyles.badgeBg,
                            color: priorityStyles.badgeText
                        }}
                    >
                        {priorityStyles.label}
                    </span>

                    {/* Category Tag (Header) */}
                    {category && (
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                            {category}
                        </span>
                    )}
                </div>

                {/* Menu Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Show dropdown menu
                    }}
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-main)] transition-colors p-1"
                >
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* 2. Main Content */}
            <div className="flex-1 px-4 py-1 flex items-start gap-3">
                {/* Checkbox (18px) */}
                <div className="pt-0.5">
                    {bulkMode ? (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onClick?.(task)}
                            className="w-[18px] h-[18px] cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle?.(_id);
                            }}
                            className="text-[var(--text-tertiary)] hover:text-[var(--primary)] transition-colors"
                        >
                            {isCompleted ? (
                                <CheckCircle2 size={18} className="text-green-500" />
                            ) : (
                                <Circle size={18} />
                            )}
                        </button>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={`text-[16px] font-semibold leading-snug mb-1 ${isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>
                        {title}
                    </h4>
                    {description && (
                        <p className="text-[14px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* 3. Metadata Row */}
            <div className="px-4 pb-4 pt-3 mt-auto flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
                {/* Due Date */}
                {dueDate && (
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                        <Calendar size={14} />
                        <span>{formatDateTime(dueDate)}</span>
                    </div>
                )}

                {/* Separator if needed */}
                {(dueDate && category) && <span>•</span>}

                {/* Category (Metadata) */}
                {category && (
                    <span>{category}</span>
                )}

                {/* Comments & Attachments */}
                <div className="flex items-center gap-3 ml-auto text-[var(--text-tertiary)]">
                    {comments.length > 0 && (
                        <div className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors" title={`${comments.length} comments`}>
                            <MessageSquare size={14} />
                            <span>{comments.length}</span>
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors" title={`${attachments.length} attachments`}>
                            <Paperclip size={14} />
                            <span>{attachments.length}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Show/Hide Edit/Delete buttons on hover could go here or in Menu */}
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
