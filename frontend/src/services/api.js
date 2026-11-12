import axios from "axios";
import { getStored, clearSession } from "../utils/session";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 15000
});

const isAuthRequest = (url = "") =>
  /\/api\/auth\/(login|register)(?:[/?#]|$)/.test(url);

api.interceptors.request.use(
  (config) => {
    const token = getStored("token");

    if (token && !isAuthRequest(config.url)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (
      status === 401 &&
      !isAuthRequest(error.config?.url)
    ) {
      clearSession();

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new Event("aerobreath:session-expired")
        );
      }
    }

    return Promise.reject(error);
  }
);

export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) =>
  api.post(url, data, config);
export const put = (url, data, config) =>
  api.put(url, data, config);
export const del = (url, config) => api.delete(url, config);

export { api };
export default api;