import axiosClient from "./axiosClient";

const taskApi = {
    getAll: () => axiosClient.get("/tasks"),
    create: (taskData) => axiosClient.post("/tasks", taskData),
    update: (id, updates) => axiosClient.put(`/tasks/${id}`, updates),
    delete: (id) => axiosClient.delete(`/tasks/${id}`),
    getDetails: (id) => axiosClient.get(`/tasks/${id}`),
};

export default taskApi;
