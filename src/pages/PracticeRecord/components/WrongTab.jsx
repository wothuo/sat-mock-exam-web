import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Select, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

const { Option } = Select;

function WrongTab({ records, onShowDetail }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const subjectMap = { math: '数学', reading: '阅读', grammar: '语法' };
      const matchSubject = selectedSubject === 'all' || record.subject === subjectMap[selectedSubject];
      const matchDifficulty = selectedDifficulty === 'all' || record.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      
      // 时间筛选逻辑
      let matchPeriod = true;
      if (selectedPeriod !== 'all') {
        const recordDate = dayjs(record.date);
        const now = dayjs();
        if (selectedPeriod === 'month') {
          matchPeriod = recordDate.isAfter(now.subtract(1, 'month'));
        } else if (selectedPeriod === 'quarter') {
          matchPeriod = recordDate.isAfter(now.subtract(3, 'month'));
        } else if (selectedPeriod === 'half') {
          matchPeriod = recordDate.isAfter(now.subtract(6, 'month'));
        }
      }

      return matchSubject && matchDifficulty && matchPeriod;
    });
  }, [records, selectedSubject, selectedDifficulty, selectedPeriod]);

  // 分页逻辑
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const formatQuestionTime = (seconds) => {
    if (!seconds) return '未记录';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}秒`;
    return `${mins}分${secs}秒`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'error'
    };
    return colors[difficulty] || 'default';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      '数学': 'blue',
      '阅读': 'purple',
      '语法': 'orange'
    };
    return colors[subject] || 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">错题记录</h2>
        <Space size="middle">
          <Select
            value={selectedSubject}
            onChange={handleFilterChange(setSelectedSubject)}
            style={{ width: 150 }}
            placeholder="选择科目"
          >
            <Option value="all">📚 全部科目</Option>
            <Option value="math">🔢 数学</Option>
            <Option value="reading">📖 阅读</Option>
            <Option value="grammar">✏️ 语法</Option>
          </Select>
          <Select
            value={selectedDifficulty}
            onChange={handleFilterChange(setSelectedDifficulty)}
            style={{ width: 150 }}
            placeholder="选择难度"
          >
            <Option value="all">📊 全部难度</Option>
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Select>
          <Select
            value={selectedPeriod}
            onChange={handleFilterChange(setSelectedPeriod)}
            style={{ width: 150 }}
            placeholder="选择时间"
          >
            <Option value="all">📅 全部时间</Option>
            <Option value="month">📅 最近一个月</Option>
            <Option value="quarter">📆 最近三个月</Option>
            <Option value="half">🗓️ 最近半年</Option>
          </Select>
        </Space>
      </div>

      <div className="space-y-4">
        {paginatedRecords.map((q) => (
          <Card
            key={q.id}
            hoverable
            className="overflow-hidden border-gray-100 rounded-2xl"
            styles={{ body: { padding: '20px 24px' } }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* 左侧：题目核心信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-3 mb-3">
                  <Tag color={getSubjectColor(q.subject)} className="m-0 px-3 rounded-lg font-bold border-0">{q.subject}</Tag>
                  <Tag color={getDifficultyColor(q.difficulty)} className="m-0 px-3 rounded-lg font-bold border-0">{q.difficulty}</Tag>
                  <span className="text-xs text-gray-400 font-bold flex items-center ml-1">
                    <i className="far fa-calendar-alt mr-1.5"></i>
                    {q.date}
                  </span>
                </div>
                <h3 className="text-gray-800 font-bold text-base mb-2 math-content line-clamp-1">
                  {q.question}
                </h3>
                <p className="text-xs text-gray-400 italic truncate m-0 opacity-70">Source: {q.title}</p>
              </div>

              {/* 右侧：统计数据与操作 */}
              <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Your</div>
                    <div className="text-sm font-black text-red-500 bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg mx-auto">{q.userAnswer}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Correct</div>
                    <div className="text-sm font-black text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg mx-auto">{q.correctAnswer}</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Time</div>
                    <div className="text-sm font-black text-purple-600 flex items-center h-8">
                      <ClockCircleOutlined className="mr-1" />
                      {formatQuestionTime(q.timeSpent)}
                    </div>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  danger
                  icon={<EyeOutlined />}
                  onClick={() => onShowDetail(q)}
                  className="h-11 px-6 rounded-xl font-black shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
                >
                  查看详情
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Pagination
          current={currentPage}
          total={filteredRecords.length}
          pageSize={pageSize}
          onChange={setCurrentPage}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          showSizeChanger={true}
          pageSizeOptions={['5', '10', '20', '50']}
          hideOnSinglePage={false}
          showTotal={(total) => `共 ${total} 条记录`}
          className="custom-pagination"
        />
      </div>
    </div>
  );
}

export default WrongTab;