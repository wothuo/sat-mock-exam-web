import React, { useEffect, useState } from 'react';

import { Button, Card, Form, Input, message, Radio, Select } from 'antd';

import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

import { uploadToOss } from '@/services/oss';

const { TextArea } = Input;
const { Option } = Select;

function QuestionEditor({ question, onSave, onCancel }) {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [activeEditorId, setActiveEditorId] = useState(null);

  useEffect(() => {
    if (question) {
      form.setFieldsValue(question);
      setQuestionType(question.type || 'multiple-choice');
    } else {
      form.resetFields();
      setQuestionType('multiple-choice');
    }
  }, [question, form]);

  useEffect(() => {
    if (window.renderMathInElement) {
      const containers = document.querySelectorAll('.math-preview');
      containers.forEach(container => {
        container.style.visibility = 'hidden';
      });

      const timer = setTimeout(() => {
        containers.forEach(container => {
          try {
            window.renderMathInElement(container, {
              delimiters: [
                {left: '$', right: '$', display: false},
                {left: '$$', right: '$$', display: true}
              ],
              throwOnError: false,
              strict: false
            });
            container.style.visibility = 'visible';
          } catch (error) {
            console.error('KaTeX rendering error:', error);
            container.style.visibility = 'visible';
          }
        });
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [form.getFieldsValue()]);

  const subjects = ['数学', '阅读', '语法'];
  const difficulties = ['简单', '中等', '困难'];
  const sources = ['历年真题', '官方样题'];

  const questionTypesMap = {
    '数学': ['基础运算','进阶运算','一次函数','二次函数','指数函数','多项式函数','几何','圆','三角形','统计','数据分析',],
    '阅读': ['词汇题', '结构目的题', '双篇题', '主旨细节题', '文本证据题', '图表题', '推断题'],
    '语法': ['标点符号', '句子连接', '动词专项', '名词、代词、形容词', '定语、状语、同位语', '逻辑词', 'notes题']
  };

  const handleSubjectChange = (value) => {
    const types = questionTypesMap[value] || [];
    form.setFieldsValue({ type: types[0] || '' });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存题目:', values);
      message.success('题目保存成功！');
      onSave(values);
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请完善题目信息');
    }
  };

  const formatText = (text) => {
    if (!text) return text;
    
    const mathBlocks = [];
    let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/(?<!\*)(\*)(?!\*)(.+?)(?<!\*)(\*)(?!\*)/g, '<em>$2</em>');
    processed = processed.replace(/(?<!_)(_)(?!_)(.+?)(?<!_)(_)(?!_)/g, '<em>$2</em>');
    processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');
    processed = processed.replace(/\n/g, '<br />');

    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
  };

  const handleToolbarAction = (action, data, targetId) => {
    const textarea = document.getElementById(targetId);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const selectedText = currentValue.substring(start, end);

    let newValue = currentValue;

    switch (action) {
      case 'bold':
        newValue = currentValue.substring(0, start) + `**${selectedText}**` + currentValue.substring(end);
        break;
      case 'italic':
        newValue = currentValue.substring(0, start) + `*${selectedText}*` + currentValue.substring(end);
        break;
      case 'formula':
        newValue = currentValue.substring(0, start) + data + currentValue.substring(end);
        break;
      case 'image':
        const imageMarkdown = `\n![图片](${data})\n`;
        newValue = currentValue.substring(0, start) + imageMarkdown + currentValue.substring(end);
        break;
      case 'table':
        const tableMarkdown = `\n<table class="w-full border-collapse border border-gray-200 mt-0 mb-6 text-sm rounded-xl overflow-hidden">
  <thead>
    <tr class="bg-gray-50">
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">列1</th>
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">列2</th>
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">列3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">数据1</td>
      <td class="border border-gray-200 p-3 text-gray-700">数据2</td>
      <td class="border border-gray-200 p-3 text-gray-700">数据3</td>
    </tr>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">数据4</td>
      <td class="border border-gray-200 p-3 text-gray-700">数据5</td>
      <td class="border border-gray-200 p-3 text-gray-700">数据6</td>
    </tr>
  </tbody>
</table>\n`;
        newValue = currentValue.substring(0, start) + tableMarkdown + currentValue.substring(end);
        break;
      case 'focus':
        setActiveEditorId(targetId);
        return;
      default:
        return;
    }

    const fieldName = targetId.replace('editor-', '');
    form.setFieldsValue({ [fieldName]: newValue });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + (newValue.length - currentValue.length);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          message.loading({ content: '图片上传中...', key: 'oss_upload' });
          const finalUrl = await uploadToOss(file);
          handleToolbarAction('image', finalUrl);
          message.success({ content: '图片上传成功', key: 'oss_upload' });
        } catch (error) {
          console.error('图片上传失败:', error);
          message.error({ content: '图片上传失败，请重试', key: 'oss_upload' });
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-20 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
              <button
                type="button"
                onClick={() => handleToolbarAction('bold', null, activeEditorId)}
                className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
                title="粗体"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('italic', null, activeEditorId)}
                className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
                title="斜体"
              >
                <i className="fas fa-italic"></i>
              </button>
              <div className="w-px h-3 bg-gray-300"></div>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\frac{a}{b}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="分数"
              >
                分数
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\sqrt{x}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="根号"
              >
                根号
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$x^{n}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="幂次"
              >
                幂次
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$x_{n}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="下标"
              >
                下标
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\sum_{i=1}^{n}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="求和"
              >
                求和
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\prod_{i=1}^{n}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="连乘"
              >
                连乘
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\int_{a}^{b}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="积分"
              >
                积分
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\lim_{x \\to a}$', activeEditorId)}
                className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                title="极限"
              >
                极限
              </button>
              <div className="w-px h-3 bg-gray-300"></div>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\alpha$', activeEditorId)}
                className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] transition-colors"
                title="希腊字母α"
              >
                α
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\beta$', activeEditorId)}
                className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] transition-colors"
                title="希腊字母β"
              >
                β
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\theta$', activeEditorId)}
                className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] transition-colors"
                title="希腊字母θ"
              >
                θ
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\pi$', activeEditorId)}
                className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] transition-colors"
                title="圆周率π"
              >
                π
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\Delta$', activeEditorId)}
                className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] transition-colors"
                title="希腊字母Δ"
              >
                Δ
              </button>
              <div className="w-px h-3 bg-gray-300"></div>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\leq$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="小于等于"
              >
                ≤
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\geq$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="大于等于"
              >
                ≥
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\neq$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="不等于"
              >
                ≠
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\approx$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="约等于"
              >
                ≈
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\pm$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="正负号"
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\times$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="乘号"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\div$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="除号"
              >
                ÷
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('formula', '$\\infty$', activeEditorId)}
                className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-[10px] transition-colors"
                title="无穷大"
              >
                ∞
              </button>
              <div className="w-px h-3 bg-gray-300"></div>
              <button
                type="button"
                onClick={insertImage}
                className="px-1.5 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[10px] transition-colors"
                title="插入图片"
              >
                <i className="fas fa-image mr-0.5"></i>插入图片
              </button>
              <button
                type="button"
                onClick={() => handleToolbarAction('table', null, activeEditorId)}
                className="px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] transition-colors"
                title="插入表格"
              >
                <i className="fas fa-table mr-0.5"></i>插入表格
              </button>
            </div>
            <div className="text-xs text-gray-500 ml-4">
              {activeEditorId ? '当前编辑器已激活' : '点击输入框激活编辑器'}
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            subject: '数学',
            type: '基础运算',
            difficulty: 'Medium',
            source: '历年真题',
            questionType: 'multiple-choice'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Form.Item
              name="subject"
              label={<span className="font-bold text-gray-700">科目</span>}
              rules={[{ required: true, message: '请选择科目' }]}
            >
              <Select onChange={handleSubjectChange} className="h-10">
                {subjects.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label={<span className="font-bold text-gray-700">题目类型</span>}
              rules={[{ required: true, message: '请选择题目类型' }]}
            >
              <Select className="h-10">
                {(questionTypesMap[form.getFieldValue('subject')] || []).map(t => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label={<span className="font-bold text-gray-700">难度</span>}
              rules={[{ required: true, message: '请选择难度' }]}
            >
              <Select className="h-10">
                {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item
              name="source"
              label={<span className="font-bold text-gray-700">来源</span>}
              rules={[{ required: true, message: '请选择来源' }]}
            >
              <Select className="h-10">
                {sources.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="questionType"
            label={<span className="font-bold text-gray-700">答题类型</span>}
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={(e) => setQuestionType(e.target.value)}>
              <Radio value="multiple-choice">选择题</Radio>
              <Radio value="student-produced">填空题</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="question"
            label={<span className="font-bold text-gray-700">题目内容</span>}
            rules={[{ required: true, message: '请输入题目内容' }]}
          >
            <TextArea
              id="editor-question"
              rows={4}
              placeholder="输入题目内容，支持 KaTeX 公式..."
              className="rounded-xl font-mono text-sm"
              onFocus={() => handleToolbarAction('focus', null, 'editor-question')}
            />
          </Form.Item>

          {questionType === 'multiple-choice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <Form.Item
                  key={opt}
                  name={`option${opt}`}
                  label={<span className="font-bold text-gray-700">选项 {opt}</span>}
                  rules={[{ required: true, message: `请输入选项${opt}` }]}
                >
                  <TextArea
                    id={`editor-option${opt}`}
                    rows={2}
                    placeholder={`输入选项${opt}内容...`}
                    className="rounded-xl font-mono text-sm"
                    onFocus={() => handleToolbarAction('focus', null, `editor-option${opt}`)}
                  />
                </Form.Item>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Form.Item
              name="correctAnswer"
              label={<span className="font-bold text-gray-700">正确答案</span>}
              rules={[{ required: true, message: '请输入正确答案' }]}
            >
              {questionType === 'multiple-choice' ? (
                <Select className="h-10">
                  {['A', 'B', 'C', 'D'].map(o => <Option key={o} value={o}>{o}</Option>)}
                </Select>
              ) : (
                <Input placeholder="输入正确答案" className="h-10" />
              )}
            </Form.Item>

            <Form.Item
              name="explanation"
              label={<span className="font-bold text-gray-700">答案解析</span>}
              className="md:col-span-3"
            >
              <TextArea
                id="editor-explanation"
                rows={3}
                placeholder="输入答案解析..."
                className="rounded-xl font-mono text-sm"
                onFocus={() => handleToolbarAction('focus', null, 'editor-explanation')}
              />
            </Form.Item>
          </div>
        </Form>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={onCancel}
            className="h-12 px-8 rounded-xl"
          >
            取消
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            className="h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 border-0"
          >
            保存题目
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default QuestionEditor;

