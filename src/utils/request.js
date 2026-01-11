/**
 * 统一请求Service
 * 适合小型创业团队的轻量级HTTP请求封装
 * 
 * 特性：
 * - 统一的请求/响应拦截器
 * - 自动token管理
 * - 统一错误处理
 * - 支持请求取消
 * - 支持loading状态管理
 */

import { message } from 'antd';

import { getApiBaseUrl } from './getApiBaseUrl';
import { navigate } from './router';
import { clearToken, getToken, isTokenExpired } from './token';

const API_BASE_URL = getApiBaseUrl();

// API基础配置
const REQUEST_TIMEOUT = 30000; // 30秒超时
const LOGIN_PATH = '/login'; // 登录页面路径

// 请求配置类型
/**
 * @typedef {Object} RequestConfig
 * @property {string} url - 请求URL
 * @property {string} method - 请求方法 (GET, POST, PUT, DELETE等)
 * @property {Object} data - 请求体数据
 * @property {Object} params - URL查询参数
 * @property {Object} headers - 自定义请求头
 * @property {boolean} needAuth - 是否需要认证（默认true）
 * @property {boolean} showError - 是否显示错误提示（默认true）
 * @property {boolean} showLoading - 是否显示loading（默认false，由业务层控制）
 * @property {number} timeout - 请求超时时间（毫秒）
 */

// 响应数据类型
/**
 * @typedef {Object} ApiResponse
 * @property {number} code - 响应码（0表示成功）
 * @property {string} message - 响应消息
 * @property {*} data - 响应数据
 */

// 请求拦截器队列
const requestInterceptors = [];
// 响应拦截器队列
const responseInterceptors = [];

/**
 * 添加请求拦截器
 * @param {Function} interceptor - 拦截器函数，接收config，返回config或Promise<config>
 */
export const addRequestInterceptor = (interceptor) => {
  requestInterceptors.push(interceptor);
};

/**
 * 添加响应拦截器
 * @param {Function} interceptor - 拦截器函数，接收response，返回response或Promise<response>
 */
export const addResponseInterceptor = (interceptor) => {
  responseInterceptors.push(interceptor);
};

/**
 * 执行请求拦截器
 * @param {RequestConfig} config - 请求配置
 * @returns {Promise<RequestConfig>} 处理后的配置
 */
const applyRequestInterceptors = async (config) => {
  let processedConfig = { ...config };
  for (const interceptor of requestInterceptors) {
    processedConfig = await interceptor(processedConfig);
  }
  return processedConfig;
};

/**
 * 执行响应拦截器
 * @param {ApiResponse} response - 响应数据
 * @returns {Promise<ApiResponse>} 处理后的响应
 */
const applyResponseInterceptors = async (response) => {
  let processedResponse = response;
  for (const interceptor of responseInterceptors) {
    processedResponse = await interceptor(processedResponse);
  }
  return processedResponse;
};

/**
 * 构建完整URL
 * @param {string} url - 相对或绝对URL
 * @param {Object} params - 查询参数
 * @returns {string} 完整URL
 */
const buildUrl = (url, params = {}) => {
  // 如果是绝对URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 拼接基础URL
  const baseUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
  
  // 添加查询参数
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}?${queryString}`;
  }
  
  return baseUrl;
};

/**
 * 创建AbortController用于取消请求
 */
const createAbortController = (timeout) => {
  const controller = new AbortController();
  if (timeout) {
    setTimeout(() => controller.abort(), timeout);
  }
  return controller;
};

/**
 * 统一错误处理
 * @param {Error} error - 错误对象
 * @param {boolean} showError - 是否显示错误提示（默认true）
 */
const handleError = (error, showError = true) => {
  let errorMessage = '请求失败，请稍后重试';
  
  if (error.name === 'AbortError') {
    errorMessage = '请求超时，请稍后重试';
  } else if (error.message) {
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
 * @param {RequestConfig} config - 请求配置
 * @returns {Promise<ApiResponse>} 响应数据
 */
const request = async (config) => {
  try {
    // 应用请求拦截器
    const processedConfig = await applyRequestInterceptors(config);
    
    const {
      url,
      method = 'GET',
      data,
      params,
      headers = {},
      needAuth = false,
      showError = true,
      timeout = REQUEST_TIMEOUT,
    } = processedConfig;

    // 构建完整URL
    const fullUrl = buildUrl(url, params);
    
    // 构建请求头
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // 添加认证token
    if (needAuth) {
      const token = getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
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
    
    // 创建AbortController
    const controller = createAbortController(timeout);
    
    // 构建fetch配置
    const fetchConfig = {
      method: method.toUpperCase(),
      headers: requestHeaders,
      signal: controller.signal,
    };
    
    // 添加请求体（GET和HEAD请求不添加）
    if (data && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      fetchConfig.body = JSON.stringify(data);
    }
    
    // 发送请求
    const response = await fetch(fullUrl, fetchConfig);
    
    // 处理HTTP错误状态
    if (!response.ok) {
      // 401未授权，清除token并跳转登录
      if (response.status === 401) {
        clearToken();
        const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
        if (currentPath !== LOGIN_PATH && !currentPath.endsWith(LOGIN_PATH)) {
          navigate(LOGIN_PATH);
        }
        throw new Error('登录已过期，请重新登录');
      }
      
      // 403禁止访问
      if (response.status === 403) {
        throw new Error('没有权限访问该资源');
      }
      
      // 404未找到
      if (response.status === 404) {
        throw new Error('请求的资源不存在');
      }
      
      // 500服务器错误
      if (response.status >= 500) {
        throw new Error('服务器错误，请稍后重试');
      }
      
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }
    
    // 解析响应数据
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // 应用响应拦截器
    const processedResponse = await applyResponseInterceptors(responseData);
    
    // 处理业务错误（假设code !== 0表示业务错误）
    if (processedResponse && typeof processedResponse === 'object' && processedResponse.code !== undefined) {
      if (processedResponse.code !== 0) {
        const error = new Error(processedResponse.message || '请求失败');
        error.code = processedResponse.code;
        error.data = processedResponse.data;
        if (showError) {
          message.error(processedResponse.message || '请求失败');
        }
        throw error;
      }
    }
    
    return processedResponse;
  } catch (error) {
    // 确保config存在，避免访问undefined属性
    const showError = config?.showError !== false; // 默认为true
    return handleError(error, showError);
  }
};

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @param {Object} config - 其他配置
 * @returns {Promise<ApiResponse>}
 */
export const get = (url, params = {}, config = {}) => {
  return request({
    url,
    method: 'GET',
    params,
    ...config,
  });
};

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @param {Object} config - 其他配置
 * @returns {Promise<ApiResponse>}
 */
export const post = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...config,
  });
};

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @param {Object} config - 其他配置
 * @returns {Promise<ApiResponse>}
 */
export const put = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...config,
  });
};

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} config - 其他配置
 * @returns {Promise<ApiResponse>}
 */
export const del = (url, config = {}) => {
  return request({
    url,
    method: 'DELETE',
    ...config,
  });
};

/**
 * PATCH请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @param {Object} config - 其他配置
 * @returns {Promise<ApiResponse>}
 */
export const patch = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'PATCH',
    data,
    ...config,
  });
};

// 默认导出request方法
export default request;

