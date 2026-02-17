/**
 * 套题录入页常量与配置
 */

export const DRAFT_STORAGE_KEY = 'exam_set_draft';

export const SUBJECTS = ['数学', '阅读', '语法'];

export const DIFFICULTIES = ['简单', '中等', '困难'];

export const QUESTION_TYPES_MAP = {
  '数学': ['基础运算','进阶运算','一次函数','二次函数','指数函数','多项式函数','几何','圆','三角形','统计','数据分析'],
  '阅读': ['词汇题', '结构目的题', '双篇题', '主旨细节题', '文本证据题', '图表题', '推断题'],
  '语法': ['标点符号', '句子连接', '动词专项', '名词、代词、形容词', '定语、状语、同位语', '逻辑词', 'notes题']
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
  region: '亚洲-北京',
  difficulty: '困难',
  year: 2026
};

/** 步骤项配置 */
export const STEP_ITEMS = [
  { title: '基础信息' },
  { title: 'Section信息' },
  { title: '题目内容' }
];