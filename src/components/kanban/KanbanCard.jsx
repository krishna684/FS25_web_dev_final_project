const KanbanCard = ({ task, onClick }) => {
    return (
      <div className="kanban-card" onClick={() => onClick?.(task)}>
        <h4>{task.title}</h4>
        {task.assignee && <p className="small">Assignee: {task.assignee}</p>}
        {task.dueDate && (
          <p className="small">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };
  
  export default KanbanCard;
  