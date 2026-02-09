import React, { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import MockTab from './components/MockTab';
import NotesTab from './components/NotesTab';
import PracticeTab from './components/PracticeTab';
import QuestionDetailModal from './components/QuestionDetailModal';
import WrongTab from './components/WrongTab';
import { fetchWrongRecordList } from '../../services/record';

/** 解析接口 options 字符串为数组 [{ option, content }, ...] */
function parseOptionsOptions(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 接口列表项 → WrongTab 展示结构（含弹窗所需字段） */
function mapWrongItem(item) {
  if (!item) return null;
  const options = parseOptionsOptions(item.options);
  return {
    id: item.answerId,
    subject: item.questionCategory,
    difficulty: item.difficulty,
    date: item.startTime ? dayjs(item.startTime).format('YYYY-MM-DD') : '',
    question: item.questionContent,
    title: item.taskName,
    userAnswer: item.userAnswer,
    correctAnswer: item.answer,
    timeSpent: item.timeConsuming,
    questionContent: item.questionContent,
    taskName: item.taskName,
    startTime: item.startTime,
    // 弹窗：选项、解析、题目描述、题型、分值
    options,
    explanation: item.analysis,
    questionDescription: item.questionDescription,
    questionType: item.questionType,
    score: item.score,
  };
}

/** 前端筛选值 → 接口参数 */
function toApiQuestionCategory(value) {
  if (!value || value === 'all') return undefined;
  const map = { math: '数学', reading: '阅读', grammar: '语法' };
  return map[value];
}
function toApiDifficulty(value) {
  if (!value || value === 'all') return undefined;
  const v = String(value).toLowerCase();
  return v === 'easy' ? 'Easy' : v === 'medium' ? 'Medium' : v === 'hard' ? 'Hard' : undefined;
}
function toApiTimeRange(value) {
  if (!value || value === 'all') return undefined;
  const map = { month: '最近一个月', quarter: '最近三个月', half: '最近半年' };
  return map[value];
}

function PracticeRecord() {
  const [activeTab, setActiveTab] = useState('wrong');
  const [selectedWrongQuestion, setSelectedWrongQuestion] = useState(null);

  // 错题列表（方案甲：后端分页+筛选）
  const [wrongList, setWrongList] = useState([]);
  const [wrongTotal, setWrongTotal] = useState(0);
  const [wrongPageNum, setWrongPageNum] = useState(1);
  const [wrongPageSize, setWrongPageSize] = useState(10);
  const [wrongLoading, setWrongLoading] = useState(false);
  const [wrongSubject, setWrongSubject] = useState('all');
  const [wrongDifficulty, setWrongDifficulty] = useState('all');
  const [wrongPeriod, setWrongPeriod] = useState('all');

  const loadWrongList = useCallback(async () => {
    setWrongLoading(true);
    try {
      const res = await fetchWrongRecordList({
        pageNum: wrongPageNum,
        pageSize: wrongPageSize,
        questionCategory: toApiQuestionCategory(wrongSubject),
        difficulty: toApiDifficulty(wrongDifficulty),
        timeRange: toApiTimeRange(wrongPeriod),
      });
      setWrongList((res.list || []).map(mapWrongItem).filter(Boolean));
      setWrongTotal(res.total ?? 0);
      setWrongPageNum(res.pageNum ?? wrongPageNum);
      setWrongPageSize(res.pageSize ?? wrongPageSize);
    } finally {
      setWrongLoading(false);
    }
  }, [wrongPageNum, wrongPageSize, wrongSubject, wrongDifficulty, wrongPeriod]);

  const lastWrongRequestKeyRef = useRef(null);
  useEffect(() => {
    if (activeTab !== 'wrong') return;
    const requestKey = `${wrongPageNum}-${wrongPageSize}-${wrongSubject}-${wrongDifficulty}-${wrongPeriod}`;
    if (lastWrongRequestKeyRef.current === requestKey) return;
    lastWrongRequestKeyRef.current = requestKey;
    loadWrongList();
  }, [activeTab, wrongPageNum, wrongPageSize, wrongSubject, wrongDifficulty, wrongPeriod, loadWrongList]);

  useEffect(() => {
    if (window.renderMathInElement) {
      const containers = document.querySelectorAll('.math-content');
      containers.forEach((container) => {
        window.renderMathInElement(container, {
          delimiters: [
            { left: '$', right: '$', display: false },
            { left: '$$', right: '$$', display: true },
          ],
          throwOnError: false,
        });
      });
    }
  }, [activeTab]);

  // 笔记记录数据
  const tabItems = [
    // {
    //   id: 'mock',
    //   label: '模考记录',
    //   icon: 'fas fa-trophy'
    // },
    // {
    //   id: 'practice',
    //   label: '专项练习记录',
    //   icon: 'fas fa-dumbbell'
    // },
    // {
    //   id: 'notes',
    //   label: '笔记记录',
    //   icon: 'fas fa-sticky-note'
    // },
    {
      id: 'wrong',
      label: '错题记录',
      icon: 'fas fa-times-circle',
    },
  ];

  const noteRecords = [
    {
      id: 1,
      questionTitle: '2025年12月北美第4套数学 - 第5题',
      noteText:
        '这道题考查的是二次函数的顶点公式，需要注意配方法的应用。关键步骤是将一般式转换为顶点式。',
      highlightText:
        'The study found that broken-wing display is more observed in species',
      highlightColor: 'yellow',
      createdDate: '2024-01-15 14:30',
      examType: '套题模考',
      subject: '数学',
    },
    {
      id: 2,
      questionTitle: '阅读理解专项训练 - 第3题',
      noteText:
        '文章主旨题的解题技巧：首先找到每段的主题句,然后归纳总结。注意区分细节信息和主要观点。',
      highlightText: 'defensive behavior observed in Charadrius semipalmatus',
      highlightColor: 'green',
      createdDate: '2024-01-15 10:20',
      examType: '专项训练',
      subject: '阅读',
    },
    {
      id: 3,
      questionTitle: '2025年12月北美第3套阅读 - 第12题',
      noteText:
        '推理题需要基于文章内容进行合理推断，不能过度推理。答案必须有文章依据支持。',
      highlightText: 'reproductive investment and defensive behavior',
      highlightColor: 'blue',
      createdDate: '2024-01-14 16:45',
      examType: '套题模考',
      subject: '阅读',
    },
    {
      id: 4,
      questionTitle: '语法综合题练习 - 第8题',
      noteText:
        '主谓一致问题：当主语是集合名词时，要根据语境判断是强调整体还是个体。',
      highlightText: 'incubation periods, suggesting a correlation',
      highlightColor: 'pink',
      createdDate: '2024-01-14 09:15',
      examType: '专项训练',
      subject: '语法',
    },
    {
      id: 5,
      questionTitle: '2025年10月北美第5套数学 - 第18题',
      noteText:
        '统计学问题的关键是理解平均数、中位数、众数的区别和应用场景。这道题需要计算加权平均数。',
      highlightText: 'maximum number of broods per year',
      highlightColor: 'yellow',
      createdDate: '2024-01-13 15:30',
      examType: '套题模考',
      subject: '数学',
    },
    {
      id: 6,
      questionTitle: '主旨题目专项练习 - 第15题',
      noteText:
        '识别作者态度的关键词：positive, negative, neutral, critical, supportive等。注意语气词和情感色彩。',
      highlightText: 'ecological and life-history characteristics',
      highlightColor: 'green',
      createdDate: '2024-01-12 11:20',
      examType: '专项训练',
      subject: '阅读',
    },
  ];

  const mockRecords = [
    {
      id: 1,
      title: '2025年12月北美第4套数学',
      date: '2024-01-15',
      score: '750',
      totalScore: '800',
      correct: 38,
      total: 44,
      accuracy: 86,
      time: '45分钟',
      status: '已完成',
    },
    {
      id: 2,
      title: '2025年12月北美第3套阅读',
      date: '2024-01-14',
      score: '680',
      totalScore: '800',
      correct: 42,
      total: 52,
      accuracy: 81,
      time: '65分钟',
      status: '已完成',
    },
    {
      id: 3,
      title: '2025年12月北美第2套语法',
      date: '2024-01-13',
      score: '720',
      totalScore: '800',
      correct: 36,
      total: 44,
      accuracy: 82,
      time: '35分钟',
      status: '已完成',
    },
    {
      id: 4,
      title: '官方样题集第1套数学',
      date: '2024-01-12',
      score: '690',
      totalScore: '800',
      correct: 35,
      total: 44,
      accuracy: 80,
      time: '52分钟',
      status: '已完成',
    },
    {
      id: 5,
      title: '2025年10月北美第5套阅读',
      date: '2024-01-11',
      score: '710',
      totalScore: '800',
      correct: 45,
      total: 52,
      accuracy: 87,
      time: '58分钟',
      status: '已完成',
    },
  ];

  const practiceRecords = [
    {
      id: 1,
      title: '阅读理解专项训练',
      date: '2024-01-15',
      correct: 8,
      total: 10,
      accuracy: 80,
      score: 85,
      difficulty: 'Medium',
      time: '25分钟',
    },
    {
      id: 2,
      title: '语法综合题练习',
      date: '2024-01-14',
      correct: 15,
      total: 20,
      accuracy: 75,
      score: 78,
      difficulty: 'Hard',
      time: '30分钟',
    },
    {
      id: 3,
      title: '数学计算题训练',
      date: '2024-01-13',
      correct: 12,
      total: 15,
      accuracy: 80,
      score: 82,
      difficulty: 'Easy',
      time: '20分钟',
    },
    {
      id: 4,
      title: '主旨题目专项练习',
      date: '2024-01-12',
      correct: 18,
      total: 25,
      accuracy: 72,
      score: 76,
      difficulty: 'Medium',
      time: '35分钟',
    },
    {
      id: 5,
      title: '图表题专项训练',
      date: '2024-01-11',
      correct: 14,
      total: 18,
      accuracy: 78,
      score: 81,
      difficulty: 'Hard',
      time: '28分钟',
    },
    {
      id: 6,
      title: '推理题综合练习',
      date: '2024-01-10',
      correct: 22,
      total: 30,
      accuracy: 73,
      score: 77,
      difficulty: 'Medium',
      time: '42分钟',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mock':
        return <MockTab records={mockRecords} />;
      case 'practice':
        return <PracticeTab records={practiceRecords} />;
      case 'notes':
        return <NotesTab records={noteRecords} />;
      case 'wrong':
        return (
          <WrongTab
            records={wrongList}
            total={wrongTotal}
            pageNum={wrongPageNum}
            pageSize={wrongPageSize}
            subject={wrongSubject}
            difficulty={wrongDifficulty}
            period={wrongPeriod}
            onFilterChange={({ subject, difficulty, period }) => {
              if (subject !== undefined) setWrongSubject(subject);
              if (difficulty !== undefined) setWrongDifficulty(difficulty);
              if (period !== undefined) setWrongPeriod(period);
              setWrongPageNum(1);
            }}
            onPageChange={(pageNum, pageSize) => {
              setWrongPageNum(pageNum);
              if (pageSize != null) setWrongPageSize(pageSize);
            }}
            onShowDetail={setSelectedWrongQuestion}
            loading={wrongLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Tab切换 */}
      <div className='mb-8'>
        <div className='flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20'>
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab内容 */}
      {renderTabContent()}

      <QuestionDetailModal
        question={selectedWrongQuestion}
        onClose={() => setSelectedWrongQuestion(null)}
      />

      {/* 统计图表 */}
      {/* <Row gutter={[16, 16]} className="mt-12">
        <Col xs={24} lg={12}>
          <Card title="成绩趋势" bordered={false}>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <i className="fas fa-chart-line text-4xl mb-2"></i>
                <p>成绩趋势图表</p>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="各科目表现" bordered={false}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">数学</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">85%</span>
                  <span className="text-xs text-green-600 font-medium">优秀</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">阅读</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">78%</span>
                  <span className="text-xs text-yellow-600 font-medium">良好</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">语法</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">72%</span>
                  <span className="text-xs text-yellow-600 font-medium">良好</span>
                </div>
              </div>
            </div>
            
            <Row gutter={16} className="mt-6 pt-4 border-t border-gray-200">
              <Col span={8}>
                <Statistic 
                  title="平均正确率" 
                  value={78.3} 
                  suffix="%" 
                  valueStyle={{ color: '#ef4444' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="平均得分" 
                  value={720} 
                  valueStyle={{ color: '#22c55e' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="总练习次数" 
                  value={11} 
                  valueStyle={{ color: '#a855f7' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}

export default PracticeRecord;
