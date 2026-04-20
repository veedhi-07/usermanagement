import axios from "axios";

export const api = axios.create({
    baseURL : "http://192.168.1.141:6000"
});

api.interceptors.request.use (
    (request)
)