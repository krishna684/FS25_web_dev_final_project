// src/api/axiosClient.js
import axios from "axios";

// ⚠️ Change this to your backend URL if different
const BASE_URL = "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if your backend uses cookies
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
