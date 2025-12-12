import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const NewTaskModal = ({ onClose, onCreate, teamId = null, initialStatus = 'todo' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: initialStatus,
        priority: 'medium',
        dueDate: '',
        category: ''
    });
    const [creating, setCreating] = useState(false);
    const [noDueDate, setNoDueDate] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        if (!noDueDate && !formData.dueDate) return;

        setCreating(true);
        try {
            await onCreate({
                ...formData,
                dueDate: noDueDate ? '' : formData.dueDate
            });
            onClose();
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="modal-content bg-white dark:bg-[var(--bg-surface)] w-full max-w-lg rounded-xl shadow-2xl animate-slideUp">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[var(--text-main)]">
                            {teamId ? 'Create Team Task' : 'Create New Task'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 hover:bg-[var(--bg-hover)] rounded transition-colors"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-group">
                        <label className="form-label">Task Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter task title"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add task description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-input"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                className="form-input"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date *</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="form-input flex-1"
                                value={formData.dueDate}
                                onChange={(e) => {
                                    setFormData({ ...formData, dueDate: e.target.value });
                                    setNoDueDate(false);
                                }}
                                required={!noDueDate}
                                disabled={noDueDate}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setNoDueDate((prev) => !prev);
                                    setFormData((prev) => ({
                                        ...prev,
                                        dueDate: prev.dueDate && !noDueDate ? '' : prev.dueDate
                                    }));
                                }}
                            >
                                {noDueDate ? 'Use Date' : 'No Date'}
                            </button>
                        </div>
                        {!noDueDate && !formData.dueDate && (
                            <p className="text-xs text-[var(--danger)] mt-1">Date is required unless you choose "No Date".</p>
                        )}
                    </div>

                    {!teamId && (
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Work, Personal, School..."
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={creating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                creating ||
                                !formData.title.trim() ||
                                (!noDueDate && !formData.dueDate)
                            }
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {creating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <span>Create Task</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTaskModal;
