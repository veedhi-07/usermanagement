import { axiosInstance } from "../axiosinstance";

export const apiClient = {
  get: (url: string) => axiosInstance.get(url).then((res) => res.data),
  post: (url: string, data: any) =>
    axiosInstance.post(url, data).then((res) => res.data),
  put: (url: string, data: any) =>
    axiosInstance.put(url, data).then((res) => res.data),
  delete: (url: string) => axiosInstance.delete(url).then((res) => res.data),
};
