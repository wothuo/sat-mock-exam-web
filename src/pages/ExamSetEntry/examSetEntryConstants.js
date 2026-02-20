/**
 * 套题录入页常量与配置
 */

export const DRAFT_STORAGE_KEY = 'exam_set_draft';

export const SUBJECTS = ['数学', '阅读', '语法'];

export const DIFFICULTIES = ['简单', '中等', '困难'];

/**
 * 整体难度枚举 - 用于逻辑判断与提交值，中文仅用于展示
 * @readonly
 * @enum {string}
 * @property {string} EASY - 简单
 * @property {string} MEDIUM - 中等
 * @property {string} HARD - 困难
 */
export const DIFFICULTY_ENUM = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

/** 枚举值 -> 中文展示文案 */
export const DIFFICULTY_LABELS = {
  [DIFFICULTY_ENUM.EASY]: '简单',
  [DIFFICULTY_ENUM.MEDIUM]: '中等',
  [DIFFICULTY_ENUM.HARD]: '困难'
};

/** 整体难度选项：value 用枚举，label 用中文 */
export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_DIFFICULTY = DIFFICULTY_ENUM.HARD;

/**
 * Section难度枚举 - 用于逻辑判断与提交值，中文仅用于展示（与整体难度枚举值相同，独立常量便于后续扩展）
 * @readonly
 * @enum {string}
 * @property {string} EASY - 简单
 * @property {string} MEDIUM - 中等
 * @property {string} HARD - 困难
 */
export const SECTION_DIFFICULTY_ENUM = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

/** 枚举值 -> 中文展示文案 */
export const SECTION_DIFFICULTY_LABELS = {
  [SECTION_DIFFICULTY_ENUM.EASY]: '简单',
  [SECTION_DIFFICULTY_ENUM.MEDIUM]: '中等',
  [SECTION_DIFFICULTY_ENUM.HARD]: '困难'
};

