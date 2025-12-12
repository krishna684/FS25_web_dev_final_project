import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { X, Calendar, Tag, User, Flag, Clock, MessageCircle, Paperclip, Trash2, Edit2, CheckCircle } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';

/**
 * Task Detail Modal
 * Redesigned with richer metadata grid, editable fields, and gradient header
 */
const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task || {});

    useEffect(() => {
        setEditedTask(task || {});
        setIsEditing(false);
    }, [task]);

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
                    className="bg-white dark:bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-indigo-50 via-white to-blue-50 dark:from-[#101827] dark:via-[#0b1220] dark:to-[#0b1220] border-b border-[var(--border)] p-6 flex items-start justify-between rounded-t-2xl">
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTask.title || ''}
                                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                    className="form-input text-2xl font-bold w-full"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-[var(--text-main)]">{task.title}</h2>
                            )}
                            {task.category && (
                                <p className="mt-1 text-sm text-[var(--text-secondary)]">Category: {task.category}</p>
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
                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Priority */}
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3">
                                <Flag size={16} className="text-indigo-500" />
                                <div className="text-sm">
                                    <p className="text-[var(--text-secondary)]">Priority</p>
                                    {isEditing ? (
                                        <select
                                            className="form-input mt-1"
                                            value={editedTask.priority || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                        >
                                            <option value="">None</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    ) : task.priority ? (
                                        <PriorityBadge priority={task.priority} size="default" />
                                    ) : (
                                        <span className="text-[var(--text-tertiary)]">None</span>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3">
                                <Clock size={16} className="text-green-600" />
                                <div className="text-sm">
                                    <p className="text-[var(--text-secondary)]">Status</p>
                                    {isEditing ? (
                                        <select
                                            className="form-input mt-1"
                                            value={editedTask.status || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    ) : (
                                        <span className={`text-sm font-medium px-2 py-1 rounded ${task.status === 'done'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20'
                                            : task.status === 'in-progress'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                                            }`}>
                                            {task.status || 'To Do'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3">
                                <Calendar size={16} className="text-orange-500" />
                                <div className="text-sm">
                                    <p className="text-[var(--text-secondary)]">Due Date</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="form-input mt-1"
                                            value={editedTask.dueDate ? editedTask.dueDate.slice(0, 10) : ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-[var(--text-main)]">{formatDate(task.dueDate)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Assignee */}
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3">
                                <User size={16} className="text-purple-500" />
                                <div className="text-sm">
                                    <p className="text-[var(--text-secondary)]">Assignee</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-input mt-1"
                                            value={editedTask.assignedTo?.name || editedTask.assignedTo || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
                                            placeholder="Name or email"
                                        />
                                    ) : (
                                        <span className="text-[var(--text-main)]">{task.assignedTo?.name || task.assignedTo || 'Unassigned'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">Description</h3>
                            {isEditing ? (
                                <textarea
                                    value={editedTask.description || ''}
                                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                    className="form-input w-full min-h-[140px]"
                                    placeholder="Add a description..."
                                />
                            ) : (
                                <p className="text-[var(--text-main)] whitespace-pre-wrap leading-relaxed">
                                    {task.description || <span className="text-[var(--text-tertiary)] italic">No description provided</span>}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        {task.category && (
                            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                                    <Tag size={16} />
                                    <h3 className="font-semibold">Category</h3>
                                </div>
                                <p className="text-[var(--text-main)]">{task.category}</p>
                            </div>
                        )}

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
                    <div className="sticky bottom-0 bg-[var(--bg-surface)] border-t border-[var(--border)] p-6 flex items-center justify-between rounded-b-2xl">
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
                                        className="btn btn-primary gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary gap-2"
                                >
                                    <Edit2 size={16} />
                                    Edit
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
