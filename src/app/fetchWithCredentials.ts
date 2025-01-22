import { environment } from './environment';

export interface FetchWithCredentialsOptions extends RequestInit {
    queryParams?: Record<string, string>; // 可选的查询参数
    returnRawResponse?: boolean; // 是否返回原始响应
}

export const fetchWithCredentials = async <T>(
    url: string,
    options: FetchWithCredentialsOptions = {}
): Promise<T | Response> => {
    // 处理 Query 参数
    let fullUrl = environment.backendBaseUrl + url;
    if (options.queryParams) {
        const queryString = new URLSearchParams(options.queryParams).toString();
        fullUrl += `?${queryString}`;
    }

    // 合并 Headers
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json', // 默认 JSON 请求
    };
    const headers: HeadersInit = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    // 构建最终请求配置
    const requestOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // 确保携带 Cookie
    };

    try {
        const response = await fetch(fullUrl, requestOptions);

        // 检查响应状态
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(
                `HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`
            );
        }

        // 返回原始响应或解析后的 JSON
        if (options.returnRawResponse) {
            return response; // 返回完整 Response 对象
        }
        return (await response.json()) as T; // 返回解析后的 JSON
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
