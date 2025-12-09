import axiosClient from "./axiosClient";

const teamApi = {
    getAll: () => axiosClient.get("/teams"),
    create: (teamData) => axiosClient.post("/teams", teamData),
    join: (inviteCode) => axiosClient.post("/teams/join", { inviteCode }),
    getDetails: (id) => axiosClient.get(`/teams/${id}`),
    leave: (id) => axiosClient.delete(`/teams/${id}/leave`),
    updateMemberRole: (teamId, memberId, role) => axiosClient.put(`/teams/${teamId}/members/${memberId}/role`, { role }),
    removeMember: (teamId, memberId) => axiosClient.delete(`/teams/${teamId}/members/${memberId}`),
    regenerateInviteCode: (teamId) => axiosClient.post(`/teams/${teamId}/regenerate-invite`),
};

export default teamApi;
