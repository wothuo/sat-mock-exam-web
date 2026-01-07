/**
 * 专项训练相关API接口
 * 预留后端联调入口
 */

// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

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
  try {
    // TODO: 替换为实际的API调用
    const response = await fetch(`${API_BASE_URL}/training/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error('获取题目失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};

/**
 * 提交训练答案
 * @param {Object} data - 答题数据
 * @param {string} data.trainingId - 训练ID
 * @param {Array} data.answers - 答案列表
 * @returns {Promise} 提交结果
 */
export const submitTrainingAnswers = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/training/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('提交答案失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
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
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/training/records?${queryString}`);
    
    if (!response.ok) {
      throw new Error('获取训练记录失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};

/**
 * 获取错题集
 * @param {Object} params - 查询参数
 * @param {string} params.subject - 科目
 * @param {string} params.questionType - 题目类型
 * @returns {Promise} 错题列表
 */
export const fetchWrongQuestions = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/training/wrong-questions?${queryString}`);
    
    if (!response.ok) {
      throw new Error('获取错题集失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};

