import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Card, Modal, Space, Table, Tag, message } from 'antd';

import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';

import ExamSetEditor from './ExamSetEditor';
import SectionManager from './SectionManager';

function ExamSetManagement() {
  const navigate = useNavigate();
  const [examSets, setExamSets] = useState([
    {
      id: 1,
      title: '2025年12月北美第4套',
      subject: '数学',
      source: '历年考题',
      difficulty: 'Medium',
      sections: [
        {
          id: 's1',
          name: 'Section 1, Module 1: Math',
          duration: 35,
          questions: 22,
          description: '不可使用计算器',
          selectedQuestions: [1, 3, 8, 9, 11, 12, 13, 16, 19, 22, 33, 36]
        },
        {
          id: 's2',
          name: 'Section 1, Module 2: Math',
          duration: 35,
          questions: 22,
          description: '可使用计算器',
          selectedQuestions: [24, 28, 31, 39, 42, 45, 48, 51]
        }
      ],
      totalDuration: 70,
      totalQuestions: 44,
      description: '包含代数、几何、数据分析等综合题型',
      createdAt: '2024-01-15',
      status: 'published'
    },
    {
      id: 2,
      title: '2025年12月北美第3套',
      subject: '阅读',
      source: '历年考题',
      difficulty: 'Hard',
      sections: [
        {
          id: 's1',
          name: 'Section 1, Module 1: Reading and Writing',
          duration: 32,
          questions: 27,
          description: '文学、历史类文章',
          selectedQuestions: [2, 5, 7, 10, 14, 17, 20, 23, 25, 29, 32, 34]
        },
        {
          id: 's2',
          name: 'Section 1, Module 2: Reading and Writing',
          duration: 33,
          questions: 25,
          description: '科学、社会科学类文章',
          selectedQuestions: [37, 40, 43, 46, 49, 52, 4, 6, 15, 18]
        }
      ],
      totalDuration: 65,
      totalQuestions: 52,
      description: '文学、历史、科学类文章阅读理解',
      createdAt: '2024-01-14',
      status: 'published'
    }
  ]);

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isSectionManagerVisible, setIsSectionManagerVisible] = useState(false);
  const [editingExamSet, setEditingExamSet] = useState(null);
  const [managingSections, setManagingSections] = useState(null);

  const columns = [
    {
      title: '套题名称',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-xs text-gray-500 mt-1">{record.description}</div>
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (source) => (
        <Tag color="purple">{source}</Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty) => (
        <Tag color={
          difficulty === 'Easy' ? 'success' :
          difficulty === 'Medium' ? 'warning' : 'error'
        }>
          {difficulty}
        </Tag>
      )
    },
    {
      title: '题目组数量',
      key: 'sections',
      width: 120,
      render: (_, record) => (
        <span className="font-medium">{record.sections.length} 个</span>
      )
    },
    {
      title: '总题数',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
      width: 100,
      render: (questions) => (
        <span className="font-medium">{questions} 题</span>
      )
    },
    {
      title: '总时长',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      width: 100,
      render: (duration) => (
        <span className="font-medium">{duration} 分钟</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {/* <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleManageSections(record)}
          >
            题目管理
          </Button> */}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const handleEdit = (record) => {
    // 使用 navigate 跳转到编辑页面，传递套题 ID
    navigate(`/exam-set-entry?id=${record.id}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除套题"${record.title}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        setExamSets(prev => prev.filter(item => item.id !== record.id));
        message.success('删除成功');
      }
    });
  };

  const handleManageSections = (record) => {
    setManagingSections(record);
    setIsSectionManagerVisible(true);
  };

  const handleSaveExamSet = (examSetData) => {
    if (editingExamSet) {
      setExamSets(prev => prev.map(item => 
        item.id === editingExamSet.id ? { ...item, ...examSetData } : item
      ));
      message.success('套题更新成功');
    } else {
      const newExamSet = {
        ...examSetData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      };
      setExamSets(prev => [...prev, newExamSet]);
      message.success('套题创建成功');
    }
    setIsEditorVisible(false);
  };

  const handleSaveSections = (sections) => {
    setExamSets(prev => prev.map(item => {
      if (item.id === managingSections.id) {
        const totalQuestions = sections.reduce((sum, s) => sum + s.questions, 0);
        const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
        return {
          ...item,
          sections,
          totalQuestions,
          totalDuration
        };
      }
      return item;
    }));
    message.success('Section更新成功');
    setIsSectionManagerVisible(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-end">
          <Space size="middle">
            <Button
              size="large"
              icon={<FormOutlined />}
              onClick={() => navigate('/exam-set-entry')}
              className="rounded-xl border-2 border-red-500 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-100"
            >
              新增题库
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={examSets}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <ExamSetEditor
        visible={isEditorVisible}
        examSet={editingExamSet}
        onSave={handleSaveExamSet}
        onCancel={() => setIsEditorVisible(false)}
      />

      <SectionManager
        visible={isSectionManagerVisible}
        examSet={managingSections}
        onSave={handleSaveSections}
        onCancel={() => setIsSectionManagerVisible(false)}
      />
    </div>
  );
}

export default ExamSetManagement;

