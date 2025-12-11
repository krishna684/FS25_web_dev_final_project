import axiosClient from "./axiosClient";

const teamTaskApi = {
    getAll: (teamId) => axiosClient.get(`/teams/${teamId}/tasks`),
    create: (teamId, taskData) => axiosClient.post(`/teams/${teamId}/tasks`, taskData),
    update: (teamId, taskId, updates) => axiosClient.put(`/teams/${teamId}/tasks/${taskId}`, updates),
    delete: (teamId, taskId) => axiosClient.delete(`/teams/${teamId}/tasks/${taskId}`),

    // Comments
    getComments: (taskId) => axiosClient.get(`/tasks/${taskId}/comments`),
    addComment: (taskId, text) => axiosClient.post(`/tasks/${taskId}/comments`, { text }),
};

export default teamTaskApi;
