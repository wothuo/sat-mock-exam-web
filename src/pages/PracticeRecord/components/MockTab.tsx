import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Select, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

const { Option } = Select;

function MockTab({ records }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchSubject = selectedSubject === 'all' || record.title.includes(selectedSubject === 'math' ? '数学' : selectedSubject === 'reading' ? '阅读' : '语法');
      
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

      return matchSubject && matchPeriod;
    });
  }, [records, selectedSubject, selectedPeriod]);

  // 分页逻辑
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">模考记录</h2>
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
        {paginatedRecords.map((record) => (
          <Card 
            key={record.id} 
            hoverable 
            className="border-gray-100 rounded-2xl overflow-hidden"
            styles={{ body: { padding: '24px' } }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* 左侧：核心信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-black text-gray-900 m-0 truncate">{record.title}</h3>
                  <Tag color="success" className="m-0 border-0 font-bold rounded-lg px-3">
                    {record.status}
                  </Tag>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mb-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    {record.date}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    {record.time}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correct:</span>
                    <span className="text-sm font-black text-blue-600">{record.correct}/{record.total}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accuracy:</span>
                    <span className={`text-sm font-black ${record.accuracy >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {record.accuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 右侧：成绩看板 */}
              <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-red-600 tracking-tighter">{record.score}</span>
                    <span className="text-xs font-black text-gray-400 uppercase">/ {record.totalScore}</span>
                    <Tag 
                      color={parseInt(record.score) >= 750 ? 'success' : 'warning'}
                      className="ml-2 border-0 font-black rounded-lg px-3 py-1 text-xs uppercase"
                    >
                      {parseInt(record.score) >= 750 ? 'Excellent' : 'Good'}
                    </Tag>
                  </div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Final Mock Exam Score
                  </div>
                </div>
                
                <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
                
                <Button 
                  type="primary" 
                  danger
                  className="h-12 px-6 rounded-xl font-black shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
                >
                  View Details
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

export default MockTab;