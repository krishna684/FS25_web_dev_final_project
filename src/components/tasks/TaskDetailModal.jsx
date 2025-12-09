import PropTypes from 'prop-types';
import { X, Calendar, Tag, User, Flag, Clock, MessageCircle, Paperclip, Trash2 } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';
import { useState } from 'react';

/**
 * Task Detail Modal
 * Full-screen modal showing complete task information with edit capabilities
 */
const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task || {});

    if (!isOpen || !task) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSave = () => {
        onUpdate?.(editedTask);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete?.(task._id);
            onClose?.();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                <div
                    className="bg-white dark:bg-[var(--bg-surface)] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-[var(--bg-surface)] border-b border-[var(--border)] p-6 flex items-start justify-between">
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTask.title}
                                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                    className="form-input text-xl font-semibold w-full"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-[var(--text-main)]">{task.title}</h2>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Metadata Row */}
                        <div className="flex flex-wrap gap-4">
                            {/* Priority */}
                            <div className="flex items-center gap-2">
                                <Flag size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Priority:</span>
                                {task.priority ? (
                                    <PriorityBadge priority={task.priority} size="default" />
                                ) : (
                                    <span className="text-sm text-[var(--text-tertiary)]">None</span>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Due:</span>
                                <span className="text-sm font-medium">{formatDate(task.dueDate)}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Status:</span>
                                <span className={`text-sm font-medium px-2 py-1 rounded ${task.status === 'done'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20'
                                    : task.status === 'in-progress'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                                    }`}>
                                    {task.status || 'To Do'}
                                </span>
                            </div>
                        </div>

                        {/* Category & Assignee */}
                        <div className="flex flex-wrap gap-4">
                            {task.category && (
                                <div className="flex items-center gap-2">
                                    <Tag size={16} className="text-[var(--text-secondary)]" />
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 rounded-full text-sm">
                                        {task.category}
                                    </span>
                                </div>
                            )}

                            {task.assignedTo && (
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-[var(--text-secondary)]" />
                                    <span className="text-sm">
                                        Assigned to: <strong>{task.assignedTo.name || task.assignedTo}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">Description</h3>
                            {isEditing ? (
                                <textarea
                                    value={editedTask.description || ''}
                                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                    className="form-input w-full min-h-[120px]"
                                    placeholder="Add a description..."
                                />
                            ) : (
                                <p className="text-[var(--text-main)] whitespace-pre-wrap">
                                    {task.description || <span className="text-[var(--text-tertiary)] italic">No description provided</span>}
                                </p>
                            )}
                        </div>

                        {/* Placeholder sections */}
                        <div className="border-t border-[var(--border)] pt-6">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-4">
                                <MessageCircle size={18} />
                                <h3 className="font-semibold">Comments</h3>
                                <span className="text-sm">(0)</span>
                            </div>
                            <p className="text-sm text-[var(--text-tertiary)] italic">No comments yet</p>
                        </div>

                        <div className="border-t border-[var(--border)] pt-6">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-4">
                                <Paperclip size={18} />
                                <h3 className="font-semibold">Attachments</h3>
                                <span className="text-sm">(0)</span>
                            </div>
                            <p className="text-sm text-[var(--text-tertiary)] italic">No attachments</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-[var(--bg-surface)] border-t border-[var(--border)] p-6 flex items-center justify-between">
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger gap-2"
                        >
                            <Trash2 size={16} />
                            Delete Task
                        </button>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="btn btn-primary"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                >
                                    Edit Task
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

TaskDetailModal.propTypes = {
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
        ])
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func
};

export default TaskDetailModal;
