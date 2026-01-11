/**
 * 专项训练相关API服务
 */
import { get, post } from '../utils/request';

/**
 * 获取训练题目
 * @param {Object} params - 训练配置参数
 * @param {string} params.subject - 科目（阅读/语法/数学）
 * @param {string} params.questionType - 题目类型
 * @param {string} params.source - 题目来源
 * @param {string} params.dimension - 题目维度
 * @param {string} params.difficulty - 题目难度
 * @param {string} params.count - 练习题数
 * @param {string} params.viewMode - 查看模式
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

