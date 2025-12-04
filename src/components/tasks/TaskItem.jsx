
const TaskItem = ({ task, onToggle, onDelete }) => {
    return (
      <li className="task-item">
        <div>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
          />
          <span className={task.completed ? "task-done" : ""}>{task.title}</span>
        </div>
        <button className="btn-link" onClick={() => onDelete(task)}>
          Delete
        </button>
      </li>
    );
  };
  
  export default TaskItem;
  