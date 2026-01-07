import {
    DeleteOutlined,
    EditOutlined,
    FilterOutlined,
    LogoutOutlined,
    PlusOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Collapse,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    Modal,
    Pagination,
    Popconfirm,
    Select,
    Space,
    Tag,
    message,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import QuestionEditor from '../QuestionBank/QuestionEditor';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

function SectionManager({ visible, examSet, onSave, onCancel }) {
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isQuestionSelectorVisible, setIsQuestionSelectorVisible] =
    useState(false);
  const [currentSectionForQuestions, setCurrentSectionForQuestions] =
    useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [form] = Form.useForm();

  // 新增：题目编辑状态
  const [isSingleQuestionEditorVisible, setIsSingleQuestionEditorVisible] =
    useState(false);
  const [editingSingleQuestion, setEditingSingleQuestion] = useState(null);

  // 新增：视图切换状态
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'sections'
  const [listFilters, setListFilters] = useState({
    subject: '全部',
    section: '全部',
  });
  const [listPage, setListPage] = useState(1);
  const listPageSize = 5;

  // 筛选与分页状态 (用于选择器)
  const [filters, setFilters] = useState({
    subject: '全部',
    type: '全部',
    difficulty: '全部',
    source: '全部',
    search: '',
  });

  // 同步专业题型配置用于筛选
  const questionTypesMap = {
    阅读: [
      '词汇题',
      '结构目的题',
      '双篇题',
      '主旨细节题',
      '文本证据题',
      '图表题',
      '推断题',
    ],
    语法: [
      '标点符号',
      '句子连接',
      '动词专项',
      '名词、代词、形容词',
      '定语、状语、同位语',
      '逻辑词',
      'notes题',
    ],
    数学: [
      '基础运算',
      '圆方程',
      '一次函数',
      '三角函数',
      '二次函数',
      '统计',
      '指数函数',
      '数据分析',
      '应用题',
      '基础函数',
      '几何',
    ],
  };
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // 模拟题库数据
  const [questionsData, setQuestionsData] = useState([
    {
      id: 1,
      type: 'multiple-choice',
      subject: '数学',
      difficulty: 'Medium',
      question: '求解方程 $x^2 + 5x + 6 = 0$ 的解',
      options: [
        'A) x = -2 或 x = -3',
        'B) x = 2 或 x = 3',
        'C) x = -1 或 x = -6',
        'D) x = 1 或 x = 6',
      ],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      type: 'reading-passage',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'What is the main purpose of the passage?',
      options: [
        'A) To describe',
        'B) To explain',
        'C) To argue',
        'D) To compare',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-01-14',
    },
    {
      id: 3,
      type: 'student-produced',
      subject: '数学',
      difficulty: 'Easy',
      question: '计算 $\\frac{3}{4} + \\frac{1}{2}$ 的值',
      correctAnswer: '1.25',
      source: '历年考题',
      createdAt: '2024-01-13',
    },
    {
      id: 4,
      type: 'multiple-choice',
      subject: '数学',
      difficulty: 'Hard',
      question: '根据以下数据，$\\sqrt{x}$ 当 x=16 时的值是多少？',
      options: ['A) 2', 'B) 4', 'C) 8', 'D) 16'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-12',
    },
    {
      id: 5,
      type: 'multiple-choice',
      subject: '数学',
      difficulty: 'Medium',
      question: '以下哪个公式表示分数的正确形式？',
      options: [
        'A) $\\frac{numerator}{denominator}$',
        'B) $\\sqrt{x}$',
        'C) $x^{n}$',
        'D) $\\sum_{i=1}^{n}$',
      ],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-11',
    },
    {
      id: 6,
      type: 'multiple-choice',
      subject: '语法',
      difficulty: 'Easy',
      question: '请选择正确的标点符号。',
      options: ['A) .', 'B) ,', 'C) ?', 'D) !'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-01-10',
    },
    {
      id: 7,
      type: 'reading-passage',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'According to the text, what is the primary cause of the phenomenon?',
      correctAnswer: 'C',
      source: 'Question Bank考题',
      createdAt: '2024-01-09',
    },
    {
      id: 8,
      type: '基础函数',
      subject: '数学',
      difficulty: 'Hard',
      question: 'If $f(x) = 2x^2 - 3x + 1$, find $f(5)$.',
      correctAnswer: '36',
      source: '历年考题',
      createdAt: '2024-01-08',
    },
    {
      id: 9,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'Which of the following versions of the underlined portion most effectively uses punctuation to separate the clauses?',
      options: [
        'A) however; it',
        'B) however, it',
        'C) however: it',
        'D) however it',
      ],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-16',
    },
    {
      id: 10,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'As used in line 15, "plastic" most nearly means',
      options: ['A) synthetic', 'B) malleable', 'C) artificial', 'D) rigid'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-17',
    },
    {
      id: 11,
      type: '几何',
      subject: '数学',
      difficulty: 'Hard',
      question: '一个圆的方程为 $(x-3)^2 + (y+2)^2 = 25$，求该圆的周长。',
      options: ['A) $5\\pi$', 'B) $10\\pi$', 'C) $25\\pi$', 'D) $50\\pi$'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-18',
    },
    {
      id: 12,
      type: '逻辑词',
      subject: '语法',
      difficulty: 'Easy',
      question:
        'The researchers found no evidence of the hormone in the control group. ________, the experimental group showed significant levels.',
      options: [
        'A) Furthermore',
        'B) In contrast',
        'C) Therefore',
        'D) Similarly',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-01-19',
    },
    {
      id: 13,
      type: '二次函数',
      subject: '数学',
      difficulty: 'Hard',
      question:
        '已知二次函数 $f(x) = ax^2 + bx + c$ 的图像经过点 $(1, 0)$ 和 $(3, 0)$，且最小值为 $-4$，求 $a+b+c$ 的值。',
      options: ['A) -4', 'B) 0', 'C) 4', 'D) 8'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-20',
    },
    {
      id: 14,
      type: '文本证据题',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'Which choice best supports the claim that the author views the new policy with skepticism?',
      options: [
        'A) Lines 12-15 ("The...results")',
        'B) Lines 22-24 ("While...unclear")',
        'C) Lines 45-48 ("This...success")',
        'D) Lines 55-58 ("Future...needed")',
      ],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-21',
    },
    {
      id: 15,
      type: '动词专项',
      subject: '语法',
      difficulty: 'Easy',
      question:
        'Neither the students nor the teacher ________ aware of the schedule change until this morning.',
      options: ['A) was', 'B) were', 'C) has been', 'D) are'],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-22',
    },
    {
      id: 16,
      type: '指数函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'If $3^{2x-1} = 27$, what is the value of $x$?',
      options: ['A) 1', 'B) 2', 'C) 3', 'D) 4'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-23',
    },
    {
      id: 17,
      type: '图表题',
      subject: '阅读',
      difficulty: 'Hard',
      question:
        'Based on the data in the graph, which statement accurately describes the relationship between temperature and reaction rate?',
      options: [
        'A) Linear increase',
        'B) Exponential decrease',
        'C) Initial increase followed by a plateau',
        'D) No significant correlation',
      ],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-01-24',
    },
    {
      id: 18,
      type: '定语、状语、同位语',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'The novel, ________ by a young author from Brazil, has become an international bestseller.',
      options: [
        'A) written',
        'B) writing',
        'C) was written',
        'D) having written',
      ],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-01-25',
    },
    {
      id: 19,
      type: '数据分析',
      subject: '数学',
      difficulty: 'Easy',
      question:
        'A set of data consists of {10, 12, 15, 15, 18}. What is the median of this data set?',
      options: ['A) 12', 'B) 14', 'C) 15', 'D) 18'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-01-26',
    },
    {
      id: 20,
      type: '推断题',
      subject: '阅读',
      difficulty: 'Hard',
      question:
        'It can be inferred from the passage that the primary reason for the decline in the population was',
      options: [
        'A) Habitat loss',
        'B) Climate change',
        'C) Overhunting',
        'D) Disease',
      ],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-27',
    },
    {
      id: 21,
      type: 'notes题',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'The student wants to emphasize the scale of the project. Which choice uses relevant information from the notes to accomplish this goal?',
      options: [
        'A) The project started in 2010.',
        'B) Over 500 researchers participated.',
        'C) It was funded by the government.',
        'D) The results were published in 2022.',
      ],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-28',
    },
    {
      id: 22,
      type: '应用题',
      subject: '数学',
      difficulty: 'Medium',
      question:
        'A car travels 300 miles on 12 gallons of gas. How many gallons are needed for a 500-mile trip?',
      options: ['A) 15', 'B) 18', 'C) 20', 'D) 25'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-01-29',
    },
    {
      id: 23,
      type: '结构目的题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'The main purpose of the third paragraph is to',
      options: [
        'A) Introduce a new theory',
        'B) Provide a counterargument',
        'C) Elaborate on a previous point',
        'D) Summarize the findings',
      ],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-01-30',
    },
    {
      id: 24,
      type: '句子连接',
      subject: '语法',
      difficulty: 'Easy',
      question:
        'The weather was beautiful; ________, we decided to go for a hike.',
      options: ['A) therefore', 'B) however', 'C) otherwise', 'D) instead'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-01-31',
    },
    {
      id: 25,
      type: '三角函数',
      subject: '数学',
      difficulty: 'Hard',
      question:
        'In a right triangle, if $\\sin(\\theta) = 0.6$, what is the value of $\\cos(\\theta)$?',
      options: ['A) 0.4', 'B) 0.7', 'C) 0.8', 'D) 1.0'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-01',
    },
    {
      id: 26,
      type: '双篇题',
      subject: '阅读',
      difficulty: 'Hard',
      question:
        'Which statement best describes the relationship between the two passages?',
      options: [
        'A) Passage 2 supports Passage 1',
        'B) Passage 2 challenges Passage 1',
        'C) Passage 2 provides context for Passage 1',
        'D) Passage 2 ignores Passage 1',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-02',
    },
    {
      id: 27,
      type: '名词、代词、形容词',
      subject: '语法',
      difficulty: 'Easy',
      question:
        'Each of the participants was asked to bring ________ own laptop to the workshop.',
      options: ['A) their', 'B) his or her', 'C) its', 'D) our'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-03',
    },
    {
      id: 28,
      type: '圆方程',
      subject: '数学',
      difficulty: 'Medium',
      question:
        'What is the center of the circle with equation $(x+5)^2 + (y-2)^2 = 16$?',
      options: ['A) (5, -2)', 'B) (-5, 2)', 'C) (5, 2)', 'D) (-5, -2)'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-04',
    },
    {
      id: 29,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'As used in line 42, "arresting" most nearly means',
      options: ['A) capturing', 'B) striking', 'C) stopping', 'D) legal'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-05',
    },
    {
      id: 30,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'The city is famous for its landmarks: the Eiffel Tower, the Louvre, and ________.',
      options: [
        'A) Notre Dame',
        'B) ; Notre Dame',
        'C) : Notre Dame',
        'D) , Notre Dame',
      ],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-06',
    },
    {
      id: 31,
      type: '基础运算',
      subject: '数学',
      difficulty: 'Easy',
      question: 'Simplify the expression: $2(x + 3) - 4(x - 1)$.',
      options: ['A) $-2x + 10$', 'B) $-2x + 2$', 'C) $2x + 10$', 'D) $2x + 2$'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-07',
    },
    {
      id: 32,
      type: '主旨细节题',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'According to the passage, what was the main finding of the 2018 study?',
      options: [
        'A) Increased efficiency',
        'B) Reduced costs',
        'C) Improved safety',
        'D) Higher satisfaction',
      ],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-02-08',
    },
    {
      id: 33,
      type: '一次函数',
      subject: '数学',
      difficulty: 'Easy',
      question: 'If $2x + 5 = 13$, what is the value of $x$?',
      options: ['A) 3', 'B) 4', 'C) 6', 'D) 9'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-09',
    },
    {
      id: 34,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'As used in the context of the second paragraph, "convey" most nearly means',
      options: ['A) transport', 'B) communicate', 'C) lead', 'D) support'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-10',
    },
    {
      id: 35,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Hard',
      question:
        'The discovery was unexpected ________ it challenged long-held beliefs in the scientific community.',
      options: ['A) ; however,', 'B) : however', 'C) , however', 'D) however'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-11',
    },
    {
      id: 36,
      type: '几何',
      subject: '数学',
      difficulty: 'Medium',
      question:
        'A cylinder has a radius of 3 and a height of 5. What is its volume?',
      options: ['A) $15\\pi$', 'B) $30\\pi$', 'C) $45\\pi$', 'D) $90\\pi$'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-12',
    },
    {
      id: 37,
      type: '结构目的题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'The primary purpose of the passage is to',
      options: [
        'A) critique a methodology',
        'B) propose a new theory',
        'C) summarize recent research',
        'D) resolve a historical debate',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-13',
    },
    {
      id: 38,
      type: '动词专项',
      subject: '语法',
      difficulty: 'Easy',
      question:
        'The group of students ________ planning a surprise party for their teacher.',
      options: ['A) is', 'B) are', 'C) was', 'D) were'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-14',
    },
    {
      id: 39,
      type: '统计',
      subject: '数学',
      difficulty: 'Medium',
      question:
        'A bag contains 4 red marbles and 6 blue marbles. If one marble is drawn at random, what is the probability it is red?',
      options: ['A) 0.4', 'B) 0.6', 'C) 0.25', 'D) 0.66'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-15',
    },
    {
      id: 40,
      type: '文本证据题',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'Which choice provides the best evidence for the answer to the previous question?',
      options: [
        'A) Lines 5-8',
        'B) Lines 15-19',
        'C) Lines 30-34',
        'D) Lines 45-49',
      ],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-16',
    },
    {
      id: 41,
      type: '逻辑词',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'The experiment failed to produce the expected results. ________, the team decided to try a different approach.',
      options: ['A) However', 'B) Therefore', 'C) Furthermore', 'D) Similarly'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-17',
    },
    {
      id: 42,
      type: '二次函数',
      subject: '数学',
      difficulty: 'Easy',
      question: 'What are the solutions to the equation $x^2 - 9 = 0$?',
      options: ['A) x = 3', 'B) x = -3', 'C) x = 3 or x = -3', 'D) x = 9'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-18',
    },
    {
      id: 43,
      type: '推断题',
      subject: '阅读',
      difficulty: 'Hard',
      question:
        'Based on the passage, the author would most likely agree with which of the following statements?',
      options: [
        'A) Technology is always beneficial',
        'B) Human intuition is irreplaceable',
        'C) Data can be misleading',
        'D) Progress is inevitable',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-19',
    },
    {
      id: 44,
      type: '名词、代词、形容词',
      subject: '语法',
      difficulty: 'Medium',
      question:
        'The scientist ________ won the Nobel Prize is coming to our university.',
      options: ['A) who', 'B) whom', 'C) whose', 'D) which'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-20',
    },
    {
      id: 45,
      type: '应用题',
      subject: '数学',
      difficulty: 'Easy',
      question:
        'A jacket is on sale for 20% off its original price of $80. What is the sale price?',
      options: ['A) $16', 'B) $60', 'C) $64', 'D) $72'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-21',
    },
    {
      id: 46,
      type: '图表题',
      subject: '阅读',
      difficulty: 'Medium',
      question:
        'According to the graph, in which year did the population reach its peak?',
      options: ['A) 2010', 'B) 2015', 'C) 2020', 'D) 2025'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-22',
    },
    {
      id: 47,
      type: '定语、状语、同位语',
      subject: '语法',
      difficulty: 'Medium',
      question: 'She enjoys hiking, swimming, and ________ in the mountains.',
      options: ['A) to camp', 'B) camping', 'C) camp', 'D) having camped'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-23',
    },
    {
      id: 48,
      type: '基础函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'Solve the system of equations: $x + y = 10$ and $x - y = 2$.',
      options: ['A) (6, 4)', 'B) (4, 6)', 'C) (5, 5)', 'D) (7, 3)'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-24',
    },
    {
      id: 49,
      type: '双篇题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'The tone of the author in Passage 1 is best described as',
      options: [
        'A) optimistic',
        'B) skeptical',
        'C) objective',
        'D) passionate',
      ],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-25',
    },
    {
      id: 50,
      type: '句子连接',
      subject: '语法',
      difficulty: 'Hard',
      question: 'Walking down the street, ________.',
      options: [
        'A) the trees were beautiful',
        'B) I saw many beautiful trees',
        'C) beauty was everywhere',
        'D) it was a sunny day',
      ],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-26',
    },
    {
      id: 51,
      type: '指数函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'Simplify the expression: $(2^3)^2$.',
      options: ['A) 32', 'B) 64', 'C) 128', 'D) 256'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-27',
    },
    {
      id: 52,
      type: '主旨细节题',
      subject: '阅读',
      difficulty: 'Easy',
      question:
        'What is the main reason the character decided to leave the city?',
      options: [
        'A) To find a job',
        'B) To seek adventure',
        'C) To escape the noise',
        'D) To visit family',
      ],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-28',
    },
  ]);

  // 筛选逻辑
  const filteredQuestions = useMemo(() => {
    return questionsData.filter((q) => {
      const matchSubject =
        filters.subject === '全部' || q.subject === filters.subject;
      const matchType = filters.type === '全部' || q.type === filters.type;
      const matchDifficulty =
        filters.difficulty === '全部' || q.difficulty === filters.difficulty;
      const matchSource =
        filters.source === '全部' || q.source === filters.source;
      const matchSearch =
        !filters.search ||
        q.question.toLowerCase().includes(filters.search.toLowerCase());
      return (
        matchSubject &&
        matchType &&
        matchDifficulty &&
        matchSource &&
        matchSearch
      );
    });
  }, [filters, questionsData]);

  // 分页逻辑
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage]);

  useEffect(() => {
    if (visible && examSet) {
      setSections(examSet.sections || []);
      setActiveTab('questions'); // 默认打开题目列表
      setListPage(1);
    }
  }, [visible, examSet]);

  // 计算当前套题下的所有题目
  const allQuestionIds = useMemo(() => {
    const ids = new Set();
    sections.forEach((s) => {
      if (s.selectedQuestions) {
        s.selectedQuestions.forEach((id) => ids.add(id));
      }
    });
    return Array.from(ids);
  }, [sections]);

  // 获取题目对象列表
  const examSetQuestions = useMemo(() => {
    return questionsData.filter((q) => allQuestionIds.includes(q.id));
  }, [allQuestionIds, questionsData]);

  // 题目列表筛选逻辑
  const filteredListQuestions = useMemo(() => {
    return examSetQuestions.filter((q) => {
      const matchSubject =
        listFilters.subject === '全部' || q.subject === listFilters.subject;
      const matchSection =
        listFilters.section === '全部' ||
        (() => {
          const questionSections = sections.filter((s) =>
            s.selectedQuestions?.includes(q.id)
          );
          return questionSections.some((s) => s.id === listFilters.section);
        })();
      return matchSubject && matchSection;
    });
  }, [examSetQuestions, listFilters, sections]);

  // 题目列表分页逻辑
  const paginatedListQuestions = useMemo(() => {
    const start = (listPage - 1) * listPageSize;
    return filteredListQuestions.slice(start, start + listPageSize);
  }, [filteredListQuestions, listPage]);

  const getTypeLabel = (type) => {
    // 直接返回类型名称，因为现在存储的就是专业题型名称
    return type;
  };

  const handleAddSection = () => {
    setEditingSection(null);
    form.resetFields();
    setIsEditorVisible(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    form.setFieldsValue(section);
    setIsEditorVisible(true);
  };

  const handleDeleteSection = (sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    message.success('Section删除成功');
  };

  const handleSaveSection = () => {
    form.validateFields().then((values) => {
      if (editingSection) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === editingSection.id ? { ...s, ...values } : s
          )
        );
        message.success('Section更新成功');
      } else {
        const newSection = {
          ...values,
          id: `s${Date.now()}`,
          selectedQuestions: [],
        };
        setSections((prev) => [...prev, newSection]);
        message.success('Section添加成功');
      }
      setIsEditorVisible(false);
      form.resetFields();
    });
  };

  const handleManageQuestions = (section) => {
    setCurrentSectionForQuestions(section);
    setSelectedQuestions(section.selectedQuestions || []);
    setIsQuestionSelectorVisible(true);
    // 重置筛选和分页
    setFilters({
      subject: '全部',
      type: '全部',
      difficulty: '全部',
      source: '全部',
      search: '',
    });
    setCurrentPage(1);
  };

  const handleQuestionSelection = (questionId, checked) => {
    if (checked) {
      setSelectedQuestions((prev) => [...prev, questionId]);
    } else {
      setSelectedQuestions((prev) => prev.filter((id) => id !== questionId));
    }
  };

  // 获取已选题目的完整对象列表
  const selectedQuestionObjects = useMemo(() => {
    return questionsData.filter((q) => selectedQuestions.includes(q.id));
  }, [selectedQuestions, questionsData]);

  const handleSaveQuestions = () => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === currentSectionForQuestions.id
          ? { ...s, selectedQuestions, questions: selectedQuestions.length }
          : s
      )
    );

    // 同步更新表单中的题目数量
    if (editingSection && editingSection.id === currentSectionForQuestions.id) {
      form.setFieldsValue({ questions: selectedQuestions.length });
    }

    message.success('题目选择已保存');
    setIsQuestionSelectorVisible(false);
  };

  const formatText = (text) => {
    if (!text) return text;

    // 1. 保护数学公式，防止被 Markdown 逻辑干扰
    const mathBlocks = [];
    let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 处理 Markdown 格式
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
    processed = processed.replace(/\n/g, '<br />');

    // 3. 还原数学公式
    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
  };

  // 统一的数学公式渲染函数
  const triggerMathRender = React.useCallback(() => {
    const render = () => {
      if (window.renderMathInElement) {
        const containers = document.querySelectorAll('.question-math-content');
        containers.forEach((container) => {
          try {
            window.renderMathInElement(container, {
              delimiters: [
                { left: '$', right: '$', display: false },
                { left: '$$', right: '$$', display: true },
              ],
              throwOnError: false,
              strict: false,
            });
            container.style.visibility = 'visible';
            container.style.opacity = '1';
          } catch (error) {
            console.error('KaTeX rendering error:', error);
            container.style.visibility = 'visible';
            container.style.opacity = '1';
          }
        });
      } else {
        // 如果脚本还没加载完，500ms 后重试
        setTimeout(render, 500);
      }
    };
    // 初始延迟，等待 DOM 挂载
    setTimeout(render, 200);
  }, []);

  // 抽屉打开或分页切换时触发渲染
  React.useEffect(() => {
    if (isQuestionSelectorVisible) {
      triggerMathRender();
    }
  }, [isQuestionSelectorVisible, paginatedQuestions, triggerMathRender]);

  const handleEditSingleQuestion = (question) => {
    setEditingSingleQuestion(question);
    setIsSingleQuestionEditorVisible(true);
  };

  const handleSaveSingleQuestion = (updatedQuestion) => {
    setQuestionsData((prev) =>
      prev.map((q) =>
        q.id === editingSingleQuestion.id ? { ...q, ...updatedQuestion } : q
      )
    );
    message.success('题目信息已更新');
    setIsSingleQuestionEditorVisible(false);
    triggerMathRender();
  };

  const handleRemoveQuestionFromSet = (questionId) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        selectedQuestions:
          s.selectedQuestions?.filter((id) => id !== questionId) || [],
        questions: (
          s.selectedQuestions?.filter((id) => id !== questionId) || []
        ).length,
      }))
    );
    message.success('题目已从套题中移除');
  };

  const handleSubmit = () => {
    if (sections.length === 0) {
      message.warning('请至少添加一个Section');
      return;
    }
    onSave(sections);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Modal
      title={
        <div className='flex items-center gap-4'>
          <span className='text-lg font-bold'>题目管理</span>
          <Tag color='red' className='m-0 rounded-md border-0 font-bold'>
            {examSet?.title}
          </Tag>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={1000}
      okText='保存修改'
      cancelText='取消'
      styles={{ body: { padding: '20px 24px' } }}
    >
      {/* 顶部切换卡 */}
      <div className='flex justify-center mb-8'>
        <div className='bg-gray-100 p-1 rounded-2xl flex'>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'questions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className='fas fa-list-ol mr-2'></i>
            题目列表 ({allQuestionIds.length})
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sections'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className='fas fa-layer-group mr-2'></i>
            题目组管理 ({sections.length})
          </button>
        </div>
      </div>

      {activeTab === 'questions' ? (
        <div className='space-y-6'>
          {/* 筛选栏 */}
          <div className='bg-gray-50 p-4 rounded-2xl border border-gray-100'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <Space size='middle' wrap>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold text-gray-500 uppercase tracking-wider'>
                    科目筛选:
                  </span>
                  <Select
                    value={listFilters.subject}
                    onChange={(v) => {
                      setListFilters((prev) => ({ ...prev, subject: v }));
                      setListPage(1);
                    }}
                    className='w-40'
                  >
                    <Option value='全部'>全部科目</Option>
                    <Option value='阅读'>阅读</Option>
                    <Option value='语法'>语法</Option>
                    <Option value='数学'>数学</Option>
                  </Select>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold text-gray-500 uppercase tracking-wider'>
                    Section筛选:
                  </span>
                  <Select
                    value={listFilters.section}
                    onChange={(v) => {
                      setListFilters((prev) => ({ ...prev, section: v }));
                      setListPage(1);
                    }}
                    className='w-64'
                  >
                    <Option value='全部'>全部Section</Option>
                    {sections.map((s) => (
                      <Option key={s.id} value={s.id}>
                        {s.name} ({s.selectedQuestions?.length || 0}题)
                      </Option>
                    ))}
                  </Select>
                </div>
              </Space>
              <div className='text-xs text-gray-400 font-medium'>
                共找到 {filteredListQuestions.length} 道题目
              </div>
            </div>
          </div>

          {/* 题目列表 */}
          <div className='space-y-4 min-h-[400px]'>
            {paginatedListQuestions.map((q, idx) => (
              <Card
                key={q.id}
                size='small'
                className='rounded-2xl border-gray-100 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0'>
                    {(listPage - 1) * listPageSize + idx + 1}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-2'>
                      <Space size='small'>
                        <Tag
                          color='blue'
                          className='m-0 rounded-md border-0 font-bold text-[10px]'
                        >
                          {q.subject}
                        </Tag>
                        <Tag
                          color='purple'
                          className='m-0 rounded-md border-0 font-bold text-[10px]'
                        >
                          {q.type}
                        </Tag>
                        <Tag
                          color={q.difficulty === 'Hard' ? 'error' : 'warning'}
                          className='m-0 rounded-md border-0 font-bold text-[10px]'
                        >
                          {q.difficulty}
                        </Tag>
                      </Space>
                      <Space>
                        <Button
                          type='text'
                          size='small'
                          icon={<EditOutlined className='text-blue-500' />}
                          onClick={() => handleEditSingleQuestion(q)}
                        />
                        <Popconfirm
                          title='确认移除'
                          description='确定要将此题目从当前套题中移除吗？'
                          onConfirm={() => handleRemoveQuestionFromSet(q.id)}
                          okText='确定'
                          cancelText='取消'
                        >
                          <Button
                            type='text'
                            size='small'
                            danger
                            icon={<LogoutOutlined />}
                            title='从套题中移除'
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                    <div
                      className='text-sm text-gray-800 font-medium question-math-content'
                      dangerouslySetInnerHTML={{
                        __html: formatText(q.question),
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}

            {filteredListQuestions.length === 0 && (
              <div className='py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100'>
                <i className='fas fa-search text-4xl text-gray-200 mb-4'></i>
                <p className='text-gray-400'>该科目下暂无题目</p>
              </div>
            )}
          </div>

          {/* 分页 */}
          {filteredListQuestions.length > 0 && (
            <div className='flex justify-center pt-4'>
              <Pagination
                current={listPage}
                total={filteredListQuestions.length}
                pageSize={listPageSize}
                onChange={setListPage}
                showSizeChanger={false}
                className='custom-pagination'
              />
            </div>
          )}
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-bold text-gray-800 m-0'>
              题目组列表
            </h3>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={handleAddSection}
              className='bg-blue-600 hover:bg-blue-700 border-0 rounded-xl font-bold'
            >
              添加题目组
            </Button>
          </div>

          <div className='space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar'>
            {sections.map((section, index) => (
              <Card
                key={section.id}
                size='small'
                className='rounded-2xl border-gray-100 shadow-sm'
                title={
                  <div className='flex items-center justify-between'>
                    <Space>
                      <span className='w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold'>
                        {index + 1}
                      </span>
                      <span className='font-bold text-gray-700'>
                        {section.name}
                      </span>
                    </Space>
                    <Space>
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined className='text-blue-500' />}
                        onClick={() => handleEditSection(section)}
                      />
                      <Button
                        type='text'
                        size='small'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteSection(section.id)}
                      />
                    </Space>
                  </div>
                }
              >
                <div className='grid grid-cols-3 gap-6 mb-4'>
                  <div>
                    <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>
                      Duration
                    </div>
                    <div className='font-bold text-gray-700'>
                      {section.duration} 分钟
                    </div>
                  </div>
                  <div>
                    <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>
                      Target Count
                    </div>
                    <div className='font-bold text-gray-700'>
                      {section.questions} 题
                    </div>
                  </div>
                  <div>
                    <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>
                      Selected
                    </div>
                    <div className='font-bold text-blue-600'>
                      {section.selectedQuestions?.length || 0} 题
                    </div>
                  </div>
                </div>
                <div className='pt-4 border-t border-gray-50 flex justify-between items-center'>
                  <p className='text-xs text-gray-500 m-0 italic'>
                    {section.description}
                  </p>
                  <Button
                    type='primary'
                    size='small'
                    icon={<UnorderedListOutlined />}
                    onClick={() => handleManageQuestions(section)}
                    className='bg-green-600 hover:bg-green-700 border-0 rounded-lg font-bold'
                  >
                    选择题目
                  </Button>
                </div>
              </Card>
            ))}

            {sections.length === 0 && (
              <div className='text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100'>
                <i className='fas fa-inbox text-4xl mb-3'></i>
                <p>暂无题目组，请点击上方按钮添加</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        title={editingSection ? '编辑题目组' : '添加题目组'}
        open={isEditorVisible}
        onOk={handleSaveSection}
        onCancel={() => {
          setIsEditorVisible(false);
          form.resetFields();
        }}
        okText='保存'
        cancelText='取消'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='题目组名称'
            rules={[{ required: true, message: '请输入题目组名称' }]}
          >
            <Input placeholder='例如：Section 1, Module 1: Math' />
          </Form.Item>

          <Form.Item
            name='duration'
            label='时长（分钟）'
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <InputNumber
              min={1}
              max={120}
              className='w-full'
              placeholder='例如：35'
            />
          </Form.Item>

          <Form.Item
            name='questions'
            label='题目数量'
            rules={[{ required: true, message: '请输入题目数量' }]}
          >
            <InputNumber
              min={1}
              max={100}
              className='w-full'
              placeholder='例如：22'
            />
          </Form.Item>

          <Form.Item
            name='description'
            label='描述'
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={3} placeholder='简要描述该题目组的内容' />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={
          <div className='flex items-center justify-between'>
            <Space size='middle'>
              <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                <i className='fas fa-layer-group text-white'></i>
              </div>
              <div>
                <div className='text-lg font-bold text-gray-900'>选择题目</div>
                <div className='text-xs text-gray-500'>
                  {currentSectionForQuestions?.name}
                </div>
              </div>
            </Space>
            <div className='bg-blue-50 px-4 py-2 rounded-xl border border-blue-100'>
              <span className='text-sm text-blue-600 font-medium'>
                已选择题目：
              </span>
              <span className='text-lg font-black text-blue-700'>
                {selectedQuestions.length}
              </span>
            </div>
          </div>
        }
        placement='right'
        width={1000}
        open={isQuestionSelectorVisible}
        onClose={() => setIsQuestionSelectorVisible(false)}
        footer={
          <div className='flex justify-end space-x-3'>
            <Button
              size='large'
              onClick={() => setIsQuestionSelectorVisible(false)}
            >
              取消
            </Button>
            <Button
              size='large'
              type='primary'
              onClick={handleSaveQuestions}
              className='bg-blue-600 px-8'
            >
              保存并应用
            </Button>
          </div>
        }
      >
        <div className='flex h-full gap-6 overflow-hidden'>
          {/* 左侧：题库筛选与列表 (65%) */}
          <div className='flex-[65] flex flex-col min-w-0 h-full'>
            <div className='bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-3'>
                <Select
                  className='w-full'
                  value={filters.subject}
                  onChange={(v) => handleFilterChange('subject', v)}
                  placeholder='科目'
                >
                  <Option value='全部'>全部科目</Option>
                  <Option value='阅读'>阅读</Option>
                  <Option value='语法'>语法</Option>
                  <Option value='数学'>数学</Option>
                </Select>
                <Select
                  className='w-full'
                  value={filters.type}
                  onChange={(v) => handleFilterChange('type', v)}
                  placeholder='题型'
                >
                  <Option value='全部'>全部题型</Option>
                  {filters.subject !== '全部' &&
                    (questionTypesMap[filters.subject] || []).map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                </Select>
                <Select
                  className='w-full'
                  value={filters.difficulty}
                  onChange={(v) => handleFilterChange('difficulty', v)}
                  placeholder='难度'
                >
                  <Option value='全部'>全部难度</Option>
                  <Option value='Easy'>Easy</Option>
                  <Option value='Medium'>Medium</Option>
                  <Option value='Hard'>Hard</Option>
                </Select>
                <Select
                  className='w-full'
                  value={filters.source}
                  onChange={(v) => handleFilterChange('source', v)}
                  placeholder='来源'
                >
                  <Option value='全部'>全部来源</Option>
                  <Option value='历年考题'>历年考题</Option>
                  <Option value='官方样题'>官方样题</Option>
                  <Option value='Question Bank考题'>Question Bank考题</Option>
                </Select>
              </div>
              <Input
                placeholder='搜索题目内容关键词...'
                prefix={<FilterOutlined className='text-gray-400' />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </div>

            <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
              <div className='space-y-3'>
                {paginatedQuestions.map((question) => (
                  <Card
                    key={question.id}
                    size='small'
                    className={`hover:shadow-md transition-all border-gray-100 ${
                      selectedQuestions.includes(question.id)
                        ? 'border-blue-200 bg-blue-50/30'
                        : ''
                    }`}
                  >
                    <Collapse
                      ghost
                      expandIconPosition='end'
                      onChange={triggerMathRender}
                    >
                      <Panel
                        header={
                          <div className='flex items-center space-x-3'>
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleQuestionSelection(
                                  question.id,
                                  e.target.checked
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className='flex-1 min-w-0'>
                              <div
                                className='font-medium text-gray-900 truncate question-math-content'
                                style={{
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease-in',
                                }}
                              >
                                {question.question}
                              </div>
                              <Space size='small' className='mt-1 flex-wrap'>
                                <Tag
                                  color='blue'
                                  className='text-[10px] px-1 leading-4'
                                >
                                  {getTypeLabel(question.type)}
                                </Tag>
                                <Tag
                                  color='purple'
                                  className='text-[10px] px-1 leading-4'
                                >
                                  {question.subject}
                                </Tag>
                                <Tag
                                  color={
                                    question.difficulty === 'Easy'
                                      ? 'success'
                                      : question.difficulty === 'Medium'
                                      ? 'warning'
                                      : 'error'
                                  }
                                  className='text-[10px] px-1 leading-4'
                                >
                                  {question.difficulty}
                                </Tag>
                              </Space>
                            </div>
                          </div>
                        }
                        key={question.id}
                      >
                        <div className='pl-8 pt-3 border-t border-gray-100'>
                          <div className='space-y-3'>
                            <div
                              className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg question-math-content'
                              style={{
                                opacity: 0,
                                transition: 'opacity 0.2s ease-in',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: formatText(question.question),
                              }}
                            />
                            {question.options && (
                              <div className='space-y-2'>
                                {question.options.map((option, idx) => (
                                  <div
                                    key={idx}
                                    className='text-sm text-gray-600 pl-3 py-2 bg-white border border-gray-100 rounded-lg question-math-content'
                                    style={{
                                      opacity: 0,
                                      transition: 'opacity 0.2s ease-in',
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: formatText(option),
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Panel>
                    </Collapse>
                  </Card>
                ))}
                {filteredQuestions.length === 0 && (
                  <div className='text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100'>
                    <i className='fas fa-search text-4xl text-gray-200 mb-4'></i>
                    <p className='text-gray-400'>没有找到符合条件的题目</p>
                  </div>
                )}
              </div>
            </div>

            {filteredQuestions.length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-100 flex justify-center'>
                <Pagination
                  current={currentPage}
                  total={filteredQuestions.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  size='small'
                />
              </div>
            )}
          </div>

          <Divider type='vertical' className='h-full m-0' />

          {/* 右侧：已选清单 (35%) */}
          <div className='flex-[35] flex flex-col min-w-0 h-full'>
            <div className='flex items-center justify-between mb-4 px-2'>
              <h3 className='text-base font-bold text-gray-800 flex items-center'>
                <i className='fas fa-clipboard-check text-blue-600 mr-2'></i>
                已选题目清单
              </h3>
              {selectedQuestions.length > 0 && (
                <Button
                  type='link'
                  danger
                  size='small'
                  onClick={() => setSelectedQuestions([])}
                >
                  清空全部
                </Button>
              )}
            </div>

            <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
              <div className='space-y-3'>
                {selectedQuestionObjects.map((question, index) => (
                  <div
                    key={question.id}
                    className='group bg-white border border-gray-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all relative'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-2 mb-1'>
                          <span className='text-[10px] font-bold text-gray-400'>
                            #{index + 1}
                          </span>
                          <Tag
                            color='blue'
                            className='text-[10px] px-1 leading-4 m-0'
                          >
                            {getTypeLabel(question.type)}
                          </Tag>
                        </div>
                        <div
                          className='text-sm text-gray-700 line-clamp-2 question-math-content'
                          style={{
                            opacity: 0,
                            transition: 'opacity 0.2s ease-in',
                          }}
                        >
                          {question.question}
                        </div>
                      </div>
                      <Button
                        type='text'
                        danger
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          handleQuestionSelection(question.id, false)
                        }
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                      />
                    </div>
                  </div>
                ))}
                {selectedQuestions.length === 0 && (
                  <div className='text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100'>
                    <i className='fas fa-mouse-pointer text-3xl text-gray-200 mb-3'></i>
                    <p className='text-xs text-gray-400'>
                      从左侧勾选题目添加到清单
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* 题目编辑弹窗 */}
      <Modal
        title='编辑题目信息'
        open={isSingleQuestionEditorVisible}
        onCancel={() => setIsSingleQuestionEditorVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <QuestionEditor
          question={editingSingleQuestion}
          onSave={handleSaveSingleQuestion}
          onCancel={() => setIsSingleQuestionEditorVisible(false)}
        />
      </Modal>
    </Modal>
  );
}

export default SectionManager;
