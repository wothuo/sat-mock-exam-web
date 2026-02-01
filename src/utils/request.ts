/**
 * 统一请求Service (基于 Axios)
 * 适合小型创业团队的轻量级HTTP请求封装
 * 
 * 特性：
 * - 统一的请求/响应拦截器
 * - 自动token管理
 * - 统一错误处理
 * - 支持请求取消
 * - 支持loading状态管理
 * - 基于 Axios，功能更强大
 */

import { message } from 'antd';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { getApiBaseUrl } from './getApiBaseUrl';
import { navigate } from './router';
import { clearToken, getToken, isTokenExpired } from './token';

const API_BASE_URL = getApiBaseUrl();

// API基础配置
const REQUEST_TIMEOUT = 30000; // 30秒超时
const LOGIN_PATH = '/login'; // 登录页面路径

// 请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
  needAuth?: boolean; // 是否需要认证（默认false）
  showError?: boolean; // 是否显示错误提示（默认true）
  showLoading?: boolean; // 是否显示loading（默认false，由业务层控制）
}

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number; // 响应码（0表示成功）
  message: string; // 响应消息
  data: T; // 响应数据
}

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器队列（自定义拦截器，在 axios 拦截器之后执行）
const customRequestInterceptors: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>> = [];
// 响应拦截器队列（自定义拦截器，在 axios 拦截器之后执行）
const customResponseInterceptors: Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>> = [];

/**
 * 添加请求拦截器（自定义拦截器）
 * @param interceptor - 拦截器函数，接收config，返回config或Promise<config>
 */
export const addRequestInterceptor = (interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>) => {
  customRequestInterceptors.push(interceptor);
};

/**
 * 添加响应拦截器（自定义拦截器）
 * @param interceptor - 拦截器函数，接收response，返回response或Promise<response>
 */
export const addResponseInterceptor = (interceptor: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>) => {
  customResponseInterceptors.push(interceptor);
};

/**
 * 执行自定义请求拦截器
 */
const applyCustomRequestInterceptors = async (config: RequestConfig): Promise<RequestConfig> => {
  let processedConfig = { ...config };
  for (const interceptor of customRequestInterceptors) {
    processedConfig = await interceptor(processedConfig);
  }
  return processedConfig;
};

/**
 * 执行自定义响应拦截器
 */
const applyCustomResponseInterceptors = async (response: ApiResponse): Promise<ApiResponse> => {
  let processedResponse = response;
  for (const interceptor of customResponseInterceptors) {
    processedResponse = await interceptor(processedResponse);
  }
  return processedResponse;
};

// Axios 请求拦截器
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 从 config 中获取自定义配置
    const customConfig = config as unknown as RequestConfig;
    
    // 应用自定义请求拦截器
    const processedConfig = await applyCustomRequestInterceptors(customConfig);
    
    // 处理认证token（默认 needAuth = false，只有显式设置为 true 时才需要认证）
    if (processedConfig.needAuth === true) {
      const token = getToken();
      if (token) {
        // 检查token是否过期
        if (isTokenExpired()) {
          clearToken();
          const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
          if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
            navigate(LOGIN_PATH);
          }
          throw new Error('登录已过期，请重新登录');
        }
        // 使用X-Session-ID替代Bearer Token
        config.headers['X-Session-ID'] = token;
      } else if (isTokenExpired()) {
        // Token过期，清除并跳转登录
        clearToken();
        const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
        if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
          navigate(LOGIN_PATH);
        }
        throw new Error('登录已过期，请重新登录');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios 响应拦截器
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const responseData = response.data;
    
    // 应用自定义响应拦截器
    const processedResponse = await applyCustomResponseInterceptors(responseData);
    
    // 处理业务错误（假设code !== 200表示业务错误）
    if (processedResponse && typeof processedResponse === 'object' && processedResponse.code !== undefined) {
      if (processedResponse.code !== 200) {
        const error = new Error(processedResponse.message || '请求失败');
        (error as any).code = processedResponse.code;
        (error as any).data = processedResponse.data;
        (error as any).response = response;
        throw error;
      }
    }
    
    return processedResponse;
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, statusText } = error.response;
      
      // 401未授权，清除token并跳转登录
      if (status === 401) {
        clearToken();
        const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
        if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
          navigate(LOGIN_PATH);
        }
        const authError = new Error('登录已过期，请重新登录');
        (authError as any).code = 401;
        return Promise.reject(authError);
      }
      
      // 403禁止访问
      if (status === 403) {
        const forbiddenError = new Error('没有权限访问该资源');
        (forbiddenError as any).code = 403;
        return Promise.reject(forbiddenError);
      }
      
      // 404未找到
      if (status === 404) {
        const notFoundError = new Error('请求的资源不存在');
        (notFoundError as any).code = 404;
        return Promise.reject(notFoundError);
      }
      
      // 500服务器错误
      if (status >= 500) {
        const serverError = new Error('服务器错误，请稍后重试');
        (serverError as any).code = status;
        return Promise.reject(serverError);
      }
      
      // 其他HTTP错误
      const httpError = new Error(`请求失败: ${status} ${statusText}`);
      (httpError as any).code = status;
      return Promise.reject(httpError);
    }
    
    // 网络错误或请求取消
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      const networkError = new Error('网络错误，请检查网络连接');
      (networkError as any).code = 'NETWORK_ERROR';
      return Promise.reject(networkError);
    }
    
    // 请求取消
    if (axios.isCancel(error)) {
      const cancelError = new Error('请求已取消');
      (cancelError as any).code = 'CANCELED';
      return Promise.reject(cancelError);
    }
    
    return Promise.reject(error);
  }
);

