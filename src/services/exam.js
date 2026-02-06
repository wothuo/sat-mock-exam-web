/**
 * 套题管理相关API服务
 */
import { get, post } from '../utils/request.ts';

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
  const response = await get('/exam/list', params);
  return response.data;
};

/**
 * 新增套题
 * @param {Object} data - 套题数据
 * @param {string} data.examName - 套题名称
 * @param {string} data.examType - 套题类型（如：SAT）
 * @param {string} data.examYear - 套题年份
 * @param {string} data.examRegion - 套题地区
 * @param {string} data.difficulty - 套题难度（EASY/MEDIUM/HARD）
 * @param {string} [data.examDescription] - 套题描述
 * @param {string} [data.source] - 套题来源
 * @param {number} data.creatorId - 创建人ID
 * @param {number} [data.status] - 状态（0-正常/1-禁用，默认0）
 * @returns {Promise} 新增的套题数据
 */
export const createExamSet = async (data) => {
  const response = await post('/exam/create', data);
  return response.data;
};

/**
 * 更新套题
 * @param {Object} data - 套题数据
 * @param {number} data.examId - 套题ID
 * @param {string} data.examName - 套题名称
 * @param {string} data.examType - 套题类型（如：SAT）
 * @param {string} data.examYear - 套题年份
 * @param {string} data.examRegion - 套题地区
 * @param {string} data.difficulty - 套题难度（EASY/MEDIUM/HARD）
 * @param {string} [data.examDescription] - 套题描述
 * @param {string} [data.source] - 套题来源
 * @param {number} [data.status] - 状态（0-正常/1-禁用，默认0）
 * @returns {Promise} 更新后的套题数据
 */
export const updateExamSet = async (data) => {
  const response = await post('/exam/update', data);
  return response.data;
};

/**
 * 新增套题Section
 * @param {Object} data - Section数据
 * @param {number} data.examId - 关联套题ID
 * @param {string} data.sectionName - Section名称
 * @param {string} data.sectionCategory - Section分类（如：阅读语法/数学）
 * @param {number} data.sectionTiming - Section限时（分钟）
 * @param {number} data.creatorId - 创建人ID
 * @param {number} [data.status] - 状态（0-正常/1-禁用，默认0）
 * @returns {Promise} 新增的Section数据
 */
export const createExamSection = async (data) => {
  const response = await post('/exam/create/section', data);
  return response.data;
};

/**
 * 更新套题Section
 * @param {Object} data - Section数据
 * @param {number} data.sectionId - Section ID
 * @param {number} data.examId - 关联套题ID
 * @param {string} data.sectionName - Section名称
 * @param {string} data.sectionCategory - Section分类（如：阅读语法/数学）
 * @param {number} data.sectionTiming - Section限时（分钟）
 * @param {number} [data.status] - 状态（0-正常/1-禁用，默认0）
 * @returns {Promise} 更新后的Section数据
 */
export const updateExamSection = async (data) => {
  const response = await post('/exam/update/section', data);
  return response.data;
};

/**
 * 批量新增题目
 * @param {Array} data - 题目数据数组
 * @param {number} data[].examId - 关联套题ID
 * @param {number} data[].sectionId - 关联Section ID
 * @param {string} data[].questionType - 题目类型（CHOICE-选择题）
 * @param {string} data[].questionCategory - 题目分类（READING-阅读/WRITING-写作/MATH-数学）
 * @param {string} data[].questionSubCategory - 题目子分类（如：词汇题/细节题）
 * @param {string} data[].difficulty - 题目难度（EASY/MEDIUM/HARD）
 * @param {string} data[].questionContent - 题目内容
 * @param {string} [data[].questionDescription] - 题目描述
 * @param {string} data[].optionA - 选项A（选择题必填）
 * @param {string} data[].optionB - 选项B（选择题必填）
 * @param {string} data[].optionC - 选项C（选择题必填）
 * @param {string} data[].optionD - 选项D（选择题必填）
 * @param {string} data[].answer - 正确答案
 * @returns {Promise} 批量新增的题目结果
 */
export const batchCreateQuestions = async (data) => {
  const response = await post('/question/create', data);
  return response.data;
};