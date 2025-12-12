import PropTypes from 'prop-types';
import { Circle, CheckCircle2, Paperclip, MoreVertical } from 'lucide-react';
import { formatDueDate, getDueDateStatus, getDueDateColor, getPriorityConfig, getCommentCount, truncateText } from '../../utils/taskHelpers';

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

    const handleCardClick = (e) => {
        // Don't trigger if clicking on checkbox or actions
        if (e.target.closest('button, input')) return;
        onClick?.(task);
    };

    const dueDateStatus = getDueDateStatus(dueDate);
    const dueDateColor = getDueDateColor(dueDateStatus);
    const priorityConfig = getPriorityConfig(priority);
    const commentCount = getCommentCount(task.comments);
    const attachmentCount = Array.isArray(task.attachments) ? task.attachments.length : 0;

    return (
        <div
            className={`tasks-page-card group ${isCompleted ? 'opacity-60' : ''} ${isSelected && bulkMode ? 'ring-2 ring-primary' : ''}`}
            onClick={handleCardClick}
            style={{
                borderLeft: `4px solid ${priorityConfig.borderColor}`
            }}
        >
            {/* Header: Priority + Category + Menu */}
            <div className="task-card-header">
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
                    <span className="task-category-badge">
                        {category || 'General'}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Show dropdown menu
                    }}
                    className="task-menu-button opacity-0 group-hover:opacity-100"
                    aria-label="Task options"
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            <div className="task-card-divider"></div>

            {/* Content: Checkbox + Title + Description */}
            <div className="task-card-content">
                <div className="flex gap-3">
                    {/* Checkbox - Bulk Mode or Complete Toggle */}
                    {bulkMode ? (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onClick?.(task)}
                            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle?.(_id);
                            }}
                            className="mt-0.5 flex-shrink-0 transition-colors"
                            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                            {isCompleted ? (
                                <CheckCircle2 size={20} className="text-green-500" />
                            ) : (
                                <Circle size={20} className="text-[var(--text-secondary)] hover:text-[var(--primary)]" />
                            )}
                        </button>
                    )}

                    {/* Title + Description */}
                    <div className="flex-1 min-w-0">
                        <h4 className={`task-card-title-detailed ${isCompleted ? 'line-through text-[var(--text-secondary)]' : ''}`}>
                            {title}
                        </h4>
                        {description && (
                            <p className="task-card-description">
                                {truncateText(description, 100)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="task-card-divider"></div>

            {/* Metadata: Due Date + Category + Comments + Attachments */}
            <div className="task-metadata">
                <span 
                    className="metadata-item"
                    style={{ color: dueDate ? dueDateColor : 'var(--text-tertiary)' }}
                >
                    📅 {dueDate ? formatDueDate(dueDate) : 'No date'}
                </span>
                <span className="metadata-separator">•</span>
                <span className="metadata-item">
                    {category || 'Uncategorized'}
                </span>
                <span className="metadata-separator">•</span>
                <span className="metadata-item flex items-center gap-1">
                    💬 {commentCount || 0}
                </span>
                {attachmentCount > 0 && (
                    <>
                        <span className="metadata-separator">•</span>
                        <span className="metadata-item flex items-center gap-1">
                            <Paperclip size={12} />
                            {attachmentCount}
                        </span>
                    </>
                )}
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
