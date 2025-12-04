import { useMemo, useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import { useTasks } from "../context/TaskContext";

const TasksPage = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({ status: "all", search: "" });

  const handleCreate = ({ title, dueDate }) => {
    addTask({ title, dueDate });
  };

  const handleToggle = (task) => {
    toggleTask(task.id);
  };

  const handleDelete = (task) => {
    deleteTask(task.id);
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) => {
        const matchesStatus =
          filters.status === "all" ? true : t.status === filters.status;
        const matchesSearch = t.title
          .toLowerCase()
          .includes(filters.search.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [tasks, filters]
  );

  return (
    <div>
      <h2>My Tasks</h2>
      <TaskFilters filters={filters} onChange={setFilters} />
      <TaskForm onSubmit={handleCreate} />
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TasksPage;
