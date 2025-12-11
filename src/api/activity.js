import axiosClient from "./axiosClient";

const activityApi = {
    getTeamActivity: (teamId) => axiosClient.get(`/teams/${teamId}/activity`),
    getUserActivity: () => axiosClient.get('/activity'),
};

export default activityApi;
