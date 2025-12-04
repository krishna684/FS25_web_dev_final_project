import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks from backend, leaving current state", err);
      // you can optionally set mock tasks here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async ({ title, dueDate }) => {
    try {
      const res = await axiosClient.post("/tasks", { title, dueDate });
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const toggleTask = async (taskId) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (!existing) return;

    try {
      const res = await axiosClient.put(`/tasks/${taskId}`, {
        completed: !existing.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
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
