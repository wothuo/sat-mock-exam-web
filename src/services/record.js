/**
 * 练习记录相关 API（错题记录等）
 */
import { post } from '../utils/request.ts';

/**
 * 获取错题记录列表（分页，支持筛选）
 * @param {Object} params
 * @param {number} [params.pageNum=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {string} [params.questionCategory] - 题目类别：全部/阅读/语法/数学（不传或传"全部"表示全部）
 * @param {string} [params.difficulty] - 难度：全部/简单/中等/困难（不传或传"全部"表示全部）
 * @param {string} [params.timeRange] - 时间范围：全部/最近一个月/最近三个月/最近半年（不传或传"全部"表示全部）
 * @returns {Promise<{ list: Array, total: number, pages: number, pageNum: number, pageSize: number }>}
 */
export const fetchWrongRecordList = async (params = {}) => {
  const {
    pageNum = 1,
    pageSize = 10,
    questionCategory,
    difficulty,
    timeRange,
  } = params;

  const requestBody = { pageNum, pageSize };
  if (questionCategory) requestBody.questionCategory = questionCategory;
  if (difficulty) requestBody.difficulty = difficulty;
  if (timeRange) requestBody.timeRange = timeRange;

  const res = await post('/record/wrong/myList', requestBody, { needAuth: true });
  // 兼容：res 为 axios 响应时取 res.data，为后端整包时直接用 res
  const body = res?.data != null && typeof res.data === 'object' && 'code' in res.data ? res.data : res;
  if (body?.code === 200 && body?.data) {
    const { list = [], total = 0, pages = 0, pageNum: pn, pageSize: ps } = body.data;
    return { list, total, pages, pageNum: pn ?? pageNum, pageSize: ps ?? pageSize };
  }
  return { list: [], total: 0, pages: 0, pageNum: 1, pageSize };
};