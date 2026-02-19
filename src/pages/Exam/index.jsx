import React, { useCallback, useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Empty, Pagination, Row, Space, Spin, Tag, message } from 'antd';

import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { queryExamSectionList, answerOfSection } from '../../services/exam';

/** 套题所属科目枚举 */
const SUBJECT_ENUM = {
  ALL: 'ALL',
  SAT_MATH: 'SAT_MATH',
  SAT_RW: 'SAT_RW'
};

/** 枚举值 -> 中文展示 */
const SUBJECT_LABELS = {
  [SUBJECT_ENUM.ALL]: '全部',
  [SUBJECT_ENUM.SAT_MATH]: '数学',
  [SUBJECT_ENUM.SAT_RW]: '阅读语法'
};

const SUBJECT_OPTIONS = [
  { value: SUBJECT_ENUM.ALL, label: SUBJECT_LABELS[SUBJECT_ENUM.ALL] },
  { value: SUBJECT_ENUM.SAT_MATH, label: SUBJECT_LABELS[SUBJECT_ENUM.SAT_MATH] },
  { value: SUBJECT_ENUM.SAT_RW, label: SUBJECT_LABELS[SUBJECT_ENUM.SAT_RW] }
];

function MockExam() {
  const [activeTab, setActiveTab] = useState('历年真题');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_ENUM.ALL);
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [selectedYear, setSelectedYear] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [examSets, setExamSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examError, setExamError] = useState(null);
  const [total, setTotal] = useState(0);

  const difficulties = ['全部', '简单', '中等', '困难'];
  const years = ['全部', '2026', '2025', '2024', '2023'];

  const fetchExamData = useCallback(async (signal) => {
    setLoading(true);
    setExamError(null);
    try {
      const params = {
        pageNum: currentPage,
        pageSize: pageSize,
        examType: 'ALL',
        difficulty: selectedDifficulty === '全部' ? 'ALL' : selectedDifficulty,
        examRegion: 'ALL',
        examYear: selectedYear === '全部' ? 'ALL' : selectedYear,
        source: activeTab === '历年真题' ? '历年真题' : '官方样题',
        examName: 'ALL',
        sectionCategory: selectedSubject
      };

      const response = await queryExamSectionList(params, { signal, showError: false });

      if (signal.aborted) return;
      if (response && response.list) {
        const transformedData = response.list.map(item => ({
          id: item.sectionId,
          title: item.examSummary.examName,
          sectionName: item.sectionName,
          subject: item.sectionCategory,
          source: item.examSummary.source,
          duration: `${item.sectionTiming}分钟`,
          questions: item.questionCount,
          difficulty: item.examSummary.difficulty,
          // description: item.examSummary.examDescription || `${item.examSummary.examYear}年${item.examSummary.examType}${item.examSummary.examRegion}地区${item.sectionCategory}部分`,
          description: `${item.examSummary.examYear}年${item.examSummary.examType} ${item.examSummary.examRegion}地区 ${SUBJECT_LABELS[item.sectionCategory] ?? item.sectionCategory}部分`,
          year: parseInt(item.examSummary.examYear) || 2025
        }));

        setExamSets(transformedData);
        setTotal(response.total || 0);
      }
    } catch (error) {
      if (signal.aborted || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return;
      console.error('获取套题数据失败:', error);
      setExamError(error);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [activeTab, selectedSubject, selectedDifficulty, selectedYear, currentPage, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    fetchExamData(controller.signal);
    return () => controller.abort();
  }, [fetchExamData]);

  const handleRetry = () => {
    setExamError(null);
    const controller = new AbortController();
    fetchExamData(controller.signal);
  };

  const filteredExams = examSets.filter(exam => {
    const matchSource = exam.source === activeTab;
    const matchDifficulty = selectedDifficulty === '全部' || exam.difficulty === selectedDifficulty;
    const matchYear = selectedYear === '全部' || exam.year.toString() === selectedYear;

    let matchSubject = selectedSubject === SUBJECT_ENUM.ALL;
    if (!matchSubject) {
      matchSubject = exam.subject === selectedSubject;
    }

    return matchSource && matchSubject && matchDifficulty && matchYear;
  });

  const paginatedExams = React.useMemo(() => {
    // 由于接口已经做了分页，这里直接使用接口返回的数据
    return filteredExams;
  }, [filteredExams]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSubject, selectedDifficulty, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('历年真题')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === '历年真题'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-history mr-2"></i>
              历年真题
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
                {SUBJECT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedSubject(value)}
                    className={`group relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedSubject === value
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg'
                        : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedSubject === value 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        {selectedSubject === value ? (
                          <i className="fas fa-check text-white text-xs"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 group-hover:text-blue-500 text-xs"></i>
                        )}
                      </div>
                      <span className="relative">
                        {label}
                        {selectedSubject === value && (
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

        <Spin spinning={loading}>
          {examError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 mb-8">
              <i className="fas fa-exclamation-circle text-5xl text-amber-500 mb-4"></i>
              <p className="text-gray-600 mb-6">获取套题列表失败，请稍后重试</p>
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all"
              >
                重试
              </button>
            </div>
          ) : paginatedExams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 mb-8">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无符合条件的套题"
              />
            </div>
          ) : (
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
                <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 mb-3">
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="mb-2">
                      <Space className="w-full justify-between items-center">
                        <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {exam.source}
                        </span>
                          <div className="flex items-center text-xs text-purple-600 font-medium">
                            <i className="fas fa-book mr-1"></i>
                            {SUBJECT_LABELS[exam.subject] ?? exam.subject}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            exam.difficulty === '简单' ? 'text-green-700 bg-green-100' :
                                exam.difficulty === '中等' ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'}`}>
                        {exam.difficulty}
                      </span>
                      </Space>
                    </div>

                    {exam.title && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                          <i className="fas fa-cube mr-1"></i>
                          {exam.title}
                        </div>
                    )}
                    {exam.sectionName && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                          <i className="fas fa-layer-group text-xs"></i>
                          {/*<span className="text-gray-600">{exam.sectionName}</span>*/}
                          <span className="text-gray-500">{exam.sectionName}</span>
                          {/*<span className="text-gray-700/80">{exam.sectionName}</span>*/}
                          {/*<span className="text-blue-600/70">{exam.sectionName}</span>*/}
                        </div>
                    )}
                  </Space>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  {/*<p className="text-sm text-gray-600 mb-6 flex-1">*/}
                  {/*  {exam.description}*/}
                  {/*  {exam.sectionName && (*/}
                  {/*      <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">*/}
                  {/*        <i className="fas fa-layer-group text-xs"></i>*/}
                  {/*        {exam.sectionName}*/}
                  {/*      </div>*/}
                  {/*  )}*/}
                  {/*</p>*/}

                  <Row gutter={8} className="mb-5">
                    <Col span={12}>
                      <div className="flex items-center justify-center bg-blue-50 rounded-lg p-3 h-full">
                        <ClockCircleOutlined className="text-blue-500 text-lg mr-2" />
                        <div>
                          <div className="text-xs font-bold">考试时长: {exam.duration}</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="flex items-center justify-center bg-purple-50 rounded-lg p-3 h-full">
                        <QuestionCircleOutlined className="text-purple-500 text-lg mr-2" />
                        <div>
                          <div className="text-xs font-bold">题目数量: {exam.questions}题</div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-2">
                    <Link
                        to={`/exam/${exam.id}`}
                        state={{
                          sectionId: exam.id,
                          examTitle: exam.title,
                          sectionName: exam.sectionName,
                          examDuration: exam.duration,
                          totalQuestions: exam.questions
                        }}
                    >
                      <Button type="primary" block size="large" className="bg-gradient-to-r from-indigo-500 to-purple-500">
                        <i className="fas fa-rocket mr-2"></i>
                        开始模考
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
                </Col>
              ))}
            </Row>
          )}
        </Spin>

        {total > 0 && !examError && (
          <div className="flex justify-center mb-8">
            <Pagination
              current={currentPage}
              total={total}
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
              // showTotal={(total, range) => `显示第 ${range[0]}-${range[1]} 项，共 ${total} 项结果`}
              showTotal={(t) => `共 ${t} 条记录`}
              className="custom-pagination"
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default MockExam;