import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://69ca0215ba5984c44bf27008.mockapi.io/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});
