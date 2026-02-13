/**
 * 套题录入页常量与配置
 */

export const DRAFT_STORAGE_KEY = 'exam_set_draft';

export const SUBJECTS = ['数学', '阅读', '语法'];

export const DIFFICULTIES = ['简单', '中等', '困难'];

export const QUESTION_TYPES_MAP = {
  '阅读语法': ['词汇题', '结构目的题', '主旨细节题', '推断题', '标点符号', '句子连接', '逻辑词'],
  '数学': ['一次函数', '二次函数', '几何', '统计']
};

/** 题目分类枚举到前端 subject 的映射 */
export const CATEGORY_TO_SUBJECT = {
  READING: '阅读语法',
  WRITING: '阅读语法',
  MATH: '数学'
};

export const DEFAULT_SOURCE = '官方样题';

export const DEFAULT_CREATOR_ID = 1;

/** 基础信息表单初始值 */
export const FORM_INITIAL_VALUES = {
  type: 'SAT',
  region: '北美',
  difficulty: '困难',
  year: 2025
};

/** 步骤项配置 */
export const STEP_ITEMS = [
  { title: '基础信息' },
  { title: 'Section信息' },
  { title: '题目内容' }
];