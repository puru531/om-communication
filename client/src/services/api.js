import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login page
    }
    return Promise.reject(error);
  },
);

export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
};

export const invoices = {
  create: (invoiceData) => api.post("/invoices", invoiceData),
  getAll: (params = {}) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  downloadPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" }),
};

export default api;
