import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import QuestionEditor from './QuestionEditor';
import QuestionList from './QuestionList';

function QuestionBank() {
  const [activeTab, setActiveTab] = useState('list');
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setActiveTab('editor');
  };

  const handleSave = () => {
    setEditingQuestion(null);
    setActiveTab('list');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">题库管理</h1>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingQuestion(null);
              setActiveTab('editor');
            }}
            className="bg-red-600 hover:bg-red-700 border-0"
          >
            新增题目
          </Button>
        </div>

        <div className="flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            题目列表
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            题目编辑器
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <QuestionList onEdit={handleEdit} />
      )}

      {activeTab === 'editor' && (
        <QuestionEditor 
          question={editingQuestion}
          onSave={handleSave}
          onCancel={() => setActiveTab('list')}
        />
      )}
    </div>
  );
}

export default QuestionBank;

