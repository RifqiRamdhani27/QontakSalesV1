import axios from "axios";
import { clearAuth, getAuthStorage } from "./authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

const publicPaths = ["/token/", "/token/refresh/", "/auth/register/", "/auth/invitation/", "/auth/accept-invitation/"];
const isPublicRequest = (config) => publicPaths.includes(config?.url?.split("?")[0]);

api.interceptors.request.use((config) => {
  const token = getAuthStorage().getItem("access_token");
  if (token && !isPublicRequest(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !isPublicRequest(originalRequest) && !originalRequest._retry) {
      originalRequest._retry = true;
      const storage = getAuthStorage();
      const refreshToken = storage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/token/refresh/`,
            { refresh: refreshToken },
            { withCredentials: false }
          );
          if (storage.getItem("refresh_token") !== refreshToken) return Promise.reject(error);
          storage.setItem("access_token", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          if (storage.getItem("refresh_token") === refreshToken) {
            clearAuth();
            window.location.href = "/login";
          }
        }
      } else {
        clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const publicApi = axios.create({ baseURL: api.defaults.baseURL, withCredentials: false });

export const extractError = (error, fallback) => {
  const detail = error.response?.data;
  if (detail && typeof detail === "object") {
    return Object.entries(detail)
      .map(([field, errs]) => (field === "detail" ? errs : `${field}: ${errs}`))
      .join("\n");
  }
  return fallback;
};

export function can(module, action = "view") {
  const storage = getAuthStorage();
  if (!module || !storage.getItem("access_token")) return false;
  if (["view", "see", "read"].includes(action)) return true;
  return storage.getItem("user_role") === "MANAGER";
}

export default api;
