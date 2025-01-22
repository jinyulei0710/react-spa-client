import axios from 'axios';
import {environment} from './environment';


// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: environment.backendBaseUrl, // 设置默认基础 URL
    withCredentials: true, // 允许发送 Cookie（必要时）
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 确保只为相对 URL 添加 BASE_URL
        if (!config.url.startsWith('http')) {
            config.url = `${environment.backendBaseUrl}${config.url}`;
        }

        // 获取 CSRF 令牌（通常从 Cookie 或 Meta 标签中获取）
        const csrfToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (csrfToken) {
            // 设置 CSRF 令牌到请求头
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器（可选）
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 可以在这里统一处理错误
        return Promise.reject(error);
    }
);

export default axiosInstance;
