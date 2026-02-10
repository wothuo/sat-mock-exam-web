/**
 * Token/SessionID管理工具
 * 用于统一管理用户认证信息，支持token和sessionID两种认证方式
 */

const TOKEN_KEY = 'auth_token'; // 兼容旧的token命名，实际存储sessionID
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRE_KEY = 'token_expire';
const USER_INFO_KEY = 'user_info';
const SESSION_CONFLICT_KEY = 'session_conflict'; // 会话冲突标记
const TOKEN_EXPIRE_BUFFER = 300; // Token过期缓冲时间（秒），提前5分钟过期

// 会话冲突监听器
const sessionConflictListeners = [];

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
  // 移除前端本地过期判断，完全依赖后端返回的 401 状态码
  // 只要 token 存在，就认为格式上有效，具体有效性由后端验证
  return !getToken();
};

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Failed to get user info from localStorage:', error);
    return null;
  }
};

/**
 * 设置用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export const setUserInfo = (userInfo) => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('Failed to set user info to localStorage:', error);
    // 用户信息设置失败不影响主流程，只记录错误
  }
};

/**
 * 检查是否有有效的认证信息
 * @returns {boolean} 是否有有效的认证信息
 */
const hasValidAuth = () => {
  try {
    const token = getToken();
    return !!token && !isTokenExpired();
  } catch (error) {
    console.error('Failed to check valid auth:', error);
    return false;
  }
};

/**
 * 发送登录状态变化事件
 */
const emitLoginStatusChange = () => {
  // 创建自定义事件
  const event = new CustomEvent('loginStatusChange', {
    detail: {
      isLoggedIn: hasValidAuth()
    }
  });

  // 触发事件
  window.dispatchEvent(event);
  console.log('Login status change event emitted');
};

/**
 * 保存完整的认证信息
 * @param {Object} authData - 认证数据
 * @param {string} authData.token - 访问token（兼容旧字段）
 * @param {string} authData.sessionId - sessionID
 * @param {string} authData.refreshToken - 刷新token
 * @param {number} authData.expiresIn - 过期时间（秒）
 * @param {number} authData.sessionTimeout - 过期时间（秒）
 * @param {Object} userInfo - 用户信息
 */
export const saveAuthData = ({ token, sessionId, refreshToken, expiresIn, sessionTimeout, ...userInfo }) => {
  try {
    // 清除可能存在的会话冲突标记
    clearSessionConflict();

    // 优先使用sessionId，兼容token
    const authToken = sessionId || token;
    if (authToken) {
      setToken(authToken);
    }

    // 刷新token在Cookie认证中可能不需要，但保留以兼容
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    // 处理过期时间
    const timeout = sessionTimeout || expiresIn;
    if (timeout) {
      // 提前过期缓冲时间，避免边界情况
      const expireTime = Date.now() + (timeout - TOKEN_EXPIRE_BUFFER) * 1000;
      setTokenExpire(expireTime);
    }

    // 保存用户信息（排除认证相关字段）
    if (Object.keys(userInfo).length > 0) {
      setUserInfo(userInfo);
    }

    // 发送登录状态变化事件
    emitLoginStatusChange();
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
};

/**
 * 清除所有认证信息
 * @param {boolean} isConflict - 是否因会话冲突而清除
 */
export const clearToken = (isConflict = false) => {
  try {
    // 先保存是否有有效认证信息
    const hadValidAuth = hasValidAuth();

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRE_KEY);
    localStorage.removeItem(USER_INFO_KEY);

    // 只有当之前有有效认证信息且是因为会话冲突而清除时，才触发会话冲突
    if (isConflict && hadValidAuth) {
      triggerSessionConflict();
    }

    // 发送登录状态变化事件
    emitLoginStatusChange();
  } catch (error) {
    console.error('Failed to clear tokens from localStorage:', error);
    // 清除失败不影响流程，只记录错误
  }
};

/**
 * 清除会话冲突标记
 */
export const clearSessionConflict = () => {
  try {
    localStorage.removeItem(SESSION_CONFLICT_KEY);
  } catch (error) {
    console.error('Failed to clear session conflict flag:', error);
  }
};

/**
 * 检查是否存在会话冲突
 * @returns {boolean} 是否存在会话冲突
 */
export const hasSessionConflict = () => {
  try {
    return localStorage.getItem(SESSION_CONFLICT_KEY) === 'true';
  } catch (error) {
    console.error('Failed to check session conflict:', error);
    return false;
  }
};

/**
 * 触发会话冲突事件
 */
export const triggerSessionConflict = () => {
  try {
    // 保存会话冲突标记
    localStorage.setItem(SESSION_CONFLICT_KEY, 'true');

    // 通知所有监听器
    sessionConflictListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Session conflict listener error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to trigger session conflict:', error);
  }
};

/**
 * 添加会话冲突监听器
 * @param {Function} listener - 监听器函数
 */
export const addSessionConflictListener = (listener) => {
  if (typeof listener === 'function' && !sessionConflictListeners.includes(listener)) {
    sessionConflictListeners.push(listener);
  }
};

/**
 * 移除会话冲突监听器
 * @param {Function} listener - 监听器函数
 */
export const removeSessionConflictListener = (listener) => {
  const index = sessionConflictListeners.indexOf(listener);
  if (index > -1) {
    sessionConflictListeners.splice(index, 1);
  }
};

/**
 * 验证会话有效性
 * @returns {boolean} 会话是否有效
 */
export const isSessionValid = () => {
  try {
    const token = getToken();
    if (!token) return false;

    // 检查是否过期
    if (isTokenExpired()) return false;

    // 检查是否存在会话冲突
    if (hasSessionConflict()) return false;

    return true;
  } catch (error) {
    console.error('Failed to validate session:', error);
    return false;
  }
};

/**
 * 会话心跳机制
 * 定期检查会话有效性，处理会话过期和冲突
 * @param {number} interval - 检查间隔（毫秒）
 * @returns {Function} 清理函数
 */
export const startSessionHeartbeat = (interval = 30000) => {
  // 移除本地过期检查的心跳，避免误杀有效会话
  // 会话过期完全由后端 API 响应触发
  return () => {};
};