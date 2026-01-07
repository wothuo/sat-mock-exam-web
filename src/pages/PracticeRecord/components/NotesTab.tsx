import { ClockCircleOutlined, FileTextOutlined, HighlightOutlined } from '@ant-design/icons';
import { Card, Pagination, Select, Space, Tag } from 'antd';
import React, { useMemo, useState } from 'react';

const { Option } = Select;

function NotesTab({ records }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const subjectMap = { math: '数学', reading: '阅读', grammar: '语法' };
      return selectedSubject === 'all' || record.subject === subjectMap[selectedSubject];
    });
  }, [records, selectedSubject]);

  // 分页逻辑
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">笔记记录</h2>
        <Select
          value={selectedSubject}
          onChange={handleSubjectChange}
          style={{ width: 150 }}
          placeholder="选择科目"
        >
          <Option value="all">📚 全部科目</Option>
          <Option value="math">🔢 数学</Option>
          <Option value="reading">📖 阅读</Option>
          <Option value="grammar">✏️ 语法</Option>
        </Select>
      </div>

      <div className="space-y-4">
        {paginatedRecords.map((note) => (
          <Card key={note.id} hoverable className="border-gray-100 rounded-2xl">
            <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Space className="mb-2">
                  <h3 className="font-bold text-gray-900">{note.questionTitle}</h3>
                  <Tag color={note.examType === '套题模考' ? 'blue' : 'purple'}>
                    {note.examType}
                  </Tag>
                </Space>
                <div className="text-sm text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {note.createdDate}
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-400">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <HighlightOutlined className="mr-1" />
                高亮文本
              </div>
              <div className="text-sm text-gray-800 italic">"{note.highlightText}"</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <FileTextOutlined className="mr-1" />
                我的笔记
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{note.noteText}</p>
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

export default NotesTab;