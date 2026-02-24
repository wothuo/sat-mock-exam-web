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

// 防止重复提示登录过期消息的标志
let isShowingAuthError = false;

// 全局错误消息队列，确保一次只显示一个重要错误
let errorQueue: Array<{message: string, type: 'auth' | 'server' | 'network' | 'other', priority: number}> = [];
let isShowingError = false;

// 错误优先级定义
const ERROR_PRIORITY = {
  auth: 3,      // 认证错误优先级最高
  server: 2,    // 服务器错误次之
  network: 1,   // 网络错误再次
  other: 0      // 其他错误优先级最低
};

// 处理错误队列
const processErrorQueue = () => {
  if (isShowingError || errorQueue.length === 0) return;

  // 按优先级排序
  errorQueue.sort((a, b) => b.priority - a.priority);

  // 取优先级最高的错误
  const error = errorQueue.shift();
  if (!error) return;

  isShowingError = true;
  message.error(error.message);

  // 3秒后处理下一个错误
  setTimeout(() => {
    isShowingError = false;
    processErrorQueue();
  }, 3000);
};

// 添加错误到队列
const addErrorToQueue = (errorMessage: string, type: 'auth' | 'server' | 'network' | 'other') => {
  // 检查是否已存在相同类型且优先级更高的错误
  const existingHigherPriority = errorQueue.some(e =>
      e.type === type && e.priority >= ERROR_PRIORITY[type]
  );

  if (!existingHigherPriority) {
    errorQueue.push({
      message: errorMessage,
      type,
      priority: ERROR_PRIORITY[type]
    });

    processErrorQueue();
  }
};

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
  withCredentials: true, // 启用Cookie支持，用于Session认证
});

// 会话冲突标记
let isSessionConflict = false;

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
    
    // 获取sessionID
    const sessionId = getToken();
    
    // 为所有请求添加X-Session-ID头（无论是否过期，都携带让后端验证）
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
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
    
    // 处理业务错误
    if (processedResponse && typeof processedResponse === 'object' && processedResponse.code !== undefined) {
      // 支持code 0和200两种成功响应
      const isSuccess = processedResponse.code === 0 || processedResponse.code === 200;
      
      if (!isSuccess) {
        // 检查是否为会话冲突错误
        const isSessionConflictError = processedResponse.message?.includes('其他地方登录') ||
                                      processedResponse.message?.includes('账号在其他设备登录');
        
        // 检查是否为认证相关错误
        const isAuthError = processedResponse.code === 401 || 
                          isSessionConflictError ||
                          processedResponse.message?.includes('会话已过期') ||
                          processedResponse.message?.includes('登录已过期');

        if (isAuthError) {
          // 防止重复提示
          if (!isShowingAuthError) {
            isShowingAuthError = true;

            let errorMessage = '';
            if (isSessionConflictError) {
              isSessionConflict = true; // 标记为会话冲突
              errorMessage = '您的账号已在其他设备登录，将被强制退出';
            } else {
              errorMessage = '登录已过期，请重新登录';
            }

            // 添加到错误队列，优先级最高
            addErrorToQueue(errorMessage, 'auth');

            // 3秒后重置标志，允许下次再次提示
            setTimeout(() => {
              isShowingAuthError = false;
            }, 3000);
          }

          clearToken();
          const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
          if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
            navigate('/', { state: { from: currentPath, sessionConflict: isSessionConflict } });
          }
        }
        
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
      
      // 401未授权，根据错误信息进行精细化处理
      if (status === 401) {
        clearToken();
        const currentPath = window.location.hash.replace('#', '') || window.location.pathname;

        // 防止重复提示
        if (!isShowingAuthError) {
          isShowingAuthError = true;

          // 获取错误信息
          let errorMessage = '登录信息已失效，请重新登录';
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          // 添加到错误队列，优先级最高
          addErrorToQueue(errorMessage, 'auth');

          // 3秒后重置标志，允许下次再次提示
          setTimeout(() => {
            isShowingAuthError = false;
          }, 3000);
        }

        // 跳转到主页
        if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
          navigate('/');
        }

        const authError = new Error('登录信息已失效');
        (authError as any).code = 401;
        return Promise.reject(authError);
      }
      
      // 403禁止访问
      if (status === 403) {
        const forbiddenError = new Error('没有权限访问该资源');
        (forbiddenError as any).code = 403;

        // 添加到错误队列，优先级较低
        addErrorToQueue('没有权限访问该资源', 'other');

        return Promise.reject(forbiddenError);
      }

      // 404未找到
      if (status === 404) {
        const notFoundError = new Error('请求的资源不存在');
        (notFoundError as any).code = 404;

        // 添加到错误队列，优先级较低
        addErrorToQueue('请求的资源不存在', 'other');

        return Promise.reject(notFoundError);
      }
      
      // 500服务器错误
      if (status >= 500) {
        const serverError = new Error('服务器错误，请稍后重试');
        (serverError as any).code = status;

        // 添加到错误队列，优先级次之
        addErrorToQueue('服务器错误，请稍后重试', 'server');

        return Promise.reject(serverError);
      }
      
      // 其他HTTP错误
      const httpError = new Error(`请求失败: ${status} ${statusText}`);
      (httpError as any).code = status;
      addErrorToQueue(`请求失败: ${status} ${statusText}`, 'other');
      return Promise.reject(httpError);
    }
    
    // 网络错误或请求取消
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      const networkError = new Error('网络错误，请检查网络连接');
      (networkError as any).code = 'NETWORK_ERROR';
      addErrorToQueue('网络错误，请检查网络连接', 'network');
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
 * 请求取消（AbortController/axios CancelToken）不展示错误提示，属于预期行为
 */
const handleError = (error: any, showError: boolean = true) => {
  const isCancel = axios.isCancel(error) || error?.code === 'CANCELED' || error?.name === 'AbortError';

  if (showError && !isCancel) {
    const errorMessage = error?.message || '请求失败，请稍后重试';

    // 判断错误类型并添加到队列
    if (errorMessage.includes('登录') || errorMessage.includes('会话') || errorMessage.includes('认证')) {
      addErrorToQueue(errorMessage, 'auth');
    } else if (errorMessage.includes('服务器') || errorMessage.includes('服务')) {
      addErrorToQueue(errorMessage, 'server');
    } else if (errorMessage.includes('网络') || errorMessage.includes('连接')) {
      addErrorToQueue(errorMessage, 'network');
    } else {
      addErrorToQueue(errorMessage, 'other');
    }
  }

  if (!isCancel) {
    console.error('Request Error:', error);
  }
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