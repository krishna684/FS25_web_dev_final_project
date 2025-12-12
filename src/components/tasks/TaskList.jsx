import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  if (!tasks.length) return <p>No tasks yet.</p>;

  return (
    <ul className="space-y-2.5">
      {tasks.map((t) => (
        <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TaskList;
