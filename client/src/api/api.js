import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Antes de cada requisição, ele pega o token e adiciona no cabeçalho
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;