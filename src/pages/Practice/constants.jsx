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
  
  // 题目来源
  export const QUESTION_SOURCES = [
    { id: '全部', name: '全部' },
    { id: '历年真题', name: '历年真题' },
    { id: '官方样题', name: '官方样题' }
  ];
  
  // 题目维度
  export const QUESTION_DIMENSIONS = [
    { id: '全部', name: '全部' },
    { id: '未练习', name: '未练习' },
    { id: '做错一次的', name: '做错一次的' },
    { id: '做错两次以及以上的', name: '做错两次以及以上的' },
    { id: '最近一周错题', name: '最近一周错题' }
  ];
  
  // 题目难度
  export const QUESTION_DIFFICULTIES = [
    { id: '随机', name: '随机' },
    { id: '简单', name: '简单' },
    { id: '中等', name: '中等' },
    { id: '困难', name: '困难' }
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