import React from 'react';

import { Form, InputNumber, Modal, Select } from 'antd';

const { Option } = Select;

/**
 * 添加/编辑 Section 弹窗
 * 表单由父组件传入，校验与保存逻辑在父组件 onOk 中处理
 */
function SectionFormModal({ open, onCancel, onOk, loading, form, editingSection }) {
  const handleNameChange = (value) => {
    if (!form) return;
    if (value && value.includes('Reading and Writing')) {
      form.setFieldsValue({ subject: '阅读语法', duration: 32 });
    } else if (value && value.includes('Math')) {
      form.setFieldsValue({ subject: '数学', duration: 35 });
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-layer-group text-white text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 m-0">{editingSection ? '编辑 Section' : '添加 Section'}</h3>
            <p className="text-xs text-gray-500 m-0 font-normal">配置套题的模块信息</p>
          </div>
        </div>
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      width={600}
      className="section-modal"
      okButtonProps={{
        loading,
        className: 'h-11 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 font-bold shadow-lg'
      }}
      cancelButtonProps={{
        className: 'h-11 px-8 rounded-xl font-bold'
      }}
    >
      {form && (
        <Form form={form} layout="vertical" className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="text-sm font-bold text-gray-700">Section 名称</span>}
              rules={[{ required: true, message: '请选择 Section' }]}
            >
              <Select
                placeholder="选择 Section"
                className="h-12 rounded-xl"
                suffixIcon={<i className="fas fa-chevron-down text-gray-400"></i>}
                optionLabelProp="children"
                classNames={{ popup: 'section-dropdown' }}
                onChange={handleNameChange}
              >
                <Option value="Section 1, Module 1:Reading and Writing">
                  <div className="flex items-center space-x-2 py-1 w-full" title="Section 1, Module 1: Reading and Writing">
                    <i className="fas fa-book text-purple-500 flex-shrink-0"></i>
                    <span className="truncate">Section 1, Module 1: Reading and Writing</span>
                  </div>
                </Option>
                <Option value="Section 1, Module 2:Reading and Writing">
                  <div className="flex items-center space-x-2 py-1 w-full" title="Section 1, Module 2: Reading and Writing">
                    <i className="fas fa-book text-purple-500 flex-shrink-0"></i>
                    <span className="truncate">Section 1, Module 2: Reading and Writing</span>
                  </div>
                </Option>
                <Option value="Section 2, Module 1:Math">
                  <div className="flex items-center space-x-2 py-1 w-full" title="Section 2, Module 1: Math">
                    <i className="fas fa-calculator text-blue-500 flex-shrink-0"></i>
                    <span className="truncate">Section 2, Module 1: Math</span>
                  </div>
                </Option>
                <Option value="Section 2, Module 2:Math">
                  <div className="flex items-center space-x-2 py-1 w-full" title="Section 2, Module 2: Math">
                    <i className="fas fa-calculator text-blue-500 flex-shrink-0"></i>
                    <span className="truncate">Section 2, Module 2: Math</span>
                  </div>
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="subject"
              label={<span className="text-sm font-bold text-gray-700">所属科目</span>}
              rules={[{ required: true, message: '请选择科目' }]}
            >
              <Select
                placeholder="选择科目"
                className="h-12 rounded-xl"
                suffixIcon={<i className="fas fa-chevron-down text-gray-400"></i>}
              >
                <Option value="阅读语法">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-book-open text-purple-500"></i>
                    <span>阅读语法</span>
                  </div>
                </Option>
                <Option value="数学">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-calculator text-blue-500"></i>
                    <span>数学</span>
                  </div>
                </Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="difficulty"
              label={<span className="text-sm font-bold text-gray-700">Section难度</span>}
              rules={[{ required: true, message: '请选择难度' }]}
            >
              <Select
                placeholder="选择难度"
                className="h-12 rounded-xl"
                suffixIcon={<i className="fas fa-chevron-down text-gray-400"></i>}
              >
                <Option value="简单">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-star text-green-500"></i>
                    <span>简单</span>
                  </div>
                </Option>
                <Option value="中等">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span>中等</span>
                  </div>
                </Option>
                <Option value="困难">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-star text-red-500"></i>
                    <span>困难</span>
                  </div>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label={<span className="text-sm font-bold text-gray-700">时长 (分钟)</span>}
              rules={[{ required: true, message: '请输入时长' }]}
            >
              <InputNumber
                min={1}
                placeholder="输入时长"
                className="w-full h-12 rounded-xl flex items-center"
                controls={{
                  upIcon: <i className="fas fa-chevron-up text-xs"></i>,
                  downIcon: <i className="fas fa-chevron-down text-xs"></i>
                }}
              />
            </Form.Item>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-info text-white text-xs"></i>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">配置说明</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  每个 Section 代表考试的一个独立模块，包含特定数量的题目。请根据实际考试结构配置 Section 名称、科目和时长。
                </p>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
}

export default SectionFormModal;
