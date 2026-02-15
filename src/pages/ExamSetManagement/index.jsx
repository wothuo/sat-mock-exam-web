import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Card, message, Modal, Space, Spin, Switch, Table, Tag } from 'antd';

import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';

import { getExamSetList, deleteExam, alterExamStatus } from '@/services/exam';

import ExamSetListToolbar from './components/ExamSetListToolbar';
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
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isSectionManagerVisible, setIsSectionManagerVisible] = useState(false);
  const [editingExamSet, setEditingExamSet] = useState(null);
  const [managingSections, setManagingSections] = useState(null);

  // 获取套题列表
  const fetchExamSetList = async (pageNum = 1, pageSize = 10, keyword, signal) => {
    // 使用当前searchKeyword作为默认值（如果没有提供keyword参数）
    const actualKeyword = keyword !== undefined ? keyword : searchKeyword;
    setLoading(true);
    try {
      const params = {
        pageNum,
        pageSize,
        examType: 'SAT', // 固定为SAT，后续可扩展为可选项
      };

      // 只有当关键词有值时才添加到参数中
      if (actualKeyword && actualKeyword.trim() !== '') {
        params.examName = actualKeyword;
      }

      const requestConfig = signal ? { signal, showError: false } : {};
      const result = await getExamSetList(params, requestConfig);

      if (signal?.aborted) return;
      // 适配后端的分页查询结构
      if (result && result.list) {
        // getExamSetList已经在exam.js中返回了response.data
        const examList = result.list || [];
        
        // 转换数据格式以适配表格
        const transformedData = examList.map(item => ({
          id: item.examId,
          taskId: item.examId, // 保持与原代码兼容
          title: item.examName,
          source: item.source || '暂无',
          totalQuestions: item.questionCount || 0,
          status: item.status === 0 ? 0 : 1, // 保持数字状态值，0-正常（发布），1-禁用（下线）
          statusDesc: item.status === 0 ? '已发布' : '已下线', // 使用状态字段生成描述
          examType: item.examType,
          examYear: item.examYear,
          examRegion: item.examRegion,
          difficulty: item.difficulty || '未知', // 添加难度字段
          // 使用接口返回的字段
          totalDuration: item.examDuration, // 从接口获取总时长
          sections: item.sectionCount || 0, // 使用服务端返回的sectionCount字段
          description: item.examDescription || '', // 使用正确的字段名examDescription
        }));
        
        setExamSets(transformedData);
        
        // 处理total为0但实际有数据的情况
        const total = result.total > 0 ? result.total : examList.length;
        
        setPagination({
          current: result.pageNum || pageNum,
          pageSize: result.pageSize || pageSize,
          total: total,
        });
      } else {
        // 确保在无数据情况下也更新状态
        setExamSets([]);
        setPagination({
          current: pageNum,
          pageSize: pageSize,
          total: 0,
        });
      }
    } catch (error) {
      if (signal?.aborted || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return;
      console.error('获取套题列表失败:', error);
      message.error('获取套题列表失败，请稍后重试');
      // 确保在错误情况下也更新状态
      setExamSets([]);
      setPagination({
        current: pageNum,
        pageSize: pageSize,
        total: 0,
      });
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };
  
  // 处理搜索
  const handleSearch = () => {
    // 搜索时重置到第一页
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchExamSetList(1, pagination.pageSize, searchKeyword);
  };
  
  // 处理重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    // 重置时重置到第一页
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchExamSetList(1, pagination.pageSize, '');
  };

  // 初始化加载数据
  useEffect(() => {
    const controller = new AbortController();
    fetchExamSetList(1, pagination.pageSize, undefined, controller.signal);
    return () => controller.abort();
  }, []);

  const columns = [
    {
      title: '套题名称',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (text, record) => (
          <div className="min-w-0 px-2">
            <div className="font-semibold text-gray-900 truncate" title={text}>{text}</div>
            {record.description && (
                <div className="text-xs text-gray-500 mt-1 truncate" title={record.description}>{record.description}</div>
            )}
          </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 80,
      render: (source) => (
          <div className="px-2">
            <Tag color="blue" className="truncate max-w-full" title={source}>{source}</Tag>
          </div>
      )
    },
    {
      title: 'Section数量',
      key: 'sections',
      width: 80,
      render: (_, record) => (
          <div className="px-2">
            <span className="font-medium text-blue-600">
              {record.sections !== null && record.sections !== undefined && record.sections > 0
                  ? `${record.sections} 个`
                  : <span className="text-gray-400">暂无</span>}
            </span>
          </div>
      )
    },
    {
      title: '总题数',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
      width: 70,
      render: (questions) => (
          <div className="px-2">
            <span className="font-medium text-green-600">{questions} 题</span>
          </div>
      )
    },
    {
      title: '总时长',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      width: 80,
      render: (duration) => (
          <div className="px-2">
            <span className="font-medium text-orange-600">
              {duration !== null && duration !== undefined ? `${duration} 分钟` : <span className="text-gray-400">暂无</span>}
            </span>
          </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => (
          <Switch
              checked={status === 0}
              onChange={(checked) => handleChangeStatus(checked, record)}
              checkedChildren="发布"
              unCheckedChildren="下线"
          />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
          <div className="px-2">
            <Space size="middle" className="flex-nowrap">
               {/*<Button type="link"*/}
               {/*        size="small"*/}
               {/*        icon={<EyeOutlined />}*/}
               {/*        onClick={() => handleManageSections(record)}*/}
               {/*>*/}
               {/*  题目管理*/}
               {/*</Button>*/}
              <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  className="text-blue-600 hover:text-blue-800 px-2"
              >
                编辑
              </Button>
              <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                  className="text-red-600 hover:text-red-800 px-2"
              >
                删除
              </Button>
            </Space>
          </div>
      )
    }
  ];

  const handleEdit = (record) => {
    console.log('编辑套题:', record);
    // 使用 navigate 跳转到编辑页面，传递套题 ID（使用 taskId，保持与原代码兼容）
    navigate(`/exam-set-entry?id=${record.taskId || record.id}`);
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <DeleteOutlined className="text-red-600 text-sm" />
          </div>
          <span className="text-red-700 font-semibold">确认删除</span>
        </div>
      ),
      content: (
        <div className="py-2">
          <div className="text-gray-800 mb-2">
            您即将删除套题：
            <span className="font-semibold text-blue-600 ml-1">"{record.title}"</span>
          </div>
          <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-start space-x-2">
              <span className="text-red-500 mt-0.5">⚠</span>
              <span>此操作不可恢复，请谨慎操作！</span>
            </div>
          </div>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { 
        danger: true,
        className: 'h-10 px-6 font-medium'
      },
      cancelButtonProps: {
        className: 'h-10 px-6 font-medium'
      },
      className: 'delete-confirm-modal',
      onOk: async () => {
        try {
          // 调用后端删除接口
          const examId = record.examId || record.id || record.taskId;
          await deleteExam(examId);
          
          // 前端更新列表
          setExamSets(prev => prev.filter(item => (item.examId || item.id || item.taskId) !== examId));
          message.success('删除成功');
        } catch (error) {
          console.error('删除套题失败:', error);
          message.error('删除失败，请稍后重试');
        }
      }
    });
  };

  const handleChangeStatus = async (checked, record) => {
    try {
      // 根据开关状态确定要设置的状态值
      // true表示发布，false表示下线
      const status = checked ? 0 : 1; // 根据注释：0-发布，1-下线
      const examId = record.examId || record.id || record.taskId;

      // 调用接口更新状态
      await alterExamStatus({ examId, status });

      // 更新本地状态
      setExamSets(prev => prev.map(item =>
        (item.examId || item.id || item.taskId) === examId
          ? { ...item, status: checked ? 0 : 1 }
          : item
      ));

      message.success(`套题已${checked ? '发布' : '下线'}`);
    } catch (error) {
      console.error('更新套题状态失败:', error);
      message.error(`更新套题状态失败: ${error.message}`);

      // 如果更新失败，刷新列表以恢复原始状态
      fetchExamSetList(pagination.current, pagination.pageSize);
    }
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
      <ExamSetListToolbar
        searchValue={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSearch={handleSearch}
        onReset={handleReset}
        searchPlaceholder="请输入套题名称"
        primaryAction={{ label: '新增题库', icon: <FormOutlined />, to: '/exam-set-entry' }}
      />

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