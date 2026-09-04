import axios from "axios";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    if (!response) {
      // Network error
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
      });
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        // Unauthenticated — clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;
      case 403:
        // Unauthorized
        break;
      case 409:
        // OCC conflict — let the caller handle this
        return Promise.reject({
          status: 409,
          message:
            data.message ||
            "Data has been modified. Please refresh and try again.",
          expectedVersion: data.expectedVersion,
          currentVersion: data.currentVersion,
        });
      case 500:
        // Server error
        break;
    }

    return Promise.reject({
      status,
      message: data.message || "Something went wrong.",
      errors: data.errors || null,
    });
  },
);

// ─── API Methods ────────────────────────────────────────────────────────────────

// Commands (Write Side)
export const commandAPI = {
  createShipment: (data) => {
    const token = localStorage.getItem("token");

    return api.post("/commands/shipment/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  moveShipment: (id, data) => api.post(`/commands/shipment/${id}/move`, data),
  recordTemperature: (id, data) =>
    api.post(`/commands/shipment/${id}/temperature`, data),
  arriveShipment: (id, data) =>
    api.post(`/commands/shipment/${id}/arrive`, data),
};

// Queries (Read Side)
export const queryAPI = {
  getShipments: (params) => api.get("/queries/shipments", { params }),
  getDashboardSummary: () => api.get("/queries/dashboard/summary"),
  getShipment: (id) => api.get(`/queries/shipment/${id}`),
  getShipmentEvents: (id, params) =>
    api.get(`/queries/shipment/${id}/events`, { params }),
  getShipmentTimeline: (id) => api.get(`/queries/shipment/${id}/timeline`),
  getShipmentState: (id, date) =>
    api.get(`/queries/shipment/${id}/state`, { params: { date } }),
  getShipmentAnalytics: (id) => api.get(`/queries/shipment/${id}/analytics`),
  getAlerts: (params) => api.get("/queries/alerts", { params }),
  getShipmentAlerts: (id) => api.get(`/queries/shipment/${id}/alerts`),
};

// Auth
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
};

export default api;
