import { useState } from 'react';
import { X, Loader2, User } from 'lucide-react';

const NewTaskModal = ({ onClose, onCreate, teamId = null, teamMembers = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        hasDate: false,
        category: '',
        assignedTo: ''
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const payload = {
            ...formData,
            dueDate: formData.hasDate ? formData.dueDate : undefined,
        };

        setCreating(true);
        try {
            await onCreate(payload);
            onClose();
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="modal-content bg-white dark:bg-[var(--bg-surface)] w-full max-w-2xl rounded-2xl shadow-2xl animate-slideUp">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-indigo-50 via-white to-blue-50 dark:from-[#101827] dark:via-[#0b1220] dark:to-[#0b1220] rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">New Task</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mt-1">
                                {teamId ? 'Create Team Task' : 'Create New Task'}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Provide details to keep your team in sync.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-main)] p-2 hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="form-group">
                        <label className="form-label font-semibold">Task Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Prepare sprint demo"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label font-semibold">Description</label>
                        <textarea
                            className="form-input min-h-[120px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What needs to be done? Add context, links, and details."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label font-semibold">Status</label>
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
                            <label className="form-label font-semibold">Priority</label>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label font-semibold flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.hasDate}
                                    onChange={(e) => setFormData({ ...formData, hasDate: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                                />
                                Add Due Date
                            </label>
                            <input
                                type="date"
                                className="form-input mt-2"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                disabled={!formData.hasDate}
                            />
                        </div>

                        {!teamId && (
                            <div className="form-group">
                                <label className="form-label font-semibold">Category</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Work, Personal, School..."
                                />
                            </div>
                        )}

                        {teamId && teamMembers.length > 0 && (
                            <div className="form-group">
                                <label className="form-label font-semibold flex items-center gap-2">
                                    <User size={16} /> Assign To
                                </label>
                                <select
                                    className="form-input"
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {teamMembers.map((member) => (
                                        <option key={member._id} value={member.user?._id || member._id}>
                                            {member.user?.name || member.name || member.user?.email || 'Member'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
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
                            disabled={creating || !formData.title.trim()}
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
