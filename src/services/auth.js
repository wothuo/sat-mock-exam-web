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
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @param {string} userData.name - 姓名
 * @returns {Promise} 注册结果
 */
export const register = async (userData) => {
  const response = await post('/user-account/register', userData);
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