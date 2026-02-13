/**
 * 专项训练相关API服务
 */
import { get, post } from '../utils/request.ts';

/**
 * 开始练习
 * @param {Object} params - 练习参数
 * @param {string} params.questionCategory - 题目分类
 * @param {string} params.questionSubCategory - 题目子分类
 * @param {string} params.difficulty - 套题难度（简单/中等/困难）
 * @param {string} params.source - 题目来源（历年真题）
 * @param {string} params.records - 练习记录
 * @param {number} params.size - 题目数量
 *
 * @returns {Promise} 题目列表数据
 *
 * @returns {Object} return - 响应结果
 * @returns {number} return.code - 状态码（0-成功，非0-失败）
 * @returns {string} return.message - 响应消息
 *
 * @returns {string} return.data[].answerId - 题目作答ID
 *
 * @returns {Array} return.data - 题目列表数据
 * @returns {Object} return.data[].question - 题目信息实体
 * @returns {number} return.data[].question.questionId - 题目ID
 * @returns {number} return.data[].question.sectionId - 章节ID
 * @returns {string} return.data[].question.questionCategory - 题目分类（阅读/语法/数学）
 * @returns {string} return.data[].question.questionSubCategory - 题目子分类
 * @returns {string} return.data[].question.difficulty - 难度等级
 * @returns {string} return.data[].question.questionType - 题目类型（选择/填空）
 * @returns {string} return.data[].question.questionContent - 题目内容
 * @returns {string} return.data[].question.questionDescription - 问题描述
 * @returns {string} return.data[].question.options - 选项内容（JSON格式）
 * @returns {string} return.data[].question.answer - 正确答案
 * @returns {string} return.data[].question.analysis - 解析
 * @returns {number} return.data[].question.score - 题目分数
 * @returns {number} return.data[].question.status - 状态（0-正常，1-禁用）
 * @returns {number} return.data[].question.delFlag - 删除标志（0-正常，1-已删除）
 * @returns {number} return.data[].question.creatorId - 创建人ID
 * @returns {string} return.data[].question.createTime - 创建时间
 * @returns {string} return.data[].question.updateTime - 更新时间
 *
 * @returns {string} return.data[].sectionName - 套题Section名称
 * @returns {string} return.data[].sectionTiming - 套题Section限时（分钟）
 */
export const startPractice = async (params) => {
  const response = await post('/answer/practice/start', params);
  return response.data;
};

/**
 * 获取训练题目
 * @param {Object} params - 训练配置参数
 * @param {string} params.subject - 科目（阅读/语法/数学）
 * @param {string} params.questionType - 题目类型
 * @param {string} params.source - 题目来源
 * @param {string} params.dimension - 题目维度
 * @param {string} params.difficulty - 题目难度
 * @param {string} params.count - 练习题数
 * @param {string} params.viewMode - 查看模式(隐藏)
 * @returns {Promise} 题目列表
 */
export const fetchTrainingQuestions = async (params) => {
  const response = await post('/training/questions', params);
  return response.data;
};

/**
 * 提交训练答案
 * @param {Object} data - 答题数据
 * @param {string} data.trainingId - 训练ID
 * @param {Array} data.answers - 答案列表
 * @returns {Promise} 提交结果
 */
export const submitTrainingAnswers = async (data) => {
  const response = await post('/training/submit', data);
  return response.data;
};

/**
 * 获取训练记录
 * @param {Object} params - 查询参数
 * @param {string} params.subject - 科目
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 训练记录列表
 */
export const fetchTrainingRecords = async (params) => {
  const response = await get('/training/records', params);
  return response.data;
};

/**
 * 获取错题集
 * @param {Object} params - 查询参数
 * @param {string} params.subject - 科目
 * @param {string} params.questionType - 题目类型
 * @returns {Promise} 错题列表
 */
export const fetchWrongQuestions = async (params) => {
  const response = await get('/training/wrong-questions', params);
  return response.data;
};