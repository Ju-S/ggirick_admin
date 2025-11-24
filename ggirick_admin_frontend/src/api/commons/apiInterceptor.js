import axios from "axios";

const BASE_URL = "https://ggirick-admin-368108639987.asia-northeast3.run.app";
//const BASE_URL = "http://192.168.219.110:8082";


const api = axios.create();

api.interceptors.request.use(
    (config) => {
        config.baseURL = BASE_URL;
        // token 꺼내오기
        const token = sessionStorage.getItem("token");
        // 헤더 붙이기
        config.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;