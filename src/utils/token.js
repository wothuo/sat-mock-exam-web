/**
 * Token管理工具
 * 用于统一管理用户认证token
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRE_KEY = 'token_expire';
const TOKEN_EXPIRE_BUFFER = 300; // Token过期缓冲时间（秒），提前5分钟过期

/**
 * 获取访问token
 * @returns {string|null} token字符串
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token from localStorage:', error);
    return null;
  }
};

/**
 * 设置访问token
 * @param {string} token - token字符串
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set token to localStorage:', error);
    throw new Error('无法保存登录信息，请检查浏览器设置');
  }
};

/**
 * 获取刷新token
 * @returns {string|null} refresh token字符串
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token from localStorage:', error);
    return null;
  }
};

/**
 * 设置刷新token
 * @param {string} token - refresh token字符串
 */
export const setRefreshToken = (token) => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set refresh token to localStorage:', error);
    // refresh token失败不影响主流程，只记录错误
  }
};

/**
 * 设置token过期时间
 * @param {number} expireTime - 过期时间戳（毫秒）
 */
export const setTokenExpire = (expireTime) => {
  try {
    localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString());
  } catch (error) {
    console.error('Failed to set token expire time to localStorage:', error);
    // 过期时间设置失败不影响主流程
  }
};

/**
 * 检查token是否过期
 * @returns {boolean} 是否过期
 */
export const isTokenExpired = () => {
  try {
    const expireTime = localStorage.getItem(TOKEN_EXPIRE_KEY);
    if (!expireTime) return true;
    
    const expireTimestamp = parseInt(expireTime, 10);
    // 验证parseInt结果是否有效
    if (isNaN(expireTimestamp)) {
      console.warn('Invalid token expire time, treating as expired');
      return true;
    }
    
    return Date.now() > expireTimestamp;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    // 出错时保守处理，认为已过期
    return true;
  }
};

/**
 * 清除所有token信息
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRE_KEY);
  } catch (error) {
    console.error('Failed to clear tokens from localStorage:', error);
    // 清除失败不影响流程，只记录错误
  }
};

/**
 * 保存完整的认证信息
 * @param {Object} authData - 认证数据
 * @param {string} authData.token - 访问token
 * @param {string} authData.refreshToken - 刷新token
 * @param {number} authData.expiresIn - 过期时间（秒）
 */
export const saveAuthData = ({ token, refreshToken, expiresIn }) => {
  setToken(token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  if (expiresIn) {
    // 提前过期缓冲时间，避免边界情况
    const expireTime = Date.now() + (expiresIn - TOKEN_EXPIRE_BUFFER) * 1000;
    setTokenExpire(expireTime);
  }
};

