import axiosClient from "./axiosClient";

const teamApi = {
  // Get all teams for the current user
  getAll: () => axiosClient.get("/teams"),

  // Create a new team
  create: (teamData) => axiosClient.post("/teams", teamData),

  // Join a team via invite code
  join: (inviteCode) =>
    axiosClient.post("/teams/join", { inviteCode }),

  // Get single team details
  getDetails: (id) => axiosClient.get(`/teams/${id}`),

  // Leave a team (for regular members)
  leave: (id) => axiosClient.delete(`/teams/${id}/leave`),

  // 🔥 Delete a team (for owner/admin)
  delete: (id) => axiosClient.delete(`/teams/${id}`),

  // Update a member's role
  updateMemberRole: (teamId, memberId, role) =>
    axiosClient.put(`/teams/${teamId}/members/${memberId}/role`, { role }),

  // Remove a member from the team
  removeMember: (teamId, memberId) =>
    axiosClient.delete(`/teams/${teamId}/members/${memberId}`),

  // Regenerate invite code for a team
  regenerateInviteCode: (teamId) =>
    axiosClient.post(`/teams/${teamId}/regenerate-invite`),
};

export default teamApi;
