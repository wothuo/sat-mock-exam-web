import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Pagination, Row, Space, Tag, message } from 'antd';

import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { queryExamSectionList, answerOfSection } from '../../services/exam';

function MockExam() {
  const [activeTab, setActiveTab] = useState('历年真题');
  const [selectedSubject, setSelectedSubject] = useState('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [selectedYear, setSelectedYear] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [examSets, setExamSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const subjects = ['全部', '数学', '阅读语法'];
  const difficulties = ['全部', 'Easy', 'Medium', 'Hard'];
  const years = ['全部', '2025', '2024', '2023', '2022', '2021'];

  // 获取套题数据
  const fetchExamData = async () => {
    setLoading(true);
    try {
      const params = {
        pageNum: currentPage,
        pageSize: pageSize,
        examType: 'ALL',
        difficulty: selectedDifficulty === '全部' ? 'ALL' : selectedDifficulty,
        examRegion: 'ALL',
        examYear: selectedYear === '全部' ? 'ALL' : selectedYear,
        source: activeTab === '历年真题' ? '历年真题' : '官方样题',
        examName: 'ALL'
      };

      const response = await queryExamSectionList(params);
      
      if (response && response.list) {
        // 转换接口数据格式以适配现有UI
        const transformedData = response.list.map(item => ({
          id: item.sectionId,
          title: item.examSummary.examName,
          subject: item.sectionCategory,
          source: item.examSummary.source,
          duration: `${item.sectionTiming}分钟`,
          questions: item.questionCount,
          difficulty: item.examSummary.difficulty,
          description: item.examSummary.examDescription || `${item.examSummary.examYear}年${item.examSummary.examType}${item.examSummary.examRegion}地区${item.sectionCategory}部分`,
          year: parseInt(item.examSummary.examYear) || 2025
        }));
        
        setExamSets(transformedData);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('获取套题数据失败:', error);
      message.error('获取套题数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamData();
  }, [activeTab, selectedSubject, selectedDifficulty, selectedYear, currentPage, pageSize]);

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
    // 由于接口已经做了分页，这里直接使用接口返回的数据
    return filteredExams;
  }, [filteredExams]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSubject, selectedDifficulty, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                        exam.difficulty === '简单' ? 'success' :
                        exam.difficulty === '中等' ? 'warning' : 'error'
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

                  <Link 
                    to={`/exam/${exam.id}`} 
                    state={{
                      sectionId: exam.id,
                      examTitle: exam.title,
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
              </Card>
            </Col>
          ))}
        </Row>

        {total > 0 && (
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