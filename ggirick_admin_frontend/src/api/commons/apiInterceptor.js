import axios from "axios";

const BASE_URL = "http://10.5.5.8:8082";

const api = axios.create();

api.interceptors.request.use(
    (config) => {
        config.baseURL = BASE_URL;
        // token 꺼내오기
        const token = sessionStorage.getItem("token");
        // 헤더 붙이기
        config.headers = {
                Authorization: `Bearer ${token}` // JWT 강 컨베션
            }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;