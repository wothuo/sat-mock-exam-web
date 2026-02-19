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

/**
 * 套题来源枚举 - 用于逻辑判断与提交值，中文仅用于展示
 * @readonly
 * @enum {string}
 * @property {string} PAST_YEAR - 历年真题
 * @property {string} OFFICIAL_SAMPLE - 官方样题
 * @property {string} MOCK_EXAM - 模拟试题
 * @property {string} ORG_BANK - 机构题库
 * @property {string} TEACHER_MADE - 教师自编
 * @property {string} OTHER - 其他
 */
export const SOURCE_ENUM = {
  PAST_YEAR: 'PAST_YEAR',
  OFFICIAL_SAMPLE: 'OFFICIAL_SAMPLE',
  MOCK_EXAM: 'MOCK_EXAM',
  ORG_BANK: 'ORG_BANK',
  TEACHER_MADE: 'TEACHER_MADE',
  OTHER: 'OTHER'
};

/** 枚举值 -> 中文展示文案 */
export const SOURCE_LABELS = {
  [SOURCE_ENUM.PAST_YEAR]: '历年真题',
  [SOURCE_ENUM.OFFICIAL_SAMPLE]: '官方样题',
  [SOURCE_ENUM.MOCK_EXAM]: '模拟试题',
  [SOURCE_ENUM.ORG_BANK]: '机构题库',
  [SOURCE_ENUM.TEACHER_MADE]: '教师自编',
  [SOURCE_ENUM.OTHER]: '其他'
};

/** 套题来源选项：value 用枚举，label 用中文 */
export const SOURCE_OPTIONS = Object.entries(SOURCE_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_SOURCE = SOURCE_ENUM.PAST_YEAR;

export const DEFAULT_CREATOR_ID = 1;

/** 基础信息表单初始值 */
export const FORM_INITIAL_VALUES = {
  type: 'SAT',
  region: '亚洲-北京',
  difficulty: '困难',
  year: 2026,
  source: DEFAULT_SOURCE
};

/** 步骤项配置 */
export const STEP_ITEMS = [
  { title: '基础信息' },
  { title: 'Section信息' },
  { title: '题目内容' }
];