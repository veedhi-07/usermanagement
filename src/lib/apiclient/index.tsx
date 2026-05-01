import { AxiosRequestConfig } from "axios";
import { api } from "../axios";

export const apiClient = {
  get: (url: string, config?: AxiosRequestConfig) =>
    api.get(url, config).then((res) => res.data),

  post: (url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post(url, data, config).then((res) => res.data),

  put: (url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put(url, data, config).then((res) => res.data),

  delete: (url: string, config?: AxiosRequestConfig) =>
    api.delete(url, config).then((res) => res.data),
};
//config so that we can pass header,timeout,queryparams..
