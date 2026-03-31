import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://69ca0215ba5984c44bf27008.mockapi.io/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request) => {
    const faketoken = "dummy-07";

    request.headers.Authorization = `Bearer ${faketoken}`;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
)
