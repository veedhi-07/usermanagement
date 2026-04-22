import { api } from "../axios";

export const apiClient = {
  get: (url: string) => api.get(url).then((res) => res.data),

  post: (url: string, data: any) => api.post(url, data).then((res) => res.data),

  put: (url: string, data: any) => api.put(url, data).then((res) => res.data),

  patch: (url: string, data: any) =>
    api.patch(url, data).then((res) => res.data),

  delete: (url: string) => api.delete(url).then((res) => res.data),
};
