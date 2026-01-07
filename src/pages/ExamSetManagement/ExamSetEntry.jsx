import {
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Collapse,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Steps,
    Tag,
    message
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RichTextEditor from './components/RichTextEditor';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const DRAFT_STORAGE_KEY = 'exam_set_draft';
const DRAFT_EXPIRY_DAYS = 90;

function ExamSetEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditorId, setActiveEditorId] = useState(null);

  const [isSectionModalVisible, setIsSectionModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm] = Form.useForm();
  
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimerRef = useRef(null);
  const [draftChecked, setDraftChecked] = useState(false);

  const fetchExamSetData = (id) => {
    const mockExamSets = [
      {
        id: 1,
        title: '2025年12月北美第4套',
        year: 2025,
        type: 'SAT',
        region: '北美',
        difficulty: 'Medium',
        description: '包含代数、几何、数据分析等综合题型',
        sections: [
          {
            id: 's1',
            name: 'Section 1, Module 1: Math',
            subject: '数学',
            duration: 35,
            questions: 22,
            description: '不可使用计算器',
            selectedQuestions: [1, 3, 8, 9, 11, 12, 13, 16, 19, 22, 33, 36]
          },
          {
            id: 's2',
            name: 'Section 1, Module 2: Math',
            subject: '数学',
            duration: 35,
            questions: 22,
            description: '可使用计算器',
            selectedQuestions: [24, 28, 31, 39, 42, 45, 48, 51]
          }
        ]
      },
      {
        id: 2,
        title: '2025年12月北美第3套',
        year: 2025,
        type: 'SAT',
        region: '北美',
        difficulty: 'Hard',
        description: '文学、历史、科学类文章阅读理解',
        sections: [
          {
            id: 's1',
            name: 'Section 1, Module 1: Reading and Writing',
            subject: '阅读',
            duration: 32,
            questions: 27,
            description: '文学、历史类文章',
            selectedQuestions: [2, 5, 7, 10, 14, 17, 20, 23, 25, 29, 32, 34]
          },
          {
            id: 's2',
            name: 'Section 1, Module 2: Reading and Writing',
            subject: '阅读',
            duration: 33,
            questions: 25,
            description: '科学、社会科学类文章',
            selectedQuestions: [37, 40, 43, 46, 49, 52, 4, 6, 15, 18]
          }
        ]
      }
    ];

    return mockExamSets.find(exam => exam.id === parseInt(id));
  };

  const loadDraft = () => {
    try {
      const draftStr = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!draftStr) return null;
      
      const draft = JSON.parse(draftStr);
      const now = new Date().getTime();
      const expiryTime = new Date(draft.savedAt).getTime() + (DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      
      if (now > expiryTime) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return null;
      }
      
      return draft;
    } catch (error) {
      console.error('加载草稿失败:', error);
      return null;
    }
  };

  const saveDraft = () => {
    try {
      const baseInfo = form.getFieldsValue();
      const draft = {
        baseInfo,
        sections,
        questions,
        currentStep,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setLastSaveTime(new Date());
      message.success('草稿已保存');
    } catch (error) {
      console.error('保存草稿失败:', error);
      message.error('草稿保存失败');
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setLastSaveTime(null);
    } catch (error) {
      console.error('清除草稿失败:', error);
    }
  };

  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      const examData = fetchExamSetData(editId);
      
      if (examData) {
        form.setFieldsValue({
          title: examData.title,
          year: examData.year,
          type: examData.type,
          region: examData.region,
          difficulty: examData.difficulty,
          description: examData.description
        });

        setSections(examData.sections || []);

        const mockQuestions = examData.sections.flatMap(section => 
          section.selectedQuestions.map(qId => ({
            id: qId,
            sectionId: section.id,
            subject: section.subject,
            interactionType: 'CHOICE',
            type: questionTypesMap[section.subject][0],
            difficulty: 'Medium',
            content: `题目 ${qId} 的内容`,
            options: ['选项A', '选项B', '选项C', '选项D'],
            correctAnswer: 'A',
            explanation: '解析内容'
          }))
        );
        setQuestions(mockQuestions);
      }
    } else if (!draftChecked) {
      setDraftChecked(true);
      const draft = loadDraft();
      if (draft) {
        Modal.confirm({
          title: '发现未完成的草稿',
          content: `上次保存时间：${new Date(draft.savedAt).toLocaleString()}，是否恢复？`,
          okText: '恢复草稿',
          cancelText: '放弃草稿',
          onOk: () => {
            form.setFieldsValue(draft.baseInfo);
            setSections(draft.sections || []);
            setQuestions(draft.questions || []);
            setCurrentStep(draft.currentStep || 0);
            setLastSaveTime(new Date(draft.savedAt));
            message.success('草稿已恢复');
          },
          onCancel: () => {
            clearDraft();
          }
        });
      }
    }
  }, [editId, draftChecked]);

  useEffect(() => {
    if (!isEditMode && autoSaveEnabled) {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setInterval(() => {
        const baseInfo = form.getFieldsValue();
        if (baseInfo.title || sections.length > 0 || questions.length > 0) {
          saveDraft();
        }
      }, 30000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [isEditMode, autoSaveEnabled, sections, questions]);

  const subjects = ['数学', '阅读', '语法'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const regions = ['北美', '亚太', '欧洲', '其他'];
  const examTypes = ['SAT', 'IELTS', 'TOEFL', 'GRE'];
  const years = [2025, 2024, 2023, 2022, 2021];

  const questionTypesMap = {
    '阅读语法': ['词汇题', '结构目的题', '主旨细节题', '推断题', '标点符号', '句子连接', '逻辑词'],
    '数学': ['一次函数', '二次函数', '几何', '统计']
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields(['title', 'year', 'type', 'difficulty', 'region', 'description']);
        setCurrentStep(1);
      } catch (error) {
        message.error('请完善套题基础信息');
      }
    } else if (currentStep === 1) {
      if (sections.length === 0) {
        message.warning('请至少添加一个 Section');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    sectionForm.resetFields();
    setIsSectionModalVisible(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    sectionForm.setFieldsValue(section);
    setIsSectionModalVisible(true);
  };

  const handleSaveSection = async () => {
    try {
      const values = await sectionForm.validateFields();
      if (editingSection) {
        setSections(prev => prev.map(s => s.id === editingSection.id ? { ...s, ...values } : s));
        message.success('Section 已更新');
      } else {
        const newSection = { ...values, id: `s${Date.now()}`, selectedQuestions: [] };
        setSections(prev => [...prev, newSection]);
        message.success('Section 已添加');
      }
      setIsSectionModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setQuestions(prev => prev.filter(q => q.sectionId !== id));
  };

  const addQuestion = () => {
    if (sections.length === 0) {
      message.warning('请先在第二步定义 Section 信息');
      return;
    }
    const newId = Date.now();
    const defaultSection = sections[0];
    const questionTypes = questionTypesMap[defaultSection.subject] || [];
    const newQuestion = {
      id: newId,
      sectionId: defaultSection.id,
      subject: defaultSection.subject,
      interactionType: 'CHOICE',
      type: questionTypes.length > 0 ? questionTypes[0] : '未分类',
      difficulty: 'Medium',
      content: '已录入',
      description: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      explanation: '',
      status: '已录入'
    };
    
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newId);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const updated = { ...q, [field]: value };
        if (field === 'sectionId') {
          const targetSection = sections.find(s => s.id === value);
          if (targetSection) {
            updated.subject = targetSection.subject;
            const questionTypes = questionTypesMap[targetSection.subject] || [];
            updated.type = questionTypes.length > 0 ? questionTypes[0] : '未分类';
          }
        }
        return updated;
      }
      return q;
    }));
  };

  const removeQuestion = (id) => {
    setQuestions(prev => {
      const newQuestions = prev.filter(q => q.id !== id);
      if (selectedQuestionId === id && newQuestions.length > 0) {
        setSelectedQuestionId(newQuestions[0].id);
      } else if (newQuestions.length === 0) {
        setSelectedQuestionId(null);
      }
      return newQuestions;
    });
  };

  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const handleSubmit = async () => {
    if (questions.length === 0) {
      message.warning('请至少录入一道题目');
      return;
    }

    const unassigned = questions.some(q => !q.sectionId);
    if (unassigned) {
      message.error('存在未分配 Section 的题目，请检查');
      return;
    }

    setShowSummaryModal(true);
  };

  const handleConfirmSubmit = () => {
    const baseInfo = form.getFieldsValue();
    const finalData = {
      id: editId ? parseInt(editId) : Date.now(),
      ...baseInfo,
      sections: sections.map(s => ({
        ...s,
        selectedQuestions: questions.filter(q => q.sectionId === s.id).map(q => q.id)
      })),
      totalQuestions: questions.length,
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log(isEditMode ? '更新套题数据:' : '提交完整套题数据:', finalData);
    
    clearDraft();
    setShowSummaryModal(false);
    
    message.success(isEditMode ? '套题更新成功！' : '套题录入成功！');
    navigate('/exam-set-management');
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

  const renderMathInPreview = (previewId) => {
    setTimeout(() => {
      const previewElement = document.getElementById(previewId);
      if (previewElement && window.renderMathInElement) {
        window.renderMathInElement(previewElement, {
          delimiters: [
            {left: '$', right: '$', display: false},
            {left: '$$', right: '$$', display: true}
          ],
          throwOnError: false
        });
      }
    }, 50);
  };

  const handleToolbarAction = (action, data, targetId) => {
    const textarea = document.getElementById(targetId);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const questionIndex = questions.findIndex(q => q.id === selectedQuestionId);
    if (questionIndex === -1) return;
    
    const question = questions[questionIndex];
    let fieldName = '';
    let currentValue = '';
    
    if (targetId.includes('question-content')) {
      fieldName = 'content';
      currentValue = question.content;
    } else if (targetId.includes('question-description')) {
      fieldName = 'description';
      currentValue = question.description || '';
    } else if (targetId.includes('option-')) {
      const optionMatch = targetId.match(/option-([A-D])/);
      if (optionMatch) {
        const optionIndex = optionMatch[1].charCodeAt(0) - 65;
        fieldName = 'options';
        currentValue = question.options[optionIndex];
      }
    } else if (targetId.includes('explanation')) {
      fieldName = 'explanation';
      currentValue = question.explanation;
    }

    if (!fieldName) return;

    let newValue = currentValue;
    const selectedText = currentValue.substring(start, end);

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

    if (fieldName === 'options') {
      const optionMatch = targetId.match(/option-([A-D])/);
      if (optionMatch) {
        const optionIndex = optionMatch[1].charCodeAt(0) - 65;
        const newOptions = [...question.options];
        newOptions[optionIndex] = newValue;
        updateQuestion(selectedQuestionId, 'options', newOptions);
      }
    } else {
      updateQuestion(selectedQuestionId, fieldName, newValue);
    }

    setTimeout(() => {
      if (targetId.includes('content') || targetId.includes('description') || targetId.includes('option') || targetId.includes('explanation')) {
        renderMathInPreview(`preview-${targetId}`);
      }
    }, 100);
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleToolbarAction('image', event.target.result, activeEditorId);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  useEffect(() => {
    if (window.renderMathInElement) {
      const containers = document.querySelectorAll('.selectable-text, .math-content');
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
  }, [currentStep, selectedQuestionId, questions]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-gray-900 m-0">
            {isEditMode ? '编辑套题' : '录入新套题'}
          </h1>
          <div className="flex items-center space-x-4">
            <Steps 
              current={currentStep} 
              className="max-w-2xl"
              items={[
                { title: '基础信息' },
                { title: 'Section信息' },
                { title: '题目内容' }
              ]}
            />
          </div>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          className="space-y-6"
          initialValues={{
            type: 'SAT',
            region: '北美',
            difficulty: 'Hard',
            year: 2025
          }}
        >
          <div className={currentStep === 0 ? 'block' : 'hidden'}>
            <Card className="rounded-3xl shadow-sm border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <Form.Item
                  name="title"
                  label={<span className="font-bold text-gray-700">套题名称</span>}
                  rules={[{ required: true, message: '请输入套题名称' }]}
                >
                  <Input placeholder="例如：2025年3月北美SAT真题" className="h-11 rounded-xl" />
                </Form.Item>

                <Form.Item
                  name="year"
                  label={<span className="font-bold text-gray-700">套题年份</span>}
                  rules={[{ required: true, message: '请选择年份' }]}
                >
                  <Select placeholder="选择年份" className="h-11 rounded-xl">
                    {years.map(y => <Option key={y} value={y}>{y} 年</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="type"
                  label={<span className="font-bold text-gray-700">考试类型</span>}
                  rules={[{ required: true, message: '请选择考试类型' }]}
                >
                  <Select placeholder="选择类型" className="h-11 rounded-xl">
                    {examTypes.map(t => (
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
                    {regions.map(r => <Option key={r} value={r}>{r}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="difficulty"
                  label={<span className="font-bold text-gray-700">整体难度</span>}
                  rules={[{ required: true, message: '请选择难度' }]}
                >
                  <Select placeholder="选择难度" className="h-11 rounded-xl">
                    {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<span className="font-bold text-gray-700">套题描述</span>}
                  rules={[{ required: true, message: '请输入套题描述' }]}
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
                {!isEditMode && (
                  <Button 
                    icon={<SaveOutlined />}
                    size="large" 
                    onClick={saveDraft}
                    className="h-12 px-8 rounded-xl"
                  >
                    保存草稿
                  </Button>
                )}
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleNext}
                  className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 border-0 font-bold ml-auto"
                >
                  下一步：{isEditMode ? '修改' : '配置'} Section 信息
                </Button>
              </div>
            </Card>
          </div>

          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 m-0">Section 结构规划</h2>
                  <p className="text-sm text-gray-500 m-0">定义套题的模块组成（如 Module 1, Module 2）</p>
                </div>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddSection}
                  className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-bold"
                >
                  添加 Section
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => (
                  <Card 
                    key={section.id}
                    className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    title={
                      <div className="flex items-center justify-between">
                        <Space>
                          <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-bold text-gray-700">{section.name}</span>
                        </Space>
                        <Space>
                          <Tag color="purple" className="m-0 rounded-md border-0 font-bold text-[10px]">{section.subject}</Tag>
                          <Button type="text" size="small" icon={<EditOutlined className="text-blue-500" />} onClick={() => handleEditSection(section)} />
                          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => removeSection(section.id)} />
                        </Space>
                      </div>
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Duration</div>
                        <div className="font-bold text-gray-700">{section.duration} min</div>
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
                <Button size="large" onClick={() => setCurrentStep(0)} className="h-12 px-8 rounded-xl">
                  上一步
                </Button>
                <Space>
                  {!isEditMode && (
                    <Button 
                      icon={<SaveOutlined />}
                      size="large" 
                      onClick={saveDraft}
                      className="h-12 px-8 rounded-xl"
                    >
                      保存草稿
                    </Button>
                  )}
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={handleNext}
                    className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 border-0 font-bold"
                  >
                    下一步：{isEditMode ? '修改' : '录入'}题目内容
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          <div className={currentStep === 2 ? 'block' : 'hidden'}>
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
                    onClick={() => handleToolbarAction('formula', '$\\frac{numerator}{denominator}$', activeEditorId)}
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
                    onClick={() => handleToolbarAction('formula', '$\\sum_{i=1}^{n}$', activeEditorId)}
                    className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                    title="求和"
                  >
                    求和
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToolbarAction('formula', '$\\int_{lower}^{upper}$', activeEditorId)}
                    className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                    title="积分"
                  >
                    积分
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToolbarAction('formula', '$\\lim_{x \\to \\infty}$', activeEditorId)}
                    className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
                    title="极限"
                  >
                    极限
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

            <div className="flex flex-col md:flex-row gap-6 h-[800px]">
              <div className="w-full md:w-72 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                  <span className="font-bold text-gray-900">题目索引 ({questions.length})</span>
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<PlusOutlined />} 
                    onClick={addQuestion}
                    className="rounded-lg bg-blue-600 border-0 font-bold"
                  >
                    添加
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {questions.map((q, index) => (
                    <div 
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedQuestionId === q.id 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            selectedQuestionId === q.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {index + 1}
                          </span>
                          <Tag color={q.interactionType === 'CHOICE' ? 'blue' : 'green'} className="m-0 border-0 text-[9px] font-bold px-1.5 leading-3">
                            {q.interactionType === 'CHOICE' ? 'CHOICE' : 'BLANK'}
                          </Tag>
                        </div>
                        <Tag color="purple" className="m-0 border-0 text-[9px] font-bold px-1 leading-3">
                          {sections.find(s => s.id === q.sectionId)?.name.split(':')[0] || '未分配'}
                        </Tag>
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium leading-tight">
                        {q.status || '已录入'}
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="py-20 text-center">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {selectedQuestionId ? (
                  <>
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                      <Space size="middle">
                        <span className="font-black text-gray-500 uppercase tracking-widest text-sm">Editing Question</span>
                        <Tag color="purple" className="font-bold border-0 text-sm px-3 py-1">{questions.find(q => q.id === selectedQuestionId)?.subject}</Tag>
                      </Space>
                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />} 
                        onClick={() => removeQuestion(selectedQuestionId)}
                        className="text-xs"
                      >
                        删除
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                      {questions.filter(q => q.id === selectedQuestionId).map(q => (
                        <div key={q.id} className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">题目类型</label>
                              <Select 
                                value={q.interactionType} 
                                onChange={v => {
                                  updateQuestion(q.id, 'interactionType', v);
                                  updateQuestion(q.id, 'correctAnswer', v === 'CHOICE' ? 'A' : '');
                                }}
                                className="w-full h-10 rounded-lg text-sm"
                              >
                                <Option value="CHOICE">选择题</Option>
                                <Option value="BLANK">填空题</Option>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">所属 Section</label>
                              <Select 
                                value={q.sectionId} 
                                onChange={v => updateQuestion(q.id, 'sectionId', v)}
                                className="w-full h-10 rounded-lg text-sm"
                              >
                                {sections.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                              </Select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">知识点</label>
                              <Select 
                                value={q.type} 
                                onChange={v => updateQuestion(q.id, 'type', v)}
                                className="w-full h-10 rounded-lg text-sm"
                              >
                                {(questionTypesMap[q.subject] || []).map(t => <Option key={t} value={t}>{t}</Option>)}
                              </Select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">难度</label>
                              <Select 
                                value={q.difficulty} 
                                onChange={v => updateQuestion(q.id, 'difficulty', v)}
                                className="w-full h-10 rounded-lg text-sm"
                              >
                                {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-600 uppercase mb-2">题目内容</label>
                            <RichTextEditor
                              id={`question-content-${q.id}`}
                              value={q.content}
                              onChange={(value) => updateQuestion(q.id, 'content', value)}
                              placeholder={q.interactionType === 'BLANK' ? "输入题目正文，填空处可用 _____ 表示...\n支持：**粗体**、*斜体*、$公式$" : "输入题目正文，支持 KaTeX 公式...\n支持：**粗体**、*斜体*、$公式$、图片上传"}
                              onRenderMath={() => renderMathInPreview(`preview-question-content-${q.id}`)}
                              showToolbar={false}
                              onToolbarAction={handleToolbarAction}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-600 uppercase mb-2">问题描述</label>
                            <RichTextEditor
                              id={`question-description-${q.id}`}
                              value={q.description || ''}
                              onChange={(value) => updateQuestion(q.id, 'description', value)}
                              placeholder="输入问题描述...\n支持：**粗体**、*斜体*、$公式$、图片上传"
                              showPreview={true}
                              onRenderMath={() => renderMathInPreview(`preview-question-description-${q.id}`)}
                              showToolbar={false}
                              onToolbarAction={handleToolbarAction}
                            />
                          </div>

                          {q.interactionType === 'CHOICE' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {['A', 'B', 'C', 'D'].map((opt, idx) => (
                            <div key={opt}>
                              <label className="block text-sm font-bold text-gray-600 uppercase mb-2">选项 {opt}</label>
                              <RichTextEditor
                                id={`option-${opt}-${q.id}`}
                                value={q.options[idx]}
                                onChange={(value) => {
                                  const newOpts = [...q.options];
                                  newOpts[idx] = value;
                                  updateQuestion(q.id, 'options', newOpts);
                                }}
                                placeholder={`输入选项${opt}内容...`}
                                showPreview={true}
                                onRenderMath={() => renderMathInPreview(`preview-option-${opt}-${q.id}`)}
                                showToolbar={false}
                                onToolbarAction={handleToolbarAction}
                              />
                            </div>
                          ))}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                              <label className="block text-sm font-bold text-gray-600 uppercase mb-2">正确答案</label>
                              {q.interactionType === 'CHOICE' ? (
                                <Select 
                                  value={q.correctAnswer} 
                                  onChange={v => updateQuestion(q.id, 'correctAnswer', v)}
                                  className="w-full h-10 rounded-lg text-sm"
                                >
                                  {['A', 'B', 'C', 'D'].map(o => <Option key={o} value={o}>{o}</Option>)}
                                </Select>
                              ) : (
                                <Input 
                                  value={q.correctAnswer}
                                  onChange={e => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                                  placeholder="输入正确答案"
                                  className="h-10 rounded-lg text-sm"
                                />
                              )}
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-sm font-bold text-gray-600 uppercase mb-2">解析</label>
                              <RichTextEditor
                                id={`explanation-${q.id}`}
                                value={q.explanation}
                                onChange={(value) => updateQuestion(q.id, 'explanation', value)}
                                placeholder="输入答案解析..."
                                showPreview={true}
                                onRenderMath={() => renderMathInPreview(`preview-explanation-${q.id}`)}
                                showToolbar={false}
                                onToolbarAction={handleToolbarAction}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Empty description="请在左侧选择题目或点击添加按钮" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <Button 
                size="large" 
                onClick={() => setCurrentStep(1)}
                className="h-12 px-8 rounded-xl"
              >
                上一步：修改 Section 信息
              </Button>
              <Space>
                {!isEditMode && (
                  <Button 
                    icon={<SaveOutlined />}
                    size="large" 
                    onClick={saveDraft}
                    className="h-12 px-8 rounded-xl"
                  >
                    保存草稿
                  </Button>
                )}
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<CheckCircleOutlined />}
                  onClick={handleSubmit}
                  className="h-12 px-12 rounded-xl bg-green-600 hover:bg-green-700 border-0 font-bold shadow-lg shadow-green-500/20"
                >
                  {isEditMode ? '保存修改' : '提交并完成录入'}
                </Button>
              </Space>
            </div>
          </div>
        </Form>

        <Modal
        title={
          <div className="flex items-center space-x-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-clipboard-check text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 m-0">Section 题目汇总</h3>
              <p className="text-xs text-gray-500 m-0 font-normal">请仔细核对各 Section 的题目分布</p>
            </div>
          </div>
        }
        open={showSummaryModal}
        onOk={handleConfirmSubmit}
        onCancel={() => setShowSummaryModal(false)}
        okText="确认提交"
        cancelText="返回修改"
        width={900}
        className="summary-modal"
        okButtonProps={{
          className: 'h-11 px-8 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 font-bold shadow-lg'
        }}
        cancelButtonProps={{
          className: 'h-11 px-8 rounded-xl font-bold'
        }}
      >
        <div className="py-6">
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-info-circle text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">套题基本信息</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">套题名称</div>
                  <div className="text-base font-bold text-gray-900 truncate">{form.getFieldValue('title')}</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">考试类型</div>
                  <div className="text-base font-bold text-gray-900">{form.getFieldValue('type')}</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">总题目数</div>
                  <div className="text-2xl font-black text-red-600">{questions.length} <span className="text-sm font-bold text-gray-400">题</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-layer-group text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 m-0">各 Section 题目分布</h3>
            </div>
            
            {sections.map((section, index) => {
              const sectionQuestions = questions.filter(q => q.sectionId === section.id);

              return (
                <div key={section.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl flex items-center justify-center text-lg font-black shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-base mb-1">{section.name}</h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <i className="fas fa-book mr-1"></i>
                            {section.subject}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center">
                            <i className="fas fa-clock mr-1"></i>
                            {section.duration} 分钟
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-blue-600">{sectionQuestions.length}</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">题目</div>
                    </div>
                  </div>

                  {sectionQuestions.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <i className="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                      <p className="text-sm text-gray-400 font-medium">该 Section 暂无题目</p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-900">
                          <i className="fas fa-check-circle mr-2"></i>
                          已录入 {sectionQuestions.length} 道题目
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          占比 {Math.round((sectionQuestions.length / questions.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-exclamation-triangle text-white text-sm"></i>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">提交前请确认</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  请仔细核对各 Section 的题目数量和分布情况，确认无误后点击「确认提交」完成录入。提交后将无法修改，如需调整请点击「返回修改」。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
        open={isSectionModalVisible}
        onOk={handleSaveSection}
        onCancel={() => setIsSectionModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
        className="section-modal"
        okButtonProps={{
          className: 'h-11 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 font-bold shadow-lg'
        }}
        cancelButtonProps={{
          className: 'h-11 px-8 rounded-xl font-bold'
        }}
      >
        <Form form={sectionForm} layout="vertical" className="pt-6">
          <Form.Item 
            name="name" 
            label={<span className="text-sm font-bold text-gray-700">Section 名称</span>}
            rules={[{ required: true, message: '请选择 Section' }]}
          >
            <Select 
              placeholder="选择 Section" 
              className="h-12 rounded-xl"
              suffixIcon={<i className="fas fa-chevron-down text-gray-400"></i>}
            >
              <Option value="Section 1, Module 1:Reading and Writing">
                <div className="flex items-center space-x-2 py-1">
                  <i className="fas fa-book text-purple-500"></i>
                  <span>Section 1, Module 1: Reading and Writing</span>
                </div>
              </Option>
              <Option value="Section 1, Module 2:Reading and Writing">
                <div className="flex items-center space-x-2 py-1">
                  <i className="fas fa-book text-purple-500"></i>
                  <span>Section 1, Module 2: Reading and Writing</span>
                </div>
              </Option>
              <Option value="Section 2, Module 1:Math">
                <div className="flex items-center space-x-2 py-1">
                  <i className="fas fa-calculator text-blue-500"></i>
                  <span>Section 2, Module 1: Math</span>
                </div>
              </Option>
              <Option value="Section 2, Module 2:Math">
                <div className="flex items-center space-x-2 py-1">
                  <i className="fas fa-calculator text-blue-500"></i>
                  <span>Section 2, Module 2: Math</span>
                </div>
              </Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
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
      </Modal>

      <style jsx global>{`
        .ant-collapse-header {
          padding: 20px 24px !important;
          align-items: center !important;
        }
        .ant-collapse-content-box {
          padding: 0 24px 24px !important;
        }
        .ant-steps-item-title {
          font-weight: 800 !important;
        }
      `}</style>
    </div>
  );
}

export default ExamSetEntry;

