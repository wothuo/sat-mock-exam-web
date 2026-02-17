/**
 * 套题管理相关API服务
 */
import { get, post } from '../utils/request.ts';

/**
 * 获取套题列表
 * @param {Object} params - 查询参数
 * @param {string} params.examType - 考试类型（必填，如：SAT/IELTS/TOEFL）
 * @param {string} params.examCategory - 套题类别（可选，如：官方样题/历年真题）
 * @param {string} params.examYear - 套题年份（可选，如：2025/2024）
 * @param {string} params.examRegion - 套题地区（可选，如：北美/亚太）
 * @param {number} params.pageNum - 页码（可选，默认1）
 * @param {number} params.pageSize - 每页条数（可选，默认10）
 * @returns {Promise} 套题列表数据（包含分页信息）
 */
export const getExamSetList = async (params, config = {}) => {
  const response = await post('/exam/list', params, config);
  return response.data;
};

/**
 * 新增套题
 * @param {Object} data - 套题数据
 * @param {string} data.examName - 套题名称
 * @param {string} data.examType - 套题类型（如：SAT）
 * @param {string} data.examYear - 套题年份
 * @param {string} data.examRegion - 套题地区
 * @param {string} data.difficulty - 套题难度（简单/中等/困难）
 * @param {string} [data.examDescription] - 套题描述
 * @param {string} [data.source] - 套题来源
 * @param {number} data.creatorId - 创建人ID
 * @returns {Promise} 新增的套题数据
 */
export const createExamSet = async (data) => {
  const response = await post('/exam/create', data);
  return response.data;
};

/**
 * 检查套题是否存在
 * @param {Object} params - 查询参数
 * @param {string} [params.examName] - 套题名称
 * @param {string} [params.examYear] - 套题年份
 * @param {string} [params.examType] - 套题类型
 * @param {string} [params.examRegion] - 套题区域
 * @param {string} [params.difficulty] - 套题难度
 * @param {string} [params.examDescription] - 套题描述
 * @param {string} [params.source] - 套题来源
 * @param {number} [params.creatorId] - 创建者ID
 * @returns {Promise} 套题信息（如果存在）或null（如果不存在）
 */
