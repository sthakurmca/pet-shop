import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const auth = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const pets = {
  list: (params) => api.get("/pets", { params }),
  getFilters: () => api.get("/pets/filters"),
  getOne: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post("/pets", data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
};

export const adoptions = {
  apply: (data) => api.post("/adoptions/apply", data),
  my: () => api.get("/adoptions/my"),
  all: (params) => api.get("/adoptions/all", { params }),
  review: (id, status) => api.put(`/adoptions/${id}/review`, { status }),
};
