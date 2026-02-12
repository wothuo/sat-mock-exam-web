import React, { useEffect } from 'react';

import { Form, Input, Modal, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

function ExamSetEditor({ visible, examSet, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (examSet) {
        form.setFieldsValue(examSet);
      } else {
        form.resetFields();
      }
    }
  }, [visible, examSet, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={examSet ? '编辑套题' : '新增套题'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          subject: '数学',
          source: '历年真题',
          difficulty: 'Medium',
          sections: []
        }}
      >
        <Form.Item
          name="title"
          label="套题名称"
          rules={[{ required: true, message: '请输入套题名称' }]}
        >
          <Input placeholder="例如：2025年12月北美第4套" />
        </Form.Item>

        <Form.Item
          name="subject"
          label="科目"
          rules={[{ required: true, message: '请选择科目' }]}
        >
          <Select>
            <Option value="数学">数学</Option>
            <Option value="阅读">阅读</Option>
            <Option value="语法">语法</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="source"
          label="来源"
          rules={[{ required: true, message: '请选择来源' }]}
        >
          <Select>
            <Option value="历年真题">历年真题</Option>
            <Option value="官方样题">官方样题</Option>
            <Option value="Question Bank考题">Question Bank考题</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="难度"
          rules={[{ required: true, message: '请选择难度' }]}
        >
          <Select>
            <Option value="Easy">Easy</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Hard">Hard</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="套题描述"
          rules={[{ required: true, message: '请输入套题描述' }]}
        >
          <TextArea
            rows={3}
            placeholder="简要描述套题的内容和特点"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ExamSetEditor;
