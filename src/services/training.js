/**
 * 专项训练相关API服务
 */
import { get, post } from '../utils/request.ts';

/**
 * 专项训练开始作答
 * @param {Object} params - 练习参数
 * @param {string} params.questionCategory - 题目分类（阅读-READING/语法-WRITING/数学-MATH）
 * @param {string} params.questionSubCategory - 题目子分类
 * @param {string} params.difficulty - 题目难度（简单-EASY/中等-MEDIUM/困难-HARD）
 * @param {string} params.source - 题目来源（历年真题-PAST_YEAR）
 * @param {string} params.records - 练习记录类型（UNPRACTICED-未练习/WRONG_ONCE-做错一次/WRONG_TWICE_OR_MORE-做错两次及以上/WRONG_IN_RECENT_WEEK-最近一周错题/ALL-全部）
 * @param {number} params.size - 题目数量（不指定则返回所有符合条件的题目）
 *
 * @returns {Promise} 专项训练数据
 *
 * @returns {Object} return - 响应结果
 * @returns {number} return.code - 状态码（200-成功，其他-失败）
 * @returns {string} return.message - 响应消息
 *
 * @returns {Object} return.data - 响应数据
 * @returns {number} return.data.taskId - 作答题集ID
 * @returns {Array} return.data.sectionList - 作答Section信息列表
 * @returns {string} return.data.sectionList[0].sectionCategory - 套题Section分类(阅读语法-SAT_RW/数学-SAT_MATH)
 * @returns {string} return.data.sectionList[0].sectionName - 套题Section名称（专项训练固定为"Specialized Training"）
 * @returns {number} return.data.sectionList[0].sectionTiming - 套题Section限时（分钟）
 * @returns {Array} return.data.sectionList[0].questionList - 作答题目信息列表
 * @returns {number} return.data.sectionList[0].questionList[0].answerId - 作答明细ID
 * @returns {Object} return.data.sectionList[0].questionList[0].question - 题目信息
 * @returns {number} return.data.sectionList[0].questionList[0].question.questionId - 题目ID
 * @returns {number} return.data.sectionList[0].questionList[0].question.sectionId - 章节ID
 * @returns {string} return.data.sectionList[0].questionList[0].question.questionCategory - 题目分类
 * @returns {string} return.data.sectionList[0].questionList[0].question.questionSubCategory - 题目子分类
 * @returns {string} return.data.sectionList[0].questionList[0].question.difficulty - 难度等级
 * @returns {string} return.data.sectionList[0].questionList[0].question.questionType - 题目类型（CHOICE/BLANK）
 * @returns {string} return.data.sectionList[0].questionList[0].question.questionContent - 题目内容
 * @returns {string} return.data.sectionList[0].questionList[0].question.questionDescription - 问题描述
 * @returns {string} return.data.sectionList[0].questionList[0].question.options - 选项内容（JSON格式）
 * @returns {string} return.data.sectionList[0].questionList[0].question.answer - 正确答案
 * @returns {string} return.data.sectionList[0].questionList[0].question.analysis - 解析
 * @returns {number} return.data.sectionList[0].questionList[0].question.score - 题目分数
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