import React from 'react';
import { Calendar, MessageCircle, Paperclip, User } from 'lucide-react';
import { getRelativeTime } from '../activity/activityUtils';

const KanbanCard = ({ task, onClick }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isDueSoon = task.dueDate &&
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) &&
    task.status !== 'done';

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getAssigneeInitials = (assignee) => {
    if (!assignee) return '';
    if (typeof assignee === 'string') return assignee.charAt(0).toUpperCase();
    if (assignee.name) return assignee.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    return assignee.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`kanban-card ${getPriorityColor()}`}
      onClick={() => onClick?.(task)}
    >
      <div className="kanban-card-header">
        <h4 className="kanban-card-title">{task.title}</h4>
        {task.tags && task.tags.length > 0 && (
          <div className="kanban-card-tags">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="kanban-card-tag">
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="kanban-card-tag more">+{task.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      <div className="kanban-card-meta">
        {task.dueDate && (
          <div className={`kanban-card-due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
            <Calendar size={14} />
            <span>{getRelativeTime(task.dueDate)}</span>
          </div>
        )}

        <div className="kanban-card-footer">
          <div className="kanban-card-assignee">
            {task.assignedTo ? (
              task.assignedTo.avatarUrl ? (
                <img
                  src={task.assignedTo.avatarUrl}
                  alt={task.assignedTo.name}
                  className="kanban-assignee-avatar"
                />
              ) : (
                <div className="kanban-assignee-initials">
                  {getAssigneeInitials(task.assignedTo)}
                </div>
              )
            ) : (
              <div className="kanban-assignee-unassigned">
                <User size={14} />
              </div>
            )}
          </div>

          <div className="kanban-card-indicators">
            {task.comments && task.comments.length > 0 && (
              <div className="kanban-card-indicator">
                <MessageCircle size={14} />
                <span>{task.comments.length}</span>
              </div>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <div className="kanban-card-indicator">
                <Paperclip size={14} />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
  