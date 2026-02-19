import React from 'react';

import { Button, Card, Form, Input, Select } from 'antd';

import { SOURCE_ENUM, SOURCE_OPTIONS } from '../examSetEntryConstants';

const { Option } = Select;
const { TextArea } = Input;

const DIFFICULTIES = ['简单', '中等', '困难'];
const REGIONS = ['亚洲-中国北京', '亚洲-中国深圳', '亚洲-中国香港', '亚洲-新加坡', '美洲-美国', '美洲-加拿大', '欧洲-英国', '大洋洲-澳大利亚', '非洲与中东-阿联酋'];
const EXAM_TYPES = ['SAT', 'IELTS', 'TOEFL', 'GRE'];
const YEARS = [2026, 2025, 2024, 2023];

/**
 * 套题录入 - 基础信息表单（步骤 0）
 * 表单由父组件 Form 提供，本组件仅负责展示与「下一步」触发，校验与后续逻辑在父组件 onNext 中处理
 */
function ExamSetBaseInfoForm({ form, loading, isEditMode, onNext }) {

  return (
    <Card className="rounded-3xl shadow-sm border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <Form.Item
          name="title"
          label={<span className="font-bold text-gray-700">套题名称</span>}
          rules={[{ required: true, message: '请输入套题名称' }]}
        >
          <Input placeholder="例如：2026年3月亚洲-中国北京SAT真题" className="h-11 rounded-xl" />
        </Form.Item>

        <Form.Item
          name="year"
          label={<span className="font-bold text-gray-700">套题年份</span>}
          rules={[{ required: true, message: '请选择年份' }]}
        >
          <Select placeholder="选择年份" className="h-11 rounded-xl">
            {YEARS.map(y => (
              <Option key={y} value={y}>{y} 年</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="font-bold text-gray-700">考试类型</span>}
          rules={[{ required: true, message: '请选择考试类型' }]}
        >
          <Select placeholder="选择类型" className="h-11 rounded-xl">
            {EXAM_TYPES.map(t => (
              <Option key={t} value={t} disabled={t !== 'SAT'}>
                {t}{t !== 'SAT' ? ' (暂不支持)' : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="region"
          label={<span className="font-bold text-gray-700">考试地区</span>}
          rules={[{ required: true, message: '请选择地区' }]}
        >
          <Select placeholder="选择地区" className="h-11 rounded-xl">
            {REGIONS.map(r => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="difficulty"
          label={<span className="font-bold text-gray-700">整体难度</span>}
          rules={[{ required: true, message: '请选择难度' }]}
        >
          <Select placeholder="选择难度" className="h-11 rounded-xl">
            {DIFFICULTIES.map(d => (
              <Option key={d} value={d}>{d}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="source"
          label={<span className="font-bold text-gray-700">套题来源</span>}
          rules={[{ required: true, message: '请选择套题来源' }]}
        >
          <Select placeholder="选择套题来源" className="h-11 rounded-xl">
            {SOURCE_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value} disabled={opt.value !== SOURCE_ENUM.PAST_YEAR}>
                {opt.label}{opt.value !== SOURCE_ENUM.PAST_YEAR ? ' (暂不支持)' : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-bold text-gray-700">套题描述</span>}
          className="md:col-span-2"
        >
          <TextArea
            placeholder="简要描述该套题的内容和特点，例如：包含代数、几何、数据分析等综合题型"
            rows={3}
            className="rounded-xl"
          />
        </Form.Item>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={onNext}
          className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 border-0 font-bold ml-auto"
        >
          下一步：{isEditMode ? '修改' : '配置'} Section 信息
        </Button>
      </div>
    </Card>
  );
}

export default ExamSetBaseInfoForm;