export const checkExamExists = async (params) => {
  const response = await post('/exam/check', params);
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
 * @param {string} data.difficulty - 套题难度（简单/中等/困难）
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
 * 检查套题Section是否存在
 * @param {Object} params - 查询参数
 * @param {number} [params.examId] - 套题ID
 * @param {string} [params.sectionName] - 套题Section名称
 * @param {string} [params.sectionCategory] - 套题Section分类
 * @param {string} [params.sectionDifficulty] - 套题Section难度
 * @returns {Promise} 套题Section信息（如果存在）或null（如果不存在）
 */
export const checkSectionExists = async (params) => {
  const response = await post('/exam/check/section', params);
  return response.data;
};

/**
 * 批量新增题目
 * @param {Array} data - 题目数据数组
 * @param {number} data[].examId - 关联套题ID
 * @param {number} data[].sectionId - 关联Section ID
 * @param {string} data[].questionType - 题目类型（选择题）
 * @param {string} data[].questionCategory - 题目分类（阅读/语法/数学）
 * @param {string} data[].questionSubCategory - 题目子分类（如：词汇题/细节题）
 * @param {string} data[].difficulty - 题目难度（简单/中等/困难）
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

/**
 * 提交套题信息
 * @param {Object} data - 套题提交数据
 * @param {Object} data.examPool - 套题信息
 * @param {number} [data.examPool.examId] - 套题ID（新增时可不填，更新时必填）
 * @param {string} data.examPool.examName - 套题名称
 * @param {string} data.examPool.examType - 套题类型（SAT/IELTS/TOEFL）
 * @param {string} [data.examPool.examYear] - 套题年份
 * @param {string} [data.examPool.examRegion] - 套题区域（北美/亚太）
 * @param {string} data.examPool.difficulty - 套题难度（简单/中等/困难）
 * @param {string} [data.examPool.examDescription] - 套题描述
 * @param {string} [data.examPool.source] - 套题来源
 * @param {number} data.examPool.creatorId - 创建者ID
 * @param {number} [data.examPool.status] - 状态（0-正常，1-禁用）
 *
 * @param {Array} data.examSections - 套题Section列表
 * @param {number} [data.examSections[].examId] - 套题ID（会从examPool中自动获取）
 * @param {number} [data.examSections[].sectionId] - 套题Section ID（新增时可不填，更新时必填）
 * @param {string} data.examSections[].sectionName - 套题Section名称
 * @param {string} data.examSections[].sectionCategory - 套题Section分类（阅读/语法/数学）
 * @param {string} [data.examSections[].sectionDifficulty] - 套题Section难度（简单/中等/困难）
 * @param {number} [data.examSections[].sectionTiming] - 套题Section限时（分钟）
 * @param {number} [data.examSections[].status] - 状态（0-正常，1-禁用）
 *
 * @param {Array} data.questions - 题目列表
 * @param {number} [data.questions[].examId] - 所属套题ID（会从examPool中自动获取）
 * @param {number} data.questions[].sectionId - 所属Section ID
 * @param {number} data.questions[].sectionName - 所属Section Name
 * @param {number} [data.questions[].questionId] - 题目ID（新增时可不填，更新时必填）
 * @param {string} data.questions[].questionType - 题目类型（选择/填空）
 * @param {string} data.questions[].questionCategory - 题目分类（阅读/语法/数学）
 * @param {string} [data.questions[].questionSubCategory] - 题目子分类
 * @param {string} data.questions[].difficulty - 题目难度（简单/中等/困难）
 * @param {string} data.questions[].questionContent - 题目题干
 * @param {string} [data.questions[].questionDescription] - 问题描述
 * @param {string} [data.questions[].optionA] - 选项A（选择题必填）
 * @param {string} [data.questions[].optionB] - 选项B（选择题必填）
 * @param {string} [data.questions[].optionC] - 选项C（选择题必填）
 * @param {string} [data.questions[].optionD] - 选项D（选择题必填）
 * @param {string} data.questions[].answer - 正确答案
 * @param {string} [data.questions[].analysis] - 答案解析
 * @returns {Promise} 添加成功的题目ID列表
 */
export const submitExamSet = async (data) => {
  const response = await post('/exam/submit', data);
  return response.data;
};

/**
 * 查询套题Section列表
 * @param {number} examId - 套题ID
 * @returns {Promise} 套题Section列表数据
 */
export const getSectionListByExamId = async (examId) => {
  const response = await post('/exam/sections', examId);
  return response.data;
};

/**
 * 查询套题Question列表
 * @param {number} examId - 套题ID
 * @returns {Promise} 套题Question列表数据
 * @returns {Array} return.data - 题目列表数据
 *
 * @returns {Object} return.data[].question - 题目信息对象
 * @returns {number} return.data[].question.questionId - 题目ID
 * @returns {number} return.data[].question.sectionId - 章节ID
 * @returns {string} return.data[].question.questionCategory - 题目分类（阅读/语法/数学）
 * @returns {string} return.data[].question.questionSubCategory - 题目子分类
 * @returns {string} return.data[].question.difficulty - 难度等级
 * @returns {string} return.data[].question.questionType - 题目类型（选择/填空）
 * @returns {string} return.data[].question.questionContent - 题目内容
 * @returns {string} return.data[].question.questionDescription - 问题描述
 * @returns {string} return.data[].question.options - 选项内容，JSON格式：{"A":"xxx","B":"xxx","C":"xxx","D":"xxx"}
 * @returns {string} return.data[].question.answer - 正确答案
 * @returns {number} return.data[].question.score - 题目分数
 * @returns {number} return.data[].question.status - 状态（0-正常，1-禁用）
 * @returns {number} return.data[].question.delFlag - 删除标志（0-正常，1-已删除）
 * @returns {number} return.data[].question.creatorId - 创建人
 * @returns {string} return.data[].question.createTime - 创建时间
 * @returns {string} return.data[].question.updateTime - 更新时间
 *
 * @returns {string} return.data[].sectionName - 套题Section名称
 * @returns {string} return.data[].sectionTiming - 套题Section限时（分钟）
 * */
export const getQuestionListByExamId = async (examId) => {
  const response = await post('/question/exam/list', examId);
  return response.data;
};


/**
 * 更新套题信息（包含Section和Question）
 * @param {Object} data - 套题更新数据
 *
 * @param {Object} data.examPool - 套题信息
 * @param {number} data.examPool.examId - 套题ID（必填）
 * @param {string} [data.examPool.examName] - 套题名称
 * @param {string} [data.examPool.examYear] - 套题年份
 * @param {string} [data.examPool.examType] - 套题类型
 * @param {string} [data.examPool.examRegion] - 套题地区
 * @param {string} [data.examPool.difficulty] - 套题难度
 * @param {string} [data.examPool.examDescription] - 套题描述
 * @param {string} [data.examPool.source] - 套题来源
 * @param {number} [data.examPool.creatorId] - 创建者ID
 * @param {number} [data.examPool.status] - 状态（0-正常，1-禁用）
 * @param {string} [data.questions[].delFlag] - 删除标志（0-正常，1-已删除）
 *
 * @param {Array} data.examSections - 套题Section列表
 * @param {number} data.examSections[].examId - 套题ID（必填）
 * @param {number} data.examSections[].sectionId - 套题Section ID（必填）
 * @param {string} [data.examSections[].sectionName] - 套题Section名称
 * @param {string} [data.examSections[].sectionCategory] - 套题Section分类
 * @param {string} [data.examSections[].sectionDifficulty] - 套题Section难度
 * @param {number} [data.examSections[].sectionTiming] - 套题Section限时（分钟）
 * @param {number} [data.examSections[].status] - 状态（0-正常，1-禁用）
 * @param {string} [data.questions[].delFlag] - 删除标志（0-正常，1-已删除）
 *
 * @param {Array} data.questions - 题目列表
 * @param {number} data.questions[].sectionId - 所属Section ID（必填）
 * @param {number} data.questions[].questionId - 题目ID（必填）
 * @param {string} [data.questions[].questionType] - 题目类型（选择/填空）
 * @param {string} [data.questions[].questionCategory] - 题目分类（阅读/语法/数学）
 * @param {string} [data.questions[].questionSubCategory] - 题目子分类
 * @param {string} [data.questions[].difficulty] - 题目难度（简单/中等/困难）
 * @param {string} [data.questions[].questionContent] - 题目题干
 * @param {string} [data.questions[].questionDescription] - 问题描述
 * @param {string} [data.questions[].optionA] - 选项A
 * @param {string} [data.questions[].optionB] - 选项B
 * @param {string} [data.questions[].optionC] - 选项C
 * @param {string} [data.questions[].optionD] - 选项D
 * @param {string} [data.questions[].answer] - 正确答案
 * @param {string} [data.questions[].analysis] - 答案解析
 * @param {string} [data.questions[].status] - 状态（0-正常，1-禁用）
 * @param {string} [data.questions[].delFlag] - 删除标志（0-正常，1-已删除）
 *
 * @returns {Promise} 更新结果
 * @returns {Array} return.data - 添加成功的题目ID列表
 */
export const updateExamSectionAndQuestion = async (data) => {
  const response = await post('/exam/update/submit', data);
  return response.data;
};

/**
 * 删除套题
 * @param {number} examId - 套题ID
 * @returns {Promise} 删除结果
 */
export const deleteExam = async (examId) => {
  const response = await post('/exam/delete', examId);
  return response.data;
};

/**
 * 变更套题状态（发布/下线）
 * @param {Object} data - 套题变更状态数据
 * @param {number} data.examId - 套题ID
 * @param {number} data.status - 状态（0-发布，1-下线）
 * @returns {Promise} 更新结果
 */
export const alterExamStatus = async (data) => {
  const response = await post('/exam/alter', data);
  return response.data;
};

/**
 * 创建套题Section
 * @param {Object} data - Section数据
 * @param {number} data.examId - 套题ID
 * @param {number} [data.sectionId] - 套题Section ID（创建时通常为空）
 * @param {string} data.sectionName - 套题Section名称
 * @param {string} data.sectionCategory - 套题Section分类（如：阅读语法、数学）
 * @param {string} data.sectionDifficulty - 套题Section难度（如：简单、中等、困难）
 * @param {number} data.sectionTiming - 套题Section限时（分钟）
 * @param {number} [data.status] - 状态：0-正常，1-禁用（默认1）
 * @param {number} [data.delFlag] - 删除标志：0-正常，1-已删除（默认0）
 * @returns {Promise<number>} 创建的套题Section ID
 */
export const createExamSection = async (data) => {
  const response = await post('/exam/create/section', data);
  return response.data;
};

/**
 * 更新套题Section
 * @param {Object} data - Section数据
 * @param {number} data.examId - 套题ID
 * @param {number} data.sectionId - 套题Section ID（更新时必须提供）
 * @param {string} data.sectionName - 套题Section名称
 * @param {string} data.sectionCategory - 套题Section分类
 * @param {string} data.sectionDifficulty - 套题Section难度
 * @param {number} data.sectionTiming - 套题Section限时（分钟）
 * @param {number} [data.status] - 状态：0-正常，1-禁用（默认1）
 * @param {number} [data.delFlag] - 删除标志：0-正常，1-已删除（默认0）
 * @returns {Promise<boolean>} 是否更新成功
 */
export const updateExamSection = async (data) => {
  const response = await post('/exam/update/section', data);
  return response.data;
};

/**
 * 删除套题Section
 * @param {number} sectionId - 套题Section ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteExamSection = async (sectionId) => {
  const response = await post('/exam/delete/section', sectionId);
  return response.data;
};


/**
 * 查询套题模考Section列表信息（分页查询）
 * @param {Object} params - 查询参数
 *
 * @param {number} [params.pageNum] - 当前页码，默认第1页
 * @param {number} [params.pageSize] - 每页显示数量，默认10条
 * @param {string} [params.examType] - 套题类型（SAT/TOEFL等）
 * @param {string} [params.difficulty] - 套题难度
 * @param {string} [params.sectionCategory] - 套题Section分类
 * @param {string} [params.examRegion] - 套题地区
 * @param {string} [params.examYear] - 套题年份
 * @param {string} [params.source] - 套题来源
 * @param {string} [params.examName] - 套题名称（支持模糊查询）
 *
 * @returns {Promise} 套题Section列表分页数据
 *
 * @returns {Object} return.data - 分页数据
 * @returns {number} return.data.pageNum - 当前页码
 * @returns {number} return.data.pageSize - 每页显示数量
 * @returns {number} return.data.total - 总记录数
 * @returns {number} return.data.pages - 总页数
 * @returns {Array} return.data.list - 数据列表
 *
 * @returns {Object} return.data.list[].examSummary - 套题基本信息
 * @returns {number} return.data.list[].examSummary.examId - 套题ID
 * @returns {string} return.data.list[].examSummary.examName - 套题名称
 * @returns {string} return.data.list[].examSummary.examYear - 套题年份
 * @returns {string} return.data.list[].examSummary.examType - 套题类型
 * @returns {string} return.data.list[].examSummary.examRegion - 套题区域
 * @returns {string} return.data.list[].examSummary.source - 套题来源
 * @returns {string} return.data.list[].examSummary.difficulty - 套题难度
 * @returns {string} return.data.list[].examSummary.examDescription - 套题描述
 * @returns {number} return.data.list[].examSummary.status - 状态（0-正常，1-禁用）
 * @returns {number} return.data.list[].examSummary.delFlag - 删除标志（0-正常，1-已删除）
 * @returns {number} return.data.list[].examSummary.sectionCount - Section数量
 * @returns {number} return.data.list[].examSummary.questionCount - 题目总数量
 * @returns {number} return.data.list[].examSummary.examDuration - 套题时长
 *
 * @returns {number} return.data.list[].sectionId - Section ID
 * @returns {string} return.data.list[].sectionName - Section名称
 * @returns {string} return.data.list[].sectionCategory - Section类型
 * @returns {number} return.data.list[].sectionTiming - Section限时（分钟）
 * @returns {number} return.data.list[].questionCount - Section题目数量
 */
export const queryExamSectionList = async (params, config = {}) => {
  const response = await post('/exam/list/section', params, config);
  return response.data;
};

/**
 * 根据套题ID查询题目列表
 * @param {number} sectionId - 套题ID
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
export const answerOfSection = async (sectionId) => {
  // 根据接口文档，直接传递Long类型的sectionId值，不需要JSON对象包装
  const response = await post('/answer/exam/start', sectionId);
  return response.data;
};

/**
 * 结束作答并提交用户答案
 * @param {Object} finishData - 结束作答数据
 * @param {Array} finishData.answers - 用户作答的题目答案列表
 * @param {number} finishData.answers[].answerId - 作答明细ID
 * @param {number} finishData.answers[].questionId - 题目ID
 * @param {string} finishData.answers[].userAnswer - 用户作答答案
 * @param {number} finishData.answers[].timeConsuming - 作答耗时（秒）
 * @returns {Promise} 提交结果
 *
 * @returns {Object} return - 响应结果
 * @returns {number} return.code - 状态码（0-成功，非0-失败）
 * @returns {string} return.message - 响应消息
 * @returns {boolean} return.data - 响应数据（true-成功，false-失败）
 */
export const finishAnswer = async (finishData) => {
  const response = await post('/answer/finish', finishData);
  return response.data;
};