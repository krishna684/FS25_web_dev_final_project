import axiosClient from "./axiosClient";

const notificationApi = {
    getAll: () => axiosClient.get("/notifications"),
    markRead: (id) => axiosClient.put(`/notifications/${id}/read`),
};

export default notificationApi;
