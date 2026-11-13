import axios from "axios";
import api from "./api";

export const publicApi = axios.create({
  baseURL: api.defaults.baseURL,
  withCredentials: false,
});

publicApi.interceptors.request.use((config) => {
  delete config.headers.Authorization;
  return config;
});

export const extractError = (error, fallback) => {
  const detail = error.response?.data;
  if (detail && typeof detail === "object") {
    return Object.entries(detail)
      .map(([field, errs]) => (field === "detail" ? errs : `${field}: ${errs}`))
      .join("\n");
  }
  return fallback;
};

export default api;
