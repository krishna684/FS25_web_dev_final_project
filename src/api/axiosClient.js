// src/api/axiosClient.js
import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Server took too long to respond. Please try again later.'));
    }
    // Propagate the server's error message if available
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
