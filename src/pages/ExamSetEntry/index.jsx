import React, { useEffect, useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

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
    Spin,
    Steps,
    Tag,
    message
} from 'antd';

import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined
} from '@ant-design/icons';

import {
  getExamSetList,
  checkExamExists,
  checkSectionExists,
  submitExamSet,
  getSectionListByExamId,
  getQuestionListByExamId,
  updateExamSectionAndQuestion
} from '@/services/exam';

import ExamSetBaseInfoForm from './components/ExamSetBaseInfoForm';
import ExamSetQuestionStep from './components/ExamSetQuestionStep';
import ExamSetSectionStep from './components/ExamSetSectionStep';
import ExamSetSummaryModal from './components/ExamSetSummaryModal';
import SectionFormModal from './components/SectionFormModal';
import {
  clearDraft,
  transformExamSetFromList,
  formatSectionListFromApi,
  formatQuestionListFromApi,
  buildExamPoolPayload,
  buildExamSectionsPayload,
  buildQuestionsPayload,
  renderMathInPreview,
  renderMathInContainers
} from './examSetEntryUtils';
import {
  DIFFICULTIES,
  QUESTION_TYPES_MAP,
  FORM_INITIAL_VALUES,
  STEP_ITEMS
} from './examSetEntryConstants';

