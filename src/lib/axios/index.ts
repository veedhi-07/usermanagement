import axios from "axios";

export const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("RESPONSE STATUS:", error.response?.status);
    console.log("RESPONSE DATA:", error.response?.data);
    console.log("HEADERS:", error.response?.headers);
    console.log("REQUEST:", error.config);
    console.log("MESSAGE:", error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);
