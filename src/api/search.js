import axiosClient from "./axiosClient";

const searchApi = {
    search: (query) => axiosClient.get(`/search?q=${encodeURIComponent(query)}`),
};

export default searchApi;