/** Section难度选项：value 用枚举，label 用中文 */
export const SECTION_DIFFICULTY_OPTIONS = Object.entries(SECTION_DIFFICULTY_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_SECTION_DIFFICULTY = SECTION_DIFFICULTY_ENUM.MEDIUM;

/**
 * Section所属科目枚举 - 用于逻辑判断与提交值，中文仅用于展示
 * @readonly
 * @enum {string}
 * @property {string} SAT_RW - 阅读语法
 * @property {string} SAT_MATH - 数学
 */
export const SECTION_SUBJECT_ENUM = {
  SAT_RW: 'SAT_RW',
  SAT_MATH: 'SAT_MATH'
};

/** 枚举值 -> 中文展示文案 */
export const SECTION_SUBJECT_LABELS = {
  [SECTION_SUBJECT_ENUM.SAT_RW]: '阅读语法',
  [SECTION_SUBJECT_ENUM.SAT_MATH]: '数学'
};

/** Section所属科目选项：value 用枚举，label 用中文 */
export const SECTION_SUBJECT_OPTIONS = Object.entries(SECTION_SUBJECT_LABELS).map(([value, label]) => ({ value, label }));

/** Section科目 -> 默认科目分类（用于新建题目） */
export const SECTION_SUBJECT_TO_DEFAULT_CATEGORY = {
  [SECTION_SUBJECT_ENUM.SAT_RW]: 'READING',
  [SECTION_SUBJECT_ENUM.SAT_MATH]: 'MATH'
};

export const DEFAULT_SECTION_SUBJECT = SECTION_SUBJECT_ENUM.SAT_RW;

/**
 * 科目分类枚举 - 用于题目科目分类
 * @readonly
 * @enum {string}
 * @property {string} READING - 阅读
 * @property {string} WRITING - 语法
 * @property {string} MATH - 数学
 */
export const SUBJECT_CATEGORY_ENUM = {
  READING: 'READING',
  WRITING: 'WRITING',
  MATH: 'MATH'
};

/** 科目分类 -> 中文 */
export const SUBJECT_CATEGORY_LABELS = {
  [SUBJECT_CATEGORY_ENUM.READING]: '阅读',
  [SUBJECT_CATEGORY_ENUM.WRITING]: '语法',
  [SUBJECT_CATEGORY_ENUM.MATH]: '数学'
};

/** Section科目 -> 可选的科目分类列表 */
export const SECTION_SUBJECT_CATEGORY_OPTIONS = {
  [SECTION_SUBJECT_ENUM.SAT_RW]: [SUBJECT_CATEGORY_ENUM.READING, SUBJECT_CATEGORY_ENUM.WRITING],
  [SECTION_SUBJECT_ENUM.SAT_MATH]: [SUBJECT_CATEGORY_ENUM.MATH]
};

export const DEFAULT_SUBJECT_CATEGORY = SUBJECT_CATEGORY_ENUM.READING;

/** 知识点枚举 -> 中文（按科目分组） */
export const QUESTION_TYPE_LABELS = {
  READING_VOCAB: '词汇题',
  READING_STRUCT: '结构目的题',
  READING_DOUBLE: '双篇题',
  READING_MAIN: '主旨细节题',
  READING_EVIDENCE: '文本证据题',
  READING_GRAPH: '图表题',
  READING_INFER: '推断题',
  WRITING_PUNCT: '标点符号',
  WRITING_COMBINE: '句子连接',
  WRITING_VERB: '动词专项',
  WRITING_NPA: '名词、代词、形容词',
  WRITING_ADJADV: '定语、状语、同位语',
  WRITING_LOGIC: '逻辑词',
  WRITING_SYNTAX: '语法错误',
  WRITING_SENT: '句子结构',
  WRITING_PARA: '段落组织',
  WRITING_LOGERR: '逻辑错误',
  MATH_BASIC: '基础运算',
  MATH_ADVANCED: '进阶运算',
  MATH_LINEAR: '一次函数',
  MATH_QUAD: '二次函数',
  MATH_EXP: '指数函数',
  MATH_POLY: '多项式函数',
  MATH_GEOM: '几何',
  MATH_TRIANGLE: '三角形',
  MATH_STAT: '统计',
  MATH_DATA: '数据分析'
};

/** 科目分类 -> 知识点枚举列表 */
export const QUESTION_TYPES_BY_CATEGORY = {
  [SUBJECT_CATEGORY_ENUM.READING]: ['READING_VOCAB', 'READING_STRUCT', 'READING_DOUBLE', 'READING_MAIN', 'READING_EVIDENCE', 'READING_GRAPH', 'READING_INFER'],
  [SUBJECT_CATEGORY_ENUM.WRITING]: ['WRITING_PUNCT', 'WRITING_COMBINE', 'WRITING_VERB', 'WRITING_NPA', 'WRITING_ADJADV', 'WRITING_LOGIC', 'WRITING_SYNTAX', 'WRITING_SENT', 'WRITING_PARA', 'WRITING_LOGERR'],
  [SUBJECT_CATEGORY_ENUM.MATH]: ['MATH_BASIC', 'MATH_ADVANCED', 'MATH_LINEAR', 'MATH_QUAD', 'MATH_EXP', 'MATH_POLY', 'MATH_GEOM', 'MATH_TRIANGLE', 'MATH_STAT', 'MATH_DATA']
};

/** 兼容旧代码：QUESTION_TYPES_MAP 保留，key 为科目分类枚举 */
export const QUESTION_TYPES_MAP = QUESTION_TYPES_BY_CATEGORY;

/**
 * 题目交互类型枚举 - 用于逻辑判断与提交值，中文仅用于展示
 * @readonly
 * @enum {string}
 * @property {string} CHOICE - 选择题
 * @property {string} BLANK - 填空题
 */
export const INTERACTION_TYPE_ENUM = {
  CHOICE: 'CHOICE',
  BLANK: 'BLANK'
};

/** 枚举值 -> 中文展示文案 */
export const INTERACTION_TYPE_LABELS = {
  [INTERACTION_TYPE_ENUM.CHOICE]: '选择题',
  [INTERACTION_TYPE_ENUM.BLANK]: '填空题'
};

/** 题目交互类型选项：value 用枚举，label 用中文 */
export const INTERACTION_TYPE_OPTIONS = Object.entries(INTERACTION_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_INTERACTION_TYPE = INTERACTION_TYPE_ENUM.CHOICE;

/** 题目分类枚举到前端 subject 的映射 */
export const CATEGORY_TO_SUBJECT = {
  READING: '阅读语法',
  WRITING: '阅读语法',
  MATH: '数学'
};

/** API questionCategory(READING/WRITING/MATH) -> Section 科目枚举 */
export const CATEGORY_TO_SECTION_SUBJECT = {
  [SUBJECT_CATEGORY_ENUM.READING]: SECTION_SUBJECT_ENUM.SAT_RW,
  [SUBJECT_CATEGORY_ENUM.WRITING]: SECTION_SUBJECT_ENUM.SAT_RW,
  [SUBJECT_CATEGORY_ENUM.MATH]: SECTION_SUBJECT_ENUM.SAT_MATH
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

/**
 * 考试地区枚举 - 用于逻辑判断与提交值，中文仅用于展示
 * @readonly
 * @enum {string}
 * @property {string} ASIA_CHINA_BJ - 亚洲-中国北京
 * @property {string} ASIA_CHINA_SZ - 亚洲-中国深圳
 * @property {string} ASIA_CHINA_HK - 亚洲-中国香港
 * @property {string} ASIA_SGP - 亚洲-新加坡
 * @property {string} AMERICA_US - 美洲-美国
 * @property {string} AMERICA_CAN - 美洲-加拿大
 * @property {string} EUROPE_UK - 欧洲-英国
 * @property {string} OCEANIA_AUS - 大洋洲-澳大利亚
 * @property {string} AFRICA_ME_UAE - 非洲与中东-阿联酋
 */
export const REGION_ENUM = {
  ASIA_CHINA_BJ: 'ASIA_CHINA_BJ',
  ASIA_CHINA_SZ: 'ASIA_CHINA_SZ',
  ASIA_CHINA_HK: 'ASIA_CHINA_HK',
  ASIA_SGP: 'ASIA_SGP',
  AMERICA_US: 'AMERICA_US',
  AMERICA_CAN: 'AMERICA_CAN',
  EUROPE_UK: 'EUROPE_UK',
  OCEANIA_AUS: 'OCEANIA_AUS',
  AFRICA_ME_UAE: 'AFRICA_ME_UAE'
};

/** 枚举值 -> 中文展示文案 */
export const REGION_LABELS = {
  [REGION_ENUM.ASIA_CHINA_BJ]: '亚洲-中国北京',
  [REGION_ENUM.ASIA_CHINA_SZ]: '亚洲-中国深圳',
  [REGION_ENUM.ASIA_CHINA_HK]: '亚洲-中国香港',
  [REGION_ENUM.ASIA_SGP]: '亚洲-新加坡',
  [REGION_ENUM.AMERICA_US]: '美洲-美国',
  [REGION_ENUM.AMERICA_CAN]: '美洲-加拿大',
  [REGION_ENUM.EUROPE_UK]: '欧洲-英国',
  [REGION_ENUM.OCEANIA_AUS]: '大洋洲-澳大利亚',
  [REGION_ENUM.AFRICA_ME_UAE]: '非洲与中东-阿联酋'
};

/** 考试地区选项：value 用枚举，label 用中文 */
export const REGION_OPTIONS = Object.entries(REGION_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_REGION = REGION_ENUM.ASIA_CHINA_BJ;

export const DEFAULT_CREATOR_ID = 1;

/** 基础信息表单初始值 */
export const FORM_INITIAL_VALUES = {
  type: 'SAT',
  region: DEFAULT_REGION,
  difficulty: DEFAULT_DIFFICULTY,
  year: 2026,
  source: DEFAULT_SOURCE
};

/** 步骤项配置 */
export const STEP_ITEMS = [
  { title: '基础信息' },
  { title: 'Section信息' },
  { title: '题目内容' }
];