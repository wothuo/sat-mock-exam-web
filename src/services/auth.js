/**
 * 认证相关API服务
 */
import { get, post } from '../utils/request.ts';

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 账户
 * @param {string} credentials.password - 密码
 * @returns {Promise} 登录结果，包含sessionID信息
 */
export const login = async (credentials) => {
  const response = await post('/user/login', credentials);
  return response.data;
};

/**
 * 用户注册
 * @param {Object} userData - 用户注册信息
 * @returns {Promise} 注册结果
 */
export const register = async (userData) => {
  const response = await post('/user/register', userData);
  return response.data;
};

/**
 * 发送手机验证码
 * @param {string} phone - 手机号
 * @returns {Promise} 发送结果
 */
export const sendCode = async (phone) => {
  // sendCode 接口使用 RequestParam 接收 phone，所以这里作为 query param 传递，
  // 或者修改 request.ts 的 post 方法支持 query params。
  // 也可以简单地拼接 url: `/user/sendCode?phone=${phone}`
  // 查看 request.ts，post 签名是 (url, data, config)
  // 假设后端接受 param，通常 post body 也可以，但 UserController 定义的是 @RequestParam。
  // 为了保险，使用 query param 方式调用。
  const response = await post(`/user/sendCode?phone=${phone}`, {});
  return response.data;
};

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = async () => {
  const response = await post('/user/logout', {}, { needAuth: true });
  return response.data;
};

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getCurrentUser = async () => {
  const response = await get('/user/me', {}, { needAuth: true });
  return response.data;
};

/**
 * 刷新sessionID
 * @returns {Promise} 新的sessionID信息
 */
export const refreshToken = async () => {
  const response = await post('/user/refresh', {}, { needAuth: true });
  return response.data;
};