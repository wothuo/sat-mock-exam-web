/** 科目枚举 */
export const SUBJECT_ENUM = {
  READING: 'READING',
  WRITING: 'WRITING',
  MATH: 'MATH'
};

/** 枚举值 -> 中文展示 */
export const SUBJECT_LABELS = {
  [SUBJECT_ENUM.READING]: '阅读',
  [SUBJECT_ENUM.WRITING]: '语法',
  [SUBJECT_ENUM.MATH]: '数学'
};

// 科目配置
export const TRAINING_SUBJECTS = [
  { id: SUBJECT_ENUM.READING, name: SUBJECT_LABELS[SUBJECT_ENUM.READING], icon: 'fas fa-book-open' },
  { id: SUBJECT_ENUM.WRITING, name: SUBJECT_LABELS[SUBJECT_ENUM.WRITING], icon: 'fas fa-spell-check' },
  { id: SUBJECT_ENUM.MATH, name: SUBJECT_LABELS[SUBJECT_ENUM.MATH], icon: 'fas fa-calculator' }
];

// 题目类型配置
export const QUESTION_TYPES = {
  [SUBJECT_ENUM.READING]: [
      { id: '全部', name: '全部', icon: 'fas fa-th-large', color: 'bg-gray-100 text-gray-600' },
      { id: '词汇题', name: '词汇题', icon: 'fas fa-font', color: 'bg-blue-100 text-blue-600' },
      { id: '结构目的题', name: '结构目的题', icon: 'fas fa-sitemap', color: 'bg-green-100 text-green-600' },
      { id: '双篇题', name: '双篇题', icon: 'fas fa-copy', color: 'bg-purple-100 text-purple-600' },
      { id: '主旨细节题', name: '主旨细节题', icon: 'fas fa-bullseye', color: 'bg-orange-100 text-orange-600' },
      { id: '文本证据题', name: '文本证据题', icon: 'fas fa-quote-right', color: 'bg-pink-100 text-pink-600' },
      { id: '图表题', name: '图表题', icon: 'fas fa-chart-bar', color: 'bg-indigo-100 text-indigo-600' },
      { id: '推断题', name: '推断题', icon: 'fas fa-lightbulb', color: 'bg-teal-100 text-teal-600' }
    ],
  [SUBJECT_ENUM.WRITING]: [
      { id: '全部', name: '全部', icon: 'fas fa-th-large', color: 'bg-gray-100 text-gray-600' },
      { id: '标点符号', name: '标点符号', icon: 'fas fa-circle', color: 'bg-blue-100 text-blue-600' },
      { id: '句子连接', name: '句子连接', icon: 'fas fa-link', color: 'bg-cyan-100 text-cyan-600' },
      { id: '动词专项', name: '动词专项', icon: 'fas fa-running', color: 'bg-green-100 text-green-600' },
      { id: '名词、代词、形容词', name: '名词、代词、形容词', icon: 'fas fa-tags', color: 'bg-purple-100 text-purple-600' },
      { id: '定语、状语、同位语', name: '定语、状语、同位语', icon: 'fas fa-layer-group', color: 'bg-orange-100 text-orange-600' },
      { id: '逻辑词', name: '逻辑词', icon: 'fas fa-project-diagram', color: 'bg-pink-100 text-pink-600' },
      { id: 'notes题', name: 'notes题', icon: 'fas fa-sticky-note', color: 'bg-yellow-100 text-yellow-600' }
    ],
  [SUBJECT_ENUM.MATH]: [
      { id: '全部', name: '全部', icon: 'fas fa-th-large', color: 'bg-gray-100 text-gray-600' },
      { id: '基础运算', name: '基础运算', icon: 'fas fa-calculator', color: 'bg-blue-100 text-blue-600' },
      { id: '进阶运算', name: '进阶运算', icon: 'fas fa-square-root-alt', color: 'bg-indigo-100 text-indigo-600' },
      { id: '一次函数', name: '一次函数', icon: 'fas fa-chart-line', color: 'bg-purple-100 text-purple-600' },
      { id: '二次函数', name: '二次函数', icon: 'fas fa-bezier-curve', color: 'bg-pink-100 text-pink-600' },
      { id: '指数函数', name: '指数函数', icon: 'fas fa-superscript', color: 'bg-teal-100 text-teal-600' },
      { id: '多项式函数', name: '多项式函数', icon: 'fas fa-superscript', color: 'bg-amber-100 text-amber-600' },
      { id: '几何', name: '几何', icon: 'fas fa-shapes', color: 'bg-lime-100 text-lime-600' },
      { id: '圆', name: '圆', icon: 'fas fa-circle', color: 'bg-green-100 text-green-600' },
      { id: '三角形', name: '三角形', icon: 'fas fa-shapes', color: 'bg-orange-100 text-orange-600' },
      { id: '统计', name: '统计', icon: 'fas fa-chart-pie', color: 'bg-red-100 text-red-600' },
      { id: '数据分析', name: '数据分析', icon: 'fas fa-chart-bar', color: 'bg-cyan-100 text-cyan-600' }
    ]
  };
  
/** 题目来源枚举 */
export const QUESTION_SOURCE_ENUM = {
  ALL: 'ALL',
  PAST_EXAM: 'PAST_EXAM',
  OFFICIAL_SAMPLE: 'OFFICIAL_SAMPLE'
};

/** 题目来源 -> 中文展示 */
export const QUESTION_SOURCE_LABELS = {
  [QUESTION_SOURCE_ENUM.ALL]: '全部',
  [QUESTION_SOURCE_ENUM.PAST_EXAM]: '历年真题',
  [QUESTION_SOURCE_ENUM.OFFICIAL_SAMPLE]: '官方样题'
};

// 题目来源配置
export const QUESTION_SOURCES = [
  { id: QUESTION_SOURCE_ENUM.ALL, name: QUESTION_SOURCE_LABELS[QUESTION_SOURCE_ENUM.ALL] },
  { id: QUESTION_SOURCE_ENUM.PAST_EXAM, name: QUESTION_SOURCE_LABELS[QUESTION_SOURCE_ENUM.PAST_EXAM] },
  { id: QUESTION_SOURCE_ENUM.OFFICIAL_SAMPLE, name: QUESTION_SOURCE_LABELS[QUESTION_SOURCE_ENUM.OFFICIAL_SAMPLE] }
];

/** 题目维度枚举 */
export const QUESTION_DIMENSION_ENUM = {
  ALL: 'ALL',
  UNPRACTICED: 'UNPRACTICED',
  WRONG_ONCE: 'WRONG_ONCE',
  WRONG_TWICE_OR_MORE: 'WRONG_TWICE_OR_MORE',
  RECENT_WEEK_WRONG: 'RECENT_WEEK_WRONG'
};

/** 题目维度 -> 中文展示 */
export const QUESTION_DIMENSION_LABELS = {
  [QUESTION_DIMENSION_ENUM.ALL]: '全部',
  [QUESTION_DIMENSION_ENUM.UNPRACTICED]: '未练习',
  [QUESTION_DIMENSION_ENUM.WRONG_ONCE]: '做错一次的',
  [QUESTION_DIMENSION_ENUM.WRONG_TWICE_OR_MORE]: '做错两次以及以上的',
  [QUESTION_DIMENSION_ENUM.RECENT_WEEK_WRONG]: '最近一周错题'
};

// 题目维度配置
export const QUESTION_DIMENSIONS = [
  { id: QUESTION_DIMENSION_ENUM.ALL, name: QUESTION_DIMENSION_LABELS[QUESTION_DIMENSION_ENUM.ALL] },
  { id: QUESTION_DIMENSION_ENUM.UNPRACTICED, name: QUESTION_DIMENSION_LABELS[QUESTION_DIMENSION_ENUM.UNPRACTICED] },
  { id: QUESTION_DIMENSION_ENUM.WRONG_ONCE, name: QUESTION_DIMENSION_LABELS[QUESTION_DIMENSION_ENUM.WRONG_ONCE] },
  { id: QUESTION_DIMENSION_ENUM.WRONG_TWICE_OR_MORE, name: QUESTION_DIMENSION_LABELS[QUESTION_DIMENSION_ENUM.WRONG_TWICE_OR_MORE] },
  { id: QUESTION_DIMENSION_ENUM.RECENT_WEEK_WRONG, name: QUESTION_DIMENSION_LABELS[QUESTION_DIMENSION_ENUM.RECENT_WEEK_WRONG] }
];

/** 题目难度枚举 */
export const QUESTION_DIFFICULTY_ENUM = {
  RANDOM: 'RANDOM',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

/** 题目难度 -> 中文展示 */
export const QUESTION_DIFFICULTY_LABELS = {
  [QUESTION_DIFFICULTY_ENUM.RANDOM]: '随机',
  [QUESTION_DIFFICULTY_ENUM.EASY]: '简单',
  [QUESTION_DIFFICULTY_ENUM.MEDIUM]: '中等',
  [QUESTION_DIFFICULTY_ENUM.HARD]: '困难'
};

// 题目难度配置
export const QUESTION_DIFFICULTIES = [
  { id: QUESTION_DIFFICULTY_ENUM.RANDOM, name: QUESTION_DIFFICULTY_LABELS[QUESTION_DIFFICULTY_ENUM.RANDOM] },
  { id: QUESTION_DIFFICULTY_ENUM.EASY, name: QUESTION_DIFFICULTY_LABELS[QUESTION_DIFFICULTY_ENUM.EASY] },
  { id: QUESTION_DIFFICULTY_ENUM.MEDIUM, name: QUESTION_DIFFICULTY_LABELS[QUESTION_DIFFICULTY_ENUM.MEDIUM] },
  { id: QUESTION_DIFFICULTY_ENUM.HARD, name: QUESTION_DIFFICULTY_LABELS[QUESTION_DIFFICULTY_ENUM.HARD] }
];
  
  // 练习题数
  export const QUESTION_COUNTS = [
    { id: '5题', name: '5题' },
    { id: '10题', name: '10题' },
    { id: '20题', name: '20题' }
  ];
  
  // 查看模式
  // export const VIEW_MODES = [
  //   { id: '随时查看答案和解析', name: '随时查看答案和解析' },
  //   { id: '做完全部题再看答案解析', name: '做完全部题再看答案解析' }
  // ];
  //