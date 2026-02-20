import React from 'react';

import { Button, Card, Pagination, Select, Space, Spin, Tag } from 'antd';

import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';

import { SUBJECT_CATEGORY_LABELS, DIFFICULTY_LABELS } from '../../ExamSetEntry/examSetEntryConstants';

const { Option } = Select;

function WrongTab({
  records = [],
  total = 0,
  pageNum = 1,
  pageSize = 10,
  subject = 'ALL',
  difficulty = 'ALL',
  period = 'ALL',
  onFilterChange,
  onPageChange,
  onShowDetail,
  loading = false,
}) {
  const handleSubjectChange = (value) => {
    onFilterChange?.({ subject: value });
  };
  const handleDifficultyChange = (value) => {
    onFilterChange?.({ difficulty: value });
  };
  const handlePeriodChange = (value) => {
    onFilterChange?.({ period: value });
  };

  const formatQuestionTime = (seconds) => {
    if (seconds == null) return '未记录';
    const mins = Math.floor(Number(seconds) / 60);
    const secs = Number(seconds) % 60;
    if (mins === 0) return `${secs}秒`;
    return `${mins}分${secs}秒`;
  };

  const getDifficultyColor = (d) => {
    const colors = {
      EASY: 'green',
      MEDIUM: 'orange',
      HARD: 'red'
    };
    return colors[d] || 'geekblue';
  };

  const getSubjectColor = (s) => {
    const colors = {
      MATH: 'blue',
      READING: 'purple',
      WRITING: 'magenta',
    };
    return colors[s] || 'cyan';
  };
  console.log(records);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        {/*<h2 className="text-xl font-semibold text-gray-900">错题记录</h2>*/}
        <Space size="middle">
          <Select
            value={subject}
            onChange={handleSubjectChange}
            style={{ width: 150 }}
            placeholder="选择科目"
          >
            <Option value="ALL">📚 全部科目</Option>
            <Option value="MATH">🔢 数学</Option>
            <Option value="READING">📖 阅读</Option>
            <Option value="WRITING">✏️ 语法</Option>
          </Select>
          <Select
            value={difficulty}
            onChange={handleDifficultyChange}
            style={{ width: 150 }}
            placeholder="选择难度"
          >
            <Option value="ALL">📊 全部难度</Option>
            <Option value="EASY">🎯 简单</Option>
            <Option value="MEDIUM">⚡ 中等</Option>
            <Option value="HARD">🔥 困难</Option>
          </Select>
          <Select
            value={period}
            onChange={handlePeriodChange}
            style={{ width: 150 }}
            placeholder="选择时间"
          >
            <Option value="ALL">📅 全部时间</Option>
            <Option value="RECENT_WEEK">📅 最近一周</Option>
            <Option value="RECENT_MONTH">📅 最近一个月</Option>
            <Option value="RECENT_THREE_MONTHS">📆 最近三个月</Option>
          </Select>
        </Space>
      </div>

      <Spin spinning={loading}>
        <div className="space-y-4">
          {records.map((q) => (
            <Card
              key={q.id}
              hoverable
              className="overflow-hidden border-gray-100 rounded-2xl"
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <Tag color={getSubjectColor(q.subject)} className="m-0 px-3 rounded-lg font-bold border-0">{SUBJECT_CATEGORY_LABELS[q.subject] || q.subject}</Tag>
                    <Tag color={getDifficultyColor(q.difficulty)} className="m-0 px-3 rounded-lg font-bold border-0">{DIFFICULTY_LABELS[q.difficulty] || q.difficulty}</Tag>
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
                <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Your</div>
                      <div className="text-sm font-black text-red-500 bg-red-50 min-w-10 h-8 flex items-center justify-center rounded-lg mx-auto px-2">{q.userAnswer}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Correct</div>
                      <div className="text-sm font-black text-blue-600 bg-blue-50 min-w-10 h-8 flex items-center justify-center rounded-lg mx-auto">{q.correctAnswer}</div>
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
                    onClick={() => onShowDetail?.(q)}
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
            current={pageNum}
            total={total}
            pageSize={pageSize}
            onChange={(p) => onPageChange?.(p, pageSize)}
            onShowSizeChange={(_, size) => {
              onPageChange?.(1, size);
            }}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
            hideOnSinglePage={false}
            showTotal={(t) => `共 ${t} 条记录`}
            className="custom-pagination"
          />
        </div>
      </Spin>
    </div>
  );
}

export default WrongTab;