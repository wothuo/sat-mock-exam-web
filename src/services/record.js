/**
 * 练习记录相关 API（错题记录等）
 */
import { get } from '../utils/request.ts';

/**
 * 获取错题记录列表
 * @param {number} userId - 用户ID（必填，一般从登录态 getUserInfo().userId 获取）
 * @returns {Promise<Array>} 错题列表，后端 WrongRecordVO[]，需由调用方转换为前端展示结构
 */
export const fetchWrongRecordList = async (userId) => {
  const res = await get('/record/wrong', { userId }, { needAuth: true });
  if (res && (res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};