import './ExamSetEntry.css';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

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
  
  const questionListRef = useRef(null);
  const [examId, setExamId] = useState(null);
  const [examData, setExamData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [stepNextLoading, setStepNextLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sectionSaveLoading, setSectionSaveLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryFormValues, setSummaryFormValues] = useState({});

  const fetchExamSetData = async (id) => {
    setFetchLoading(true);
    try {
      const params = {
        examType: 'SAT',
        pageNum: 1,
        pageSize: 100
      };
      const result = await getExamSetList(params);
      if (result && result.list) {
        const examSet = result.list.find(item => item.examId === parseInt(id, 10));
        return transformExamSetFromList(examSet);
      }
      return null;
    } catch (error) {
      message.error('获取套题数据失败');
      return null;
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    const loadExamData = async () => {
      if (editId) {
        setIsEditMode(true);
        const data = await fetchExamSetData(editId);
        
        if (data) {
          form.setFieldsValue({
            title: data.title,
            year: data.year,
            type: data.type,
            region: data.region,
            difficulty: data.difficulty,
            description: data.description
          });

          setSections(data.sections || []);
          setExamId(data.id);

          const mockQuestions = (data.sections || []).flatMap(section =>
            (section.selectedQuestions || []).map(qId => ({
              id: qId,
              sectionId: section.id,
              sectionName: section.name,
              subject: section.subject,
              interactionType: 'CHOICE',
              type: QUESTION_TYPES_MAP[section.subject] ? QUESTION_TYPES_MAP[section.subject][0] : '未分类',
              difficulty: 'Medium',
              content: `题目 ${qId} 的内容`,
              options: ['选项A', '选项B', '选项C', '选项D'],
              correctAnswer: 'A',
              explanation: '解析内容'
            }))
          );
          setQuestions(mockQuestions);
        }
      }
    };

    loadExamData();
  }, [editId]);

  const handleNext = async () => {
    if (currentStep === 0) {
      setStepNextLoading(true);
      try {
        await form.validateFields(['title', 'year', 'type', 'difficulty', 'region', 'description']);

        const baseInfo = form.getFieldsValue();

        if (isEditMode) {
          const editExamId = parseInt(editId, 10);
          
          const payload = {
            examId: editExamId,
            examName: baseInfo.title,
            examType: baseInfo.type,
            examYear: baseInfo.year.toString(),
            examRegion: baseInfo.region,
            difficulty: baseInfo.difficulty.toUpperCase(), // 转换为大写
            examDescription: baseInfo.description,
            source: baseInfo.source || '官方样题', // 默认值，后续可从表单获取
            status: 0
          };

          const examExists = await checkExamExists(payload);
          if (examExists) {
            message.warning('套题已存在，请检查套题名称、年份、类型、区域、难度或描述是否重复');
            return;
          }
          setExamData(payload);
          setExamId(editExamId);

          try {
            const sectionListData = await getSectionListByExamId(editExamId);
            if (sectionListData && sectionListData.length > 0) {
              setSections(formatSectionListFromApi(sectionListData));
              message.success('Section列表信息已更新');
            }
          } catch (error) {
            message.error('获取Section列表信息失败');
          }

          message.success('套题基础信息更新成功');
        } else {
          // 新增模式：调用检查套题是否存在接口
          // 准备检查套题是否存在接口所需数据
          const examData = {
            examName: baseInfo.title,
            examType: baseInfo.type,
            examYear: baseInfo.year.toString(),
            examRegion: baseInfo.region,
            difficulty: baseInfo.difficulty.toUpperCase(), // 转换为大写
            examDescription: baseInfo.description,
            source: baseInfo.source || '官方样题', // 默认值，后续可从登录信息获取
            creatorId: 1 // 假设当前用户ID为1，后续可从登录信息获取
          };
          
          // 调用检查套题是否存在接口
          const result = await checkExamExists(examData);
          
          // 如果套题不存在，则新增套题
          if (!result) {
            // 暂存套题信息 进行下一步
            setExamData(examData);
          } else {
            // 如果套题已存在，提示用户
            message.warning('套题已存在，请检查套题名称、年份、类型、区域、难度或描述是否重复');
            return;
          }
          
          message.success('套题基础信息保存成功');
        }
        
        setCurrentStep(1);
      } catch (error) {
        message.error('请完善套题基础信息或保存失败');
      } finally {
        setStepNextLoading(false);
      }
    } else if (currentStep === 1) {
      if (sections.length === 0) {
        message.warning('请至少添加一个 Section');
        return;
      }
      if (isEditMode && examId) {
        setStepNextLoading(true);
        try {
          const questionListData = await getQuestionListByExamId(examId);
          if (questionListData && questionListData.length > 0) {
            setQuestions(formatQuestionListFromApi(questionListData, sections));
            message.success('Question列表信息已更新');
          }
        } catch (error) {
          message.error('获取Question列表信息失败');
        } finally {
          setStepNextLoading(false);
        }
      }
      setCurrentStep(2);
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    sectionForm.resetFields();
    // 设置默认难度为Medium
    sectionForm.setFieldsValue({ difficulty: 'Medium' });
    setIsSectionModalVisible(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    sectionForm.setFieldsValue(section);
    setIsSectionModalVisible(true);
  };

  const handleSaveSection = async () => {
    setSectionSaveLoading(true);
    try {
      const values = await sectionForm.validateFields();
      
      if (editingSection) {
        // 编辑模式：只记录最新的section信息，不调用更新接口
        setSections(prev => prev.map(s => 
          s.id === editingSection.id ? { ...s, ...values } : s
        ));
        message.success('Section 已更新');
      } else {
        // 新增模式：调用Section是否存在校验接口
        const sectionData = {
          examId: examId, // 使用之前保存的套题ID
          sectionName: values.name,
          sectionCategory: values.subject,
          sectionDifficulty: values.difficulty,
          sectionTiming: values.duration,
          creatorId: 1, // 假设当前用户ID为1，后续可从登录信息获取
          status: 0
        };
        
        // 调用检查Section是否存在接口
        const result = await checkSectionExists(sectionData);
        
        // 如果Section不存在，则暂存Section信息
        if (!result) {
          // 暂存Section信息存放在Section列表中
          const newSection = {
            id: Date.now() * -1, // 使用当前时间戳的负值作为临时ID
            examId: examId, // 使用之前保存的套题ID
            name: values.name,
            subject: values.subject,
            difficulty: values.difficulty,
            duration: values.duration,
            status: 0
          };
          setSections(prev => [...prev, newSection]);
        } else {
          // 如果Section已存在，提示用户
          message.warning('Section 已存在，请检查Section名称、分类、难度或限时是否重复');
          return;
        }
        message.success('Section 已添加');
      }
      
      setIsSectionModalVisible(false);
    } catch (error) {
      message.error('保存Section失败，请稍后重试');
    } finally {
      setSectionSaveLoading(false);
    }
  };

  const removeSection = (id) => {
    // 设置section的delFlag为1（软删除）
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, delFlag: '1' } : s
    ));
    // 设置该section下所有题目的delFlag为1
    setQuestions(prev => prev.map(q => 
      q.sectionId === id ? { ...q, delFlag: '1' } : q
    ));
  };

  const addQuestion = () => {
    if (sections.length === 0) {
      message.warning('请先在第二步定义 Section 信息');
      return;
    }
    const newId = Date.now() * -1;
    const defaultSection = sections[0];
    const questionTypes = QUESTION_TYPES_MAP[defaultSection.subject] || [];
    const newQuestion = {
      id: newId,
      sectionId: defaultSection.id,
      sectionName: defaultSection.name,
      subject: defaultSection.subject,
      interactionType: 'CHOICE',
      type: questionTypes.length > 0 ? questionTypes[0] : '未分类',
      difficulty: 'Medium',
      content: '',
      description: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      explanation: '',
      status: 0
    };
    
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newId);
    
    // 延迟滚动到最新题目
    setTimeout(() => {
      if (questionListRef.current) {
        questionListRef.current.scrollTop = questionListRef.current.scrollHeight;
      }
    }, 0);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const updated = { ...q, [field]: value };
        if (field === 'sectionId') {
          const targetSection = sections.find(s => s.id === value);
          if (targetSection) {
            updated.subject = targetSection.subject;
            updated.sectionName = targetSection.name;
            const questionTypes = QUESTION_TYPES_MAP[targetSection.subject] || [];
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

  const handleSubmit = async () => {
    const activeQuestionsList = questions.filter(q => q.delFlag !== '1');
    if (activeQuestionsList.length === 0) {
      message.warning('请至少录入一道题目');
      return;
    }

    const unassigned = activeQuestionsList.some(q => !q.sectionId);
    if (unassigned) {
      message.error('存在未分配 Section 的题目，请检查');
      return;
    }

    // Store form values for the summary modal
    setSummaryFormValues(form.getFieldsValue());
    setShowSummaryModal(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitLoading(true);
    try {
      const baseInfo = form.getFieldsValue();
      const examPool = buildExamPoolPayload(baseInfo, isEditMode, editId);
      const examSections = buildExamSectionsPayload(sections, isEditMode, editId);
      const questionsData = buildQuestionsPayload(questions, isEditMode);

      if (isEditMode) {
        await updateExamSectionAndQuestion({
          examPool,
          examSections,
          questions: questionsData
        });
      } else {
        await submitExamSet({
          examPool,
          examSections,
          questions: questionsData
        });
      }

      clearDraft();
      setShowSummaryModal(false);
      message.success(isEditMode ? '套题更新成功！' : '套题录入成功！');
      navigate('/exam-set-management');
    } catch (error) {
      message.error('提交套题失败，请稍后重试');
    } finally {
      setSubmitLoading(false);
    }
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

    // 安全检查：确保currentValue不是undefined
    if (currentValue === undefined || currentValue === null) {
      currentValue = '';
    }

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
        renderMathInPreview(`preview-${targetId}`, 100);
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
    const cleanup = renderMathInContainers();
    return cleanup;
  }, [currentStep, selectedQuestionId, questions]);

  if (fetchLoading && editId) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="加载套题数据中..." />
      </div>
    );
  }

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
              items={STEP_ITEMS}
            />
          </div>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          className="space-y-6"
          initialValues={FORM_INITIAL_VALUES}
        >
          <div className={currentStep === 0 ? 'block' : 'hidden'}>
            <ExamSetBaseInfoForm
              form={form}
              loading={stepNextLoading}
              isEditMode={isEditMode}
              onNext={handleNext}
            />
          </div>

          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <ExamSetSectionStep
              sections={sections}
              loading={stepNextLoading}
              isEditMode={isEditMode}
              onAddSection={handleAddSection}
              onEditSection={handleEditSection}
              onRemoveSection={removeSection}
              onPrev={() => setCurrentStep(0)}
              onNext={handleNext}
            />
          </div>

          <div className={currentStep === 2 ? 'block' : 'hidden'}>
            <ExamSetQuestionStep
              questions={questions}
              sections={sections}
              selectedQuestionId={selectedQuestionId}
              activeEditorId={activeEditorId}
              questionTypesMap={QUESTION_TYPES_MAP}
              difficulties={DIFFICULTIES}
              isEditMode={isEditMode}
              questionListRef={questionListRef}
              onAddQuestion={addQuestion}
              onSelectQuestion={setSelectedQuestionId}
              onUpdateQuestion={updateQuestion}
              onRemoveQuestion={removeQuestion}
              onToolbarAction={handleToolbarAction}
              onRenderMathInPreview={renderMathInPreview}
              onInsertImage={insertImage}
              onPrev={() => setCurrentStep(1)}
              onSubmit={handleSubmit}
            />
          </div>
        </Form>

        <ExamSetSummaryModal
          open={showSummaryModal}
          onCancel={() => setShowSummaryModal(false)}
          onOk={handleConfirmSubmit}
          loading={submitLoading}
          summaryFormValues={summaryFormValues}
          sections={sections}
          questions={questions}
        />

      <SectionFormModal
        open={isSectionModalVisible}
        onCancel={() => setIsSectionModalVisible(false)}
        onOk={handleSaveSection}
        loading={sectionSaveLoading}
        form={sectionForm}
        editingSection={editingSection}
      />
    </div>
  );
}

export default ExamSetEntry;
