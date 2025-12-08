import { createContext, useContext, useEffect, useState } from "react";
import taskApi from "../api/tasks";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getAll();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async ({ title, dueDate }) => {
    try {
      const res = await taskApi.create({ title, dueDate });
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const toggleTask = async (taskId) => {
    const existing = tasks.find((t) => t._id === taskId);
    if (!existing) return;

    try {
      // Toggle based on status: if 'done', set to 'todo', otherwise set to 'done'
      const newStatus = existing.status === 'done' ? 'todo' : 'done';
      const res = await taskApi.update(taskId, {
        status: newStatus,
        completed: newStatus === 'done' // This triggers backend completion logic
      });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskApi.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, toggleTask, deleteTask, refresh: fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
