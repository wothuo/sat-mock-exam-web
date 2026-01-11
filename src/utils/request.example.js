/**
 * 请求Service使用示例
 * 这些示例展示了如何在项目中使用请求service
 */

import { message } from 'antd';

import { get, post, put, del, addRequestInterceptor, addResponseInterceptor } from './request';
import { saveAuthData, getToken, clearToken } from './token';

// ==================== 基础使用示例 ====================

// 1. GET请求
export const exampleGet = async () => {
  try {
    const response = await get('/users', { page: 1, pageSize: 10 });
    console.log('用户列表:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
};

// 2. POST请求
export const examplePost = async () => {
  try {
    const response = await post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('创建用户成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('创建用户失败:', error);
  }
};

// 3. PUT请求
export const examplePut = async (userId) => {
  try {
    const response = await put(`/users/${userId}`, {
      name: 'Jane Doe'
    });
    console.log('更新用户成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('更新用户失败:', error);
  }
};

// 4. DELETE请求
export const exampleDelete = async (userId) => {
  try {
    await del(`/users/${userId}`);
    message.success('删除用户成功');
  } catch (error) {
    console.error('删除用户失败:', error);
  }
};

// ==================== 高级配置示例 ====================

// 5. 不需要认证的请求
export const examplePublicRequest = async () => {
  const response = await get('/public/data', {}, {
    needAuth: false
  });
  return response.data;
};

// 6. 自定义错误处理
export const exampleCustomError = async () => {
  try {
    const response = await post('/api/data', {}, {
      showError: false // 不显示默认错误提示
    });
    return response.data;
  } catch (error) {
    // 自定义错误处理
    if (error.code === 1001) {
      message.warning('特定业务错误');
    } else {
      message.error('请求失败');
    }
    throw error;
  }
};

// 7. 自定义超时时间
export const exampleTimeout = async () => {
  const response = await post('/api/large-data', {}, {
    timeout: 60000 // 60秒超时
  });
  return response.data;
};

// 8. 自定义请求头
export const exampleCustomHeaders = async () => {
  const response = await post('/api/data', {}, {
    headers: {
      'X-Custom-Header': 'custom-value',
      'X-Request-ID': Date.now().toString()
    }
  });
  return response.data;
};

// ==================== 拦截器使用示例 ====================

// 9. 请求拦截器 - 添加时间戳
export const setupRequestInterceptor = () => {
  addRequestInterceptor((config) => {
    // 添加请求时间戳
    config.headers = {
      ...config.headers,
      'X-Request-Time': Date.now().toString()
    };
    return config;
  });
};

// 10. 请求拦截器 - 添加请求ID
export const setupRequestIdInterceptor = () => {
  addRequestInterceptor((config) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    config.headers = {
      ...config.headers,
      'X-Request-ID': requestId
    };
    return config;
  });
};

// 11. 响应拦截器 - 统一处理数据格式
export const setupResponseInterceptor = () => {
  addResponseInterceptor((response) => {
    // 统一处理响应数据
    if (response && response.data) {
      // 如果数据是数组，可以做一些统一处理
      if (Array.isArray(response.data)) {
        // 例如：添加分页信息
        response.data = {
          list: response.data,
          total: response.data.length
        };
      }
    }
    return response;
  });
};

// 12. 响应拦截器 - 统一日志记录
export const setupLoggingInterceptor = () => {
  addResponseInterceptor((response) => {
    // 开发环境记录请求日志
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response);
    }
    return response;
  });
};

// ==================== Token管理示例 ====================

// 13. 登录后保存token
export const exampleLogin = async (credentials) => {
  try {
    const response = await post('/auth/login', credentials, {
      needAuth: false // 登录接口不需要token
    });
    
    // 保存认证信息
    saveAuthData({
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn
    });
    
    message.success('登录成功');
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 14. 登出时清除token
export const exampleLogout = async () => {
  try {
    await post('/auth/logout');
    clearToken();
    message.success('登出成功');
  } catch (error) {
    // 即使请求失败，也清除本地token
    clearToken();
    console.error('登出失败:', error);
  }
};

// ==================== 在React组件中使用 ====================

// 15. 在函数组件中使用
export const useExampleInComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await get('/api/data');
      setData(response.data);
      message.success('获取数据成功');
    } catch (error) {
      // 错误已自动处理，这里可以做额外处理
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, fetchData };
};

// 16. 处理文件上传
export const exampleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await post('/api/upload', formData, {
      headers: {
        // 不要设置Content-Type，让浏览器自动设置multipart/form-data
      }
    });
    message.success('上传成功');
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};

// ==================== 错误处理示例 ====================

// 17. 处理不同类型的错误
export const exampleErrorHandling = async () => {
  try {
    const response = await get('/api/data', {}, {
      showError: false // 手动处理错误
    });
    return response.data;
  } catch (error) {
    // 根据错误类型进行不同处理
    if (error.name === 'AbortError') {
      message.warning('请求超时，请稍后重试');
    } else if (error.code === 401) {
      message.error('登录已过期，请重新登录');
      // 跳转到登录页
      window.location.href = '/#/login';
    } else if (error.code === 403) {
      message.error('没有权限访问该资源');
    } else if (error.code === 404) {
      message.error('请求的资源不存在');
    } else if (error.code >= 500) {
      message.error('服务器错误，请稍后重试');
    } else {
      message.error(error.message || '请求失败');
    }
    throw error;
  }
};

// ==================== 初始化配置示例 ====================

// 18. 在应用启动时配置拦截器
export const initRequestConfig = () => {
  // 添加请求拦截器
  addRequestInterceptor((config) => {
    // 添加请求时间戳
    config.headers = {
      ...config.headers,
      'X-Request-Time': Date.now().toString()
    };
    return config;
  });

  // 添加响应拦截器
  addResponseInterceptor((response) => {
    // 开发环境记录日志
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response);
    }
    return response;
  });
};

// 在 index.jsx 或 App.jsx 中调用
// initRequestConfig();

