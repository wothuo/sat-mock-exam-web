import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Pagination, Row, Space, Tag } from 'antd';

import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

function MockExam() {
  const [activeTab, setActiveTab] = useState('历年考题');
  const [selectedSubject, setSelectedSubject] = useState('数学');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [selectedYear, setSelectedYear] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const subjects = ['数学', '阅读语法'];
  const difficulties = ['全部', 'Easy', 'Medium', 'Hard'];
  const years = ['全部', '2025', '2024', '2023', '2022', '2021'];

  const examSets = [
    {
      id: 1,
      title: '2025年12月北美第4套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '包含代数、几何、数据分析等综合题型',
      year: 2025
    },
    {
      id: 2,
      title: '2025年12月北美第3套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '文学、历史、科学类文章阅读理解',
      year: 2025
    },
    {
      id: 3,
      title: '2025年12月北美第2套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '语法规则、标点符号、句子结构等',
      year: 2025
    },
    {
      id: 4,
      title: '官方样题集第1套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '官方发布的标准样题，适合初学者',
      year: 2025
    },
    {
      id: 5,
      title: '官方样题集第2套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '官方标准阅读理解题目',
      year: 2025
    },
    {
      id: 6,
      title: '2025年10月北美第5套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高难度数学综合测试，包含复杂应用题',
      year: 2025
    },
    {
      id: 7,
      title: '2025年10月北美第4套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '社会科学、自然科学类文章精选',
      year: 2025
    },
    {
      id: 8,
      title: '2025年10月北美第3套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础语法知识点全面覆盖',
      year: 2025
    },
    {
      id: 9,
      title: '2025年8月北美第6套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '统计学、概率论重点题型训练',
      year: 2025
    },
    {
      id: 10,
      title: '2025年8月北美第5套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '文学作品深度解析与理解',
      year: 2025
    },
    {
      id: 11,
      title: '2025年8月北美第4套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '高频语法错误识别与修正',
      year: 2025
    },
    {
      id: 12,
      title: '官方样题集第3套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '官方最新发布的标准测试题',
      year: 2025
    },
    {
      id: 13,
      title: '官方样题集第4套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Easy',
      description: '入门级阅读理解训练',
      year: 2025
    },
    {
      id: 14,
      title: '官方样题集第5套',
      subject: '语法',
      source: '官方样题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高级语法应用与写作技巧',
      year: 2025
    },
    {
      id: 15,
      title: '2025年6月北美第7套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础数学概念与计算能力测试',
      year: 2025
    },
    {
      id: 16,
      title: '2025年6月北美第6套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '跨学科文章阅读与分析',
      year: 2025
    },
    {
      id: 17,
      title: '2025年6月北美第5套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '复杂句式结构与修辞手法',
      year: 2025
    },
    {
      id: 18,
      title: '2025年4月北美第8套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '函数、方程组综合应用题',
      year: 2025
    },
    {
      id: 19,
      title: '2025年4月北美第7套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Easy',
      description: '日常生活类文章理解练习',
      year: 2025
    },
    {
      id: 20,
      title: '2025年4月北美第6套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '标准化考试语法重点突破',
      year: 2025
    },
    {
      id: 21,
      title: '官方样题集第6套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '挑战性数学问题解决能力测试',
      year: 2025
    },
    {
      id: 22,
      title: '官方样题集第7套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '学术性文章阅读技巧训练',
      year: 2025
    },
    {
      id: 23,
      title: '官方样题集第8套',
      subject: '语法',
      source: '官方样题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础语法规则系统复习',
      year: 2025
    },
    {
      id: 24,
      title: '2025年2月北美第9套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高等数学概念应用与推理',
      year: 2025
    },
    {
      id: 25,
      title: '2025年2月北美第8套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '批判性思维与文本分析',
      year: 2025
    },
    {
      id: 26,
      title: '2025年2月北美第7套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高级写作技巧与语言运用',
      year: 2025
    },
    {
      id: 27,
      title: '2024年12月北美第10套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '年度经典数学题型回顾',
      year: 2024
    },
    {
      id: 28,
      title: '2024年10月北美第11套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '高难度文学作品阅读理解训练',
      year: 2024
    },
    {
      id: 29,
      title: '2024年10月北美第10套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '复杂语法结构与写作技巧综合',
      year: 2024
    },
    {
      id: 30,
      title: '官方样题集第9套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '官方最新高难度数学挑战题',
      year: 2024
    },
    {
      id: 31,
      title: '官方样题集第10套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Easy',
      description: '官方基础阅读理解入门练习',
      year: 2024
    },
    {
      id: 32,
      title: '2024年8月北美第12套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高级语法应用与修辞技巧',
      year: 2024
    },
    {
      id: 33,
      title: '2024年8月北美第11套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '代数与几何综合应用题集',
      year: 2024
    },
    {
      id: 34,
      title: '2024年6月北美第13套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '科学类文章深度理解与分析',
      year: 2024
    },
    {
      id: 35,
      title: '2024年6月北美第12套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础语法规则系统性复习',
      year: 2024
    },
    {
      id: 36,
      title: '官方样题集第11套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '官方标准数学能力测试题',
      year: 2024
    },
    {
      id: 37,
      title: '2024年4月北美第14套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '历史文献与社会科学综合阅读',
      year: 2024
    },
    {
      id: 38,
      title: '2024年2月北美第15套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '三角函数与解析几何综合应用',
      year: 2024
    },
    {
      id: 39,
      title: '2024年2月北美第14套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础语法与句式结构练习',
      year: 2024
    },
    {
      id: 40,
      title: '官方样题集第12套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '官方最新高难度阅读理解测试',
      year: 2024
    },
    {
      id: 41,
      title: '2023年12月北美第16套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高等数学与统计学综合题型',
      year: 2023
    },
    {
      id: 42,
      title: '2023年12月北美第15套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '复杂语法结构与修辞手法应用',
      year: 2023
    },
    {
      id: 43,
      title: '官方样题集第13套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '官方基础数学能力测试题集',
      year: 2023
    },
    {
      id: 44,
      title: '2023年10月北美第17套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '人文社科类文章深度阅读训练',
      year: 2023
    },
    {
      id: 45,
      title: '2023年10月北美第16套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高级写作技巧与语言表达能力',
      year: 2023
    },
    {
      id: 46,
      title: '官方样题集第14套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '官方标准阅读理解能力测试',
      year: 2023
    },
    {
      id: 47,
      title: '2023年8月北美第18套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础代数与几何概念应用',
      year: 2023
    },
    {
      id: 48,
      title: '2023年8月北美第17套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '标准化考试语法重点突破训练',
      year: 2023
    },
    {
      id: 49,
      title: '官方样题集第15套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '官方高难度数学推理能力测试',
      year: 2023
    },
    {
      id: 50,
      title: '2023年6月北美第19套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Hard',
      description: '学术性文章批判性阅读训练',
      year: 2023
    },
    {
      id: 51,
      title: '2023年6月北美第18套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '语法基础知识系统性复习',
      year: 2023
    },
    {
      id: 52,
      title: '官方样题集第16套',
      subject: '阅读',
      source: '官方样题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Easy',
      description: '官方入门级阅读理解练习题',
      year: 2023
    },
    {
      id: 53,
      title: '2023年4月北美第20套',
      subject: '数学',
      source: '历年考题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '数据分析与概率统计综合应用',
      year: 2023
    },
    {
      id: 54,
      title: '2023年4月北美第19套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Hard',
      description: '高级语法应用与写作技巧提升',
      year: 2023
    },
    {
      id: 55,
      title: '官方样题集第17套',
      subject: '数学',
      source: '官方样题',
      duration: '70分钟',
      questions: 44,
      difficulty: 'Medium',
      description: '官方标准数学综合能力测试',
      year: 2023
    },
    {
      id: 56,
      title: '2023年2月北美第21套',
      subject: '阅读',
      source: '历年考题',
      duration: '65分钟',
      questions: 52,
      difficulty: 'Medium',
      description: '科技类与环境类文章阅读理解',
      year: 2023
    },
    {
      id: 57,
      title: '2023年2月北美第20套',
      subject: '语法',
      source: '历年考题',
      duration: '35分钟',
      questions: 44,
      difficulty: 'Easy',
      description: '基础语法规则与应用练习',
      year: 2023
    }
  ];

  const filteredExams = examSets.filter(exam => {
    const matchSource = exam.source === activeTab;
    const matchDifficulty = selectedDifficulty === '全部' || exam.difficulty === selectedDifficulty;
    const matchYear = selectedYear === '全部' || exam.year.toString() === selectedYear;
    
    let matchSubject = selectedSubject === '全部';
    if (!matchSubject) {
      if (selectedSubject === '阅读语法') {
        matchSubject = exam.subject === '阅读' || exam.subject === '语法';
      } else {
        matchSubject = exam.subject === selectedSubject;
      }
    }
    
    return matchSource && matchSubject && matchDifficulty && matchYear;
  });

  const paginatedExams = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredExams.slice(start, start + pageSize);
  }, [filteredExams, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSubject, selectedDifficulty, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('历年考题')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === '历年考题'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-history mr-2"></i>
              历年考题
            </button>
            <button
              onClick={() => setActiveTab('官方样题')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === '官方样题'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-file-alt mr-2"></i>
              官方样题
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-graduation-cap text-white text-xs"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">所属科目</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`group relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedSubject === subject
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg'
                        : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedSubject === subject 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        {selectedSubject === subject ? (
                          <i className="fas fa-check text-white text-xs"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 group-hover:text-blue-500 text-xs"></i>
                        )}
                      </div>
                      <span className="relative">
                        {subject}
                        {selectedSubject === subject && (
                          <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white/30 rounded-full"></div>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-chart-line text-white text-xs"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">套题难度</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`group relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedDifficulty === difficulty
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg'
                        : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedDifficulty === difficulty 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-orange-100'
                      }`}>
                        {selectedDifficulty === difficulty ? (
                          <i className="fas fa-check text-white text-xs"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 group-hover:text-orange-500 text-xs"></i>
                        )}
                      </div>
                      <span className="relative">
                        {difficulty}
                        {selectedDifficulty === difficulty && (
                          <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white/30 rounded-full"></div>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-calendar-alt text-white text-xs"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">套题年份</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`group relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedYear === year
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedYear === year 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-purple-100'
                      }`}>
                        {selectedYear === year ? (
                          <i className="fas fa-check text-white text-xs"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 group-hover:text-purple-500 text-xs"></i>
                        )}
                      </div>
                      <span className="relative">
                        {year}
                        {selectedYear === year && (
                          <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white/30 rounded-full"></div>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Row gutter={[12, 12]} className="mb-8">
          {paginatedExams.map((exam) => (
            <Col xs={24} sm={12} lg={8} key={exam.id}>
              <Card
                hoverable
                className="h-full"
                styles={{
                  body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }
                }}
              >
                <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
                  <Space direction="vertical" size="small" className="w-full">
                    <Space className="w-full justify-between">
                      <Tag color="blue">{exam.source}</Tag>
                      <Tag color={
                        exam.difficulty === 'Easy' ? 'success' :
                        exam.difficulty === 'Medium' ? 'warning' : 'error'
                      }>
                        {exam.difficulty}
                      </Tag>
                    </Space>
                    
                    <h3 className="text-base font-bold text-gray-800 leading-tight">
                      {exam.title}
                    </h3>
                    
                    <Tag color="purple">
                      <i className="fas fa-graduation-cap mr-1"></i>
                      {exam.subject}
                    </Tag>
                  </Space>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {exam.description}
                  </p>
                  
                  <Row gutter={8} className="mb-4">
                    <Col span={12}>
                      <Card size="small" className="text-center">
                        <ClockCircleOutlined className="text-blue-500 text-lg mb-1" />
                        <div className="text-xs text-gray-500">考试时长</div>
                        <div className="text-xs font-bold">{exam.duration}</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" className="text-center">
                        <QuestionCircleOutlined className="text-purple-500 text-lg mb-1" />
                        <div className="text-xs text-gray-500">题目数量</div>
                        <div className="text-xs font-bold">{exam.questions}题</div>
                      </Card>
                    </Col>
                  </Row>
                  
                  <Link to={`/exam/${exam.id}`}>
                    <Button type="primary" block size="large" className="bg-gradient-to-r from-indigo-500 to-purple-500">
                      <i className="fas fa-rocket mr-2"></i>
                      开始模考
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredExams.length > 0 && (
          <div className="flex justify-center mb-8">
            <Pagination
              current={currentPage}
              total={filteredExams.length}
              pageSize={pageSize}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowSizeChange={(current, size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showSizeChanger={true}
              pageSizeOptions={['9', '18', '27', '54']}
              showTotal={(total, range) => `显示第 ${range[0]}-${range[1]} 项，共 ${total} 项结果`}
              className="custom-pagination"
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default MockExam;

