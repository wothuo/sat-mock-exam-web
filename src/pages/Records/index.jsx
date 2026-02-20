import React, { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { message } from 'antd';

import { fetchWrongRecordList } from '../../services/record';

import ExamTab from './components/ExamTab';
import NotesTab from './components/NotesTab';
import PracticeTab from './components/PracticeTab';
import QuestionDetailModal from './components/QuestionDetailModal';
import WrongTab from './components/WrongTab';

/** 解析接口 options 字符串为数组 [{ option, content }, ...] */
function parseOptionsOptions(value) {
  if (Array.isArray(value)) {
    // 处理数组格式：可能是直接的对象数组，也可能是JSON字符串数组
    return value.map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return typeof parsed === 'object' && parsed !== null ? parsed : { option: '', content: item };
        } catch {
          return { option: '', content: item };
        }
      }
      return item;
    }).filter(item => item && (item.option || item.content));
  }
  if (typeof value === 'object' && value !== null) {
    // 处理对象格式：{"A":"内容","B":"内容"}
    return Object.entries(value).map(([key, content]) => ({
      option: key,
      content: content
    }));
  }
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) {
      // 处理解析后为对象的情况
      return Object.entries(parsed).map(([key, content]) => ({
        option: key,
        content: content
      }));
    }
    return [];
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
  return value;
}
function toApiDifficulty(value) {
  return value;
}
function toApiTimeRange(value) {
  return value;
}

function PracticeRecord() {
  const [activeTab, setActiveTab] = useState('wrong');
  const [selectedWrongQuestion, setSelectedWrongQuestion] = useState(null);

  // 错题列表（方案甲：后端分页+筛选）
  const [wrongList, setWrongList] = useState([]);
  const [wrongPagination, setWrongPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [wrongLoading, setWrongLoading] = useState(false);
  const [wrongSubject, setWrongSubject] = useState('ALL');
  const [wrongDifficulty, setWrongDifficulty] = useState('ALL');
  const [wrongPeriod, setWrongPeriod] = useState('ALL');
  const [wrongError, setWrongError] = useState(null);

  const loadWrongList = useCallback(async (pageNum = wrongPagination.current, pageSize = wrongPagination.pageSize) => {
    setWrongLoading(true);
    setWrongError(null);
    try {
      const res = await fetchWrongRecordList({
        pageNum,
        pageSize,
        questionCategory: toApiQuestionCategory(wrongSubject),
        difficulty: toApiDifficulty(wrongDifficulty),
        timeRange: toApiTimeRange(wrongPeriod),
      });
      
      setWrongList((res.list || []).map(mapWrongItem).filter(Boolean));
      
      // 统一更新分页状态，参考ExamSetManagement的实现
      setWrongPagination({
        current: res.pageNum || pageNum,
        pageSize: res.pageSize || pageSize,
        total: res.total ?? 0,
      });
    } catch (err) {
      setWrongError(err);
      // 错误情况下也更新分页状态
      setWrongPagination({
        current: pageNum,
        pageSize: pageSize,
        total: 0,
      });
    } finally {
      setWrongLoading(false);
    }
  }, [wrongPagination.current, wrongPagination.pageSize, wrongSubject, wrongDifficulty, wrongPeriod]);

  const lastWrongRequestKeyRef = useRef(null);
  useEffect(() => {
    if (activeTab !== 'wrong') return;
    const requestKey = `${wrongPagination.current}-${wrongPagination.pageSize}-${wrongSubject}-${wrongDifficulty}-${wrongPeriod}`;
    if (lastWrongRequestKeyRef.current === requestKey) return;
    lastWrongRequestKeyRef.current = requestKey;
    loadWrongList(wrongPagination.current, wrongPagination.pageSize);
  }, [activeTab, wrongPagination.current, wrongPagination.pageSize, wrongSubject, wrongDifficulty, wrongPeriod]);

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
    {
      id: 'wrong',
      label: '错题记录',
      icon: 'fas fa-times-circle',
    },
    {
      id: 'mock',
      label: '模考记录',
      icon: 'fas fa-trophy'
    },
    {
      id: 'practice',
      label: '专项练习记录',
      icon: 'fas fa-dumbbell'
    },
    {
      id: 'notes',
      label: '笔记记录',
      icon: 'fas fa-sticky-note'
    },
  ];

  // 处理标签切换
  const handleTabChange = (tabId) => {
    if (tabId === 'mock' || tabId === 'practice' || tabId === 'notes') {
      message.warning({
        content: '功能暂未开放，敬请期待后续更新',
        duration: 2,
        style: {
          marginTop: '50px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#999999'
        }
      });
      return; // 不切换标签
    }
    setActiveTab(tabId);
  };

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
        return <ExamTab records={mockRecords} />;
      case 'practice':
        return <PracticeTab records={practiceRecords} />;
      case 'notes':
        return <NotesTab records={noteRecords} />;
      case 'wrong':
        if (wrongError) {
          return (
            <div className='flex flex-col items-center justify-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100'>
              <i className='fas fa-exclamation-circle text-5xl text-amber-500 mb-4'></i>
              <p className='text-gray-600 mb-6'>获取错题列表失败，请稍后重试</p>
              <button
                type='button'
                onClick={() => loadWrongList()}
                className='px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all'
              >
                重试
              </button>
            </div>
          );
        }
        return (
          <WrongTab
            records={wrongList}
            total={wrongPagination.total}
            pageNum={wrongPagination.current}
            pageSize={wrongPagination.pageSize}
            subject={wrongSubject}
            difficulty={wrongDifficulty}
            period={wrongPeriod}
            onFilterChange={({ subject, difficulty, period }) => {
              if (subject !== undefined) setWrongSubject(subject);
              if (difficulty !== undefined) setWrongDifficulty(difficulty);
              if (period !== undefined) setWrongPeriod(period);
              // 重置到第一页
              setWrongPagination(prev => ({ ...prev, current: 1 }));
            }}
            onPageChange={(pageNum, pageSize) => {
              // 直接调用loadWrongList，参考ExamSetManagement的实现
              loadWrongList(pageNum, pageSize);
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
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0'>
      {/* Tab切换 */}
      <div className='mb-8'>
        <div className='flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20'>
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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
    </div>
  );
}

export default PracticeRecord;