/**
 * 套题管理相关API服务
 */
import { get } from '../utils/request.ts';

/**
 * 获取套题列表
 * @param {Object} params - 查询参数
 * @param {string} params.examType - 考试类型（必填，如：SAT/IELTS/TOEFL）
 * @param {string} params.examCategory - 套题类别（可选，如：官方样题/历年考题）
 * @param {string} params.examYear - 套题年份（可选，如：2025/2024）
 * @param {string} params.examRegion - 套题地区（可选，如：北美/亚太）
 * @param {number} params.pageNum - 页码（可选，默认1）
 * @param {number} params.pageSize - 每页条数（可选，默认10）
 * @returns {Promise} 套题列表数据（包含分页信息）
 */
export const getExamSetList = async (params) => {
  const response = await get('/api/exam/task/set/list', params, {
    // needAuth: true, // 需要认证
  });
  return response.data;
};

