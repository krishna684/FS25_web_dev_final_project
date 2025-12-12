import axiosClient from "./axiosClient";

const authApi = {
    login: (email, password) => axiosClient.post("/auth/login", { email, password }),
    register: (userData) => axiosClient.post("/auth/register", userData),
    getProfile: () => axiosClient.get("/auth/profile"),
};

export default authApi;
