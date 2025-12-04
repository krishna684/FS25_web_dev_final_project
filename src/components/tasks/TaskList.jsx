const TaskList = ({ tasks, onToggle, onDelete }) => {
    if (!tasks.length) return <p>No tasks yet.</p>;
  
    return (
      <ul className="task-list">
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    );
  };
  
  export default TaskList;
  