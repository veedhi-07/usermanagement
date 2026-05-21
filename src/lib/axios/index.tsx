import axios from "axios";
import { HTTPStatus } from "../../types";

export const api = axios.create({
  baseURL: "http://192.168.1.141:8000/api/",
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
    // console.log("RESPONSE STATUS:", error.response?.status);
    // console.log("RESPONSE DATA:", error.response?.data);
    // console.log("HEADERS:", error.response?.headers);
    // console.log("REQUEST:", error.config);
    // console.log("MESSAGE:", error.message);
    // return Promise.reject(error);
    const status = error.response?.status;

    switch (status) {
      case HTTPStatus.UNAUTHORIZED:
        console.log("Unauthorized");

        localStorage.removeItem("token");
        break;

      case HTTPStatus.FORBIDDEN:
        console.log("forbidden");
        break;

      case HTTPStatus.NOT_FOUND:
        console.log("API Not Found");
        break;

      case HTTPStatus.INTERNAL_SERVER_ERROR:
        console.log("Server Error");
        break;

      default:
        console.log("Unknown Error");
    }
    return Promise.reject(error);
  },
);
