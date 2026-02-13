import React from 'react';

import { Button, Card, Empty, Modal, Space, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * 套题录入 - Section 结构规划（步骤 1）
 * 仅负责展示与事件转发，Section 新增/编辑 Modal 及 sections 状态保留在父组件
 */
function ExamSetSectionStep({
  sections,
  loading,
  isEditMode,
  onAddSection,
  onEditSection,
  onRemoveSection,
  onPrev,
  onNext
}) {
  const activeSections = sections.filter(section => section.delFlag !== '1');

  const handleDeleteClick = (section) => {
    Modal.confirm({
      icon: null,
      title: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <DeleteOutlined className="text-red-600 text-sm" />
          </div>
          <span className="text-red-700 font-semibold">确认删除Section</span>
        </div>
      ),
      content: (
        <div className="py-2">
          <div className="text-gray-800 mb-2">
            您即将删除Section：
            <span className="font-semibold text-purple-600 ml-1">&quot;{section.name}&quot;</span>
          </div>
          <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3 border border-red-200">
            <span>同时将删除该Section下的所有题目，且不可恢复！</span>
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
      onOk: () => onRemoveSection(section.id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 m-0">Section 结构规划</h2>
          <p className="text-sm text-gray-500 m-0">定义套题的模块组成（如 Module 1, Module 2）</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddSection}
          className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-bold"
        >
          添加 Section
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSections.map((section, index) => (
          <Card
            key={section.id}
            className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-bold text-gray-700 ml-2 truncate" title={section.name}>{section.name}</span>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    <Tag color="purple" className="m-0 rounded-md border-0 font-bold text-[10px] mr-2">{section.subject}</Tag>
                    <Button type="text" size="small" icon={<EditOutlined className="text-blue-500" />} onClick={() => onEditSection(section)} />
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(section)} />
                  </div>
                </div>
              </div>
            }
          >
            <div className="flex justify-between items-center px-4">
              <div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Duration</div>
                <div className="font-bold text-gray-700">{section.duration} min</div>
              </div>
              <div className="flex items-center">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Difficulty</div>
                  <div className="flex items-center justify-end">
                    <i className={`fas fa-star ${section.difficulty === '简单' ? 'text-green-500' : section.difficulty === '困难' ? 'text-red-500' : 'text-yellow-500'} text-sm`} />
                    <span className="text-xs font-medium ml-1 text-gray-600">
                      {section.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              {section.description && (
                <div className="text-right flex-1 ml-4">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Description</div>
                  <div className="text-sm text-gray-600">{section.description}</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {sections.length === 0 && (
        <Card className="rounded-3xl border-dashed border-2 border-gray-200 py-12 text-center">
          <Empty description="请先添加 Section 结构" />
        </Card>
      )}

      <div className="flex items-center justify-between pt-8">
        <Button size="large" onClick={onPrev} className="h-12 px-8 rounded-xl">
          上一步
        </Button>
        <Space>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={onNext}
            className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 border-0 font-bold"
          >
            下一步：{isEditMode ? '修改' : '录入'}题目内容
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default ExamSetSectionStep;