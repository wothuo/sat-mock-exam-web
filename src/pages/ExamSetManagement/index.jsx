import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Card, message, Modal, Space, Spin, Table, Tag } from 'antd';

import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';

import { getExamSetList } from '@/services';

import ExamSetEditor from './ExamSetEditor';
import SectionManager from './SectionManager';

function ExamSetManagement() {
  const navigate = useNavigate();
  const [examSets, setExamSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isSectionManagerVisible, setIsSectionManagerVisible] = useState(false);
  const [editingExamSet, setEditingExamSet] = useState(null);
  const [managingSections, setManagingSections] = useState(null);

  // 获取套题列表
  const fetchExamSetList = async (pageNum = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        examType: 'SAT', // 固定为SAT，后续可扩展为可选项
        pageNum,
        pageSize,
      };
      const result = await getExamSetList(params);
      
      if (result && result.list) {
        // 转换数据格式以适配表格
        const transformedData = result.list.map(item => ({
          id: item.taskId,
          taskId: item.taskId,
          title: item.taskName,
          source: item.examCategory || '暂无',
          totalQuestions: item.questionCount || 0,
          status: item.status === 1 ? 'published' : 'draft',
          statusDesc: item.statusDesc || (item.status === 1 ? '已发布' : '草稿'),
          examType: item.examType,
          examYear: item.examYear,
          examRegion: item.examRegion,
          // 接口未返回的字段
          totalDuration: null, // 暂无
          sections: null, // 暂无
          description: '', // 接口未返回描述
        }));
        
        setExamSets(transformedData);
        setPagination({
          current: result.pageNum || pageNum,
          pageSize: result.pageSize || pageSize,
          total: result.total || 0,
        });
      }
    } catch (error) {
      console.error('获取套题列表失败:', error);
      message.error('获取套题列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchExamSetList();
  }, []);

  const columns = [
    {
      title: '套题名称',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          {record.description && (
            <div className="text-xs text-gray-500 mt-1">{record.description}</div>
          )}
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
      title: '题目组数量',
      key: 'sections',
      width: 120,
      render: (_, record) => (
        <span className="font-medium text-gray-400">
          {record.sections !== null && record.sections !== undefined 
            ? `${record.sections.length} 个` 
            : '暂无'}
        </span>
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
        <span className="font-medium text-gray-400">
          {duration !== null && duration !== undefined ? `${duration} 分钟` : '暂无'}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {record.statusDesc || (status === 'published' ? '已发布' : '草稿')}
        </Tag>
      )
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
    // 使用 navigate 跳转到编辑页面，传递套题 ID（使用 taskId）
    navigate(`/exam-set-entry?id=${record.taskId || record.id}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除套题"${record.title}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        // TODO: 后续需要调用删除接口
        setExamSets(prev => prev.filter(item => (item.taskId || item.id) !== (record.taskId || record.id)));
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
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={examSets}
            rowKey="taskId"
            scroll={{ x: 1400 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (page, pageSize) => {
                fetchExamSetList(page, pageSize);
              },
              onShowSizeChange: (current, size) => {
                fetchExamSetList(1, size);
              },
            }}
          />
        </Spin>
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

