import React from 'react';
import { Plus } from 'lucide-react';
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({
  title,
  tasks,
  onCardClick,
  onAddTask,
  wipLimit = null,
  status
}) => {
  const taskCount = tasks.length;
  const isOverLimit = wipLimit && taskCount > wipLimit;

  return (
    <div className={`kanban-column ${isOverLimit ? 'over-limit' : ''}`}>
      <div className="kanban-column-header">
        <div className="kanban-column-title-section">
          <h3 className="kanban-column-title">{title}</h3>
          <span className={`kanban-column-count ${isOverLimit ? 'over-limit' : ''}`}>
            {taskCount}
            {wipLimit && `/${wipLimit}`}
          </span>
        </div>
        {isOverLimit && (
          <div className="kanban-wip-warning">
            <span className="wip-warning-text">Limit exceeded</span>
          </div>
        )}
      </div>

      <div className="kanban-column-body">
        {tasks.length === 0 ? (
          <div className="kanban-empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No tasks yet</p>
            <p className="empty-state-hint">Drag tasks here or click "Add Task"</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task._id} task={task} onClick={onCardClick} />
          ))
        )}

        <button
          className="kanban-add-task-btn"
          onClick={() => onAddTask?.(status)}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
