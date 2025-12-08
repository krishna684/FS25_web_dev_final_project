import axiosClient from "./axiosClient";

const teamApi = {
    getAll: () => axiosClient.get("/teams"),
    create: (teamData) => axiosClient.post("/teams", teamData),
    join: (inviteCode) => axiosClient.post("/teams/join", { inviteCode }),
    getDetails: (id) => axiosClient.get(`/teams/${id}`),
    leave: (id) => axiosClient.delete(`/teams/${id}/leave`),
};

export default teamApi;