/**
 * 统一错误处理
 */
const handleError = (error: any, showError: boolean = true) => {
  let errorMessage = '请求失败，请稍后重试';
  
  if (error.message) {
    errorMessage = error.message;
  }
  
  if (showError) {
    message.error(errorMessage);
  }
  
  console.error('Request Error:', error);
  throw error;
};

/**
 * 核心请求方法
 * @param config - 请求配置
 * @returns Promise<ApiResponse> 响应数据
 */
const request = async <T = any>(config: RequestConfig): Promise<ApiResponse<T>> => {
  try {
    // 处理URL（如果是相对路径，axios会自动拼接baseURL）
    let url = config.url || '';
    
    // 如果是绝对URL，需要特殊处理
    if (url.startsWith('http://') || url.startsWith('https://')) {
      config.baseURL = undefined; // 清除baseURL
    }
    
    // 发送请求
    const response = await axiosInstance.request<ApiResponse<T>>(config);
    
    return response;
  } catch (error: any) {
    const showError = config?.showError !== false; // 默认为true
    return handleError(error, showError);
  }
};

/**
 * GET请求
 * @param url - 请求URL
 * @param params - 查询参数
 * @param config - 其他配置
 * @returns Promise<ApiResponse>
 */
export const get = <T = any>(url: string, params: Record<string, any> = {}, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  return request<T>({
    url,
    method: 'GET',
    params,
    ...config,
  });
};

/**
 * POST请求
 * @param url - 请求URL
 * @param data - 请求体数据
 * @param config - 其他配置
 * @returns Promise<ApiResponse>
 */
export const post = <T = any>(url: string, data: any = {}, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...config,
  });
};

/**
 * PUT请求
 * @param url - 请求URL
 * @param data - 请求体数据
 * @param config - 其他配置
 * @returns Promise<ApiResponse>
 */
export const put = <T = any>(url: string, data: any = {}, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...config,
  });
};

/**
 * DELETE请求
 * @param url - 请求URL
 * @param config - 其他配置
 * @returns Promise<ApiResponse>
 */
export const del = <T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  return request<T>({
    url,
    method: 'DELETE',
    ...config,
  });
};

/**
 * PATCH请求
 * @param url - 请求URL
 * @param data - 请求体数据
 * @param config - 其他配置
 * @returns Promise<ApiResponse>
 */
export const patch = <T = any>(url: string, data: any = {}, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  return request<T>({
    url,
    method: 'PATCH',
    data,
    ...config,
  });
};

// 导出 axios 实例，供高级用法使用
export { axiosInstance };

// 默认导出request方法
export default request;