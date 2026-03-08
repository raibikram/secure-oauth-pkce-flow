import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});


// Response interceptor for global error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    // Only try refresh if 401, not already retried, and not a refresh endpoint
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token
        await api.post("/api/auth/refresh");
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, optionally redirect to login or notify
        window.location.href = "/login";
        console.warn("Session expired. Please log in again.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
