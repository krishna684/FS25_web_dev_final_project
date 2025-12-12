import axiosClient from "./axiosClient";

// Task comments (works for both personal and team tasks)
const commentApi = {
  getForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/comments`),
  addToTask: (taskId, text) => axiosClient.post(`/tasks/${taskId}/comments`, { text }),
};

export default commentApi;

