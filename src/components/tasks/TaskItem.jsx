
const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3 shadow-sm hover:bg-[var(--bg-hover)] transition-colors">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
        />
        <span className={`text-sm ${task.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>
          {task.title}
        </span>
      </div>
      <button
        className="text-sm font-semibold text-red-500 hover:text-red-600"
        onClick={() => onDelete(task._id)}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;