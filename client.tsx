import axios from "axios";

// В dev режиме используем относительные пути (работает через Vite proxy)
// В продакшене nginx проксирует /api на backend
// Если VITE_API_URL не установлен или содержит Docker имя, используем относительный путь
const envApiUrl = import.meta.env.VITE_API_URL;
const API = envApiUrl && !envApiUrl.includes("backend:") 
  ? envApiUrl 
  : ""; // Относительный путь - работает через proxy

// Логируем для отладки (только в dev)
if (import.meta.env.DEV) {
  console.log("API Base URL:", API || "(относительный путь - через proxy)");
}

const client = axios.create({
  baseURL: API
});

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("tg_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если получили 401 или 403, перенаправляем на логин
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = window.location.pathname;
      // Не перенаправляем если уже на странице логина
      if (currentPath !== "/login" && currentPath !== "/") {
        localStorage.removeItem("tg_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
