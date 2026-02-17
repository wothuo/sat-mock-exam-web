import React, { useMemo, useState } from 'react';

import { Button, Card, Pagination, Select, Tag } from 'antd';

import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

function PracticeTab({ records }) {
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const typeMap = { reading: '阅读', grammar: '语法', math: '数学' };
      return selectedType === 'all' || record.title.includes(typeMap[selectedType]);
    });
  }, [records, selectedType]);

  // 分页逻辑
    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRecords.slice(start, start + pageSize);
    }, [filteredRecords, currentPage, pageSize]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        {/*<h2 className="text-xl font-semibold text-gray-900">专项练习记录</h2>*/}
        <Select
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: 150 }}
          placeholder="选择类型"
        >
          <Option value="all">🎯 全部类型</Option>
          <Option value="reading">📚 阅读理解</Option>
          <Option value="grammar">✍️ 语法综合</Option>
          <Option value="math">🧮 数学计算</Option>
        </Select>
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
                  <Tag 
                    color={
                      record.difficulty === '简单' ? 'success' :
                      record.difficulty === '中等' ? 'warning' : 'error'
                    }
                    className="m-0 border-0 font-bold rounded-lg px-3"
                  >
                    {record.difficulty}
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correct:</span>
                    <span className="text-sm font-black text-green-600">{record.correct}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wrong:</span>
                    <span className="text-sm font-black text-red-600">{record.total - record.correct}</span>
                  </div>
                </div>
              </div>

              {/* 右侧：成绩看板 */}
              <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-red-600 tracking-tighter">{record.score}</span>
                    <span className="text-xs font-black text-gray-400 uppercase">pts</span>
                    <Tag 
                      color={record.score >= 85 ? 'success' : 'warning'}
                      className="ml-2 border-0 font-black rounded-lg px-3 py-1 text-xs uppercase"
                    >
                      {record.score >= 85 ? 'Excellent' : 'Good'}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <span className="flex items-center">
                      <CheckCircleOutlined className="mr-1 text-green-500" />
                      Accuracy: {record.accuracy}%
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{record.correct}/{record.total} Questions</span>
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

export default PracticeTab;