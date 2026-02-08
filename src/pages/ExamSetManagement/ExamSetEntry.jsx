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
    CheckCircleOutlined,
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

import RichTextEditor from './components/RichTextEditor';
import ExamSetBaseInfoForm from './components/ExamSetBaseInfoForm';
import ExamSetSectionStep from './components/ExamSetSectionStep';
import { parseQuestionOptions, getQuestionOptionsForSubmit } from './examSetEntryUtils';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const DRAFT_STORAGE_KEY = 'exam_set_draft';

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

  const fetchExamSetData = async (id) => {
    setFetchLoading(true);
    try {
      // 这里需要根据实际后端接口进行修改，当前假设从getExamSetList中过滤出单个套题
      // 实际项目中应该有专门的获取单个套题详情的接口
      const params = {
        examType: 'SAT',
        pageNum: 1,
        pageSize: 100 // 足够大的数量以确保能获取到所有套题
      };

      const result = await getExamSetList(params);

      if (result && result.list) {
        const examSet = result.list.find(item => item.examId === parseInt(id, 10));

        if (examSet) {
          return {
            id: examSet.examId,
            title: examSet.examName,
            year: examSet.examYear,
            type: examSet.examType,
            region: examSet.examRegion,
            difficulty: examSet.difficulty || 'Medium',
            description: examSet.examDescription || '', // 使用正确的字段名examDescription
            sections: examSet.sections || [],
            // 其他需要的字段...
          };
        }
      }
      
      return null;
    } catch (error) {
      message.error('获取套题数据失败');
      return null;
    } finally {
      setFetchLoading(false);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // 静默失败
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
              type: questionTypesMap[section.subject] ? questionTypesMap[section.subject][0] : '未分类',
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

  const subjects = ['数学', '阅读', '语法'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const questionTypesMap = {
    '阅读语法': ['词汇题', '结构目的题', '主旨细节题', '推断题', '标点符号', '句子连接', '逻辑词'],
    '数学': ['一次函数', '二次函数', '几何', '统计']
  };

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
                // 转换数据格式以匹配前端需求
                const formattedSections = sectionListData.map(section => ({
                  id: section.sectionId,
                  name: section.sectionName,
                  subject: section.sectionCategory,
                  difficulty: section.sectionDifficulty,
                  duration: section.sectionTiming,
                  status: section.status
                }));
                setSections(formattedSections);
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
            const formattedQuestions = questionListData.map(item => {
              const { question, sectionName } = item;
              const optionsArray = parseQuestionOptions(question.options);
              return {
                id: question.questionId,
                sectionId: question.sectionId,
                sectionName,
                questionCategory: question.questionCategory,
                questionSubCategory: question.questionSubCategory,
                difficulty: question.difficulty,
                type: question.questionType,
                interactionType: question.questionType,
                content: question.questionContent,
                description: question.questionDescription,
                options: optionsArray,
                answer: question.answer,
                correctAnswer: question.answer || '',
                explanation: question.analysis || '',
                score: question.score,
                status: question.status,
                delFlag: question.delFlag,
                creatorId: question.creatorId,
                createTime: question.createTime,
                updateTime: question.updateTime
              };
            });
            setQuestions(formattedQuestions);
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
    const questionTypes = questionTypesMap[defaultSection.subject] || [];
    const newQuestion = {
      id: newId,
      sectionId: defaultSection.id,
      sectionName: defaultSection.name,
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
  const [summaryFormValues, setSummaryFormValues] = useState({});

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
    let examPool, examSections, questionsData;
    setSubmitLoading(true);
    try {
      const baseInfo = form.getFieldsValue();

      examPool = {
        ...(isEditMode && { examId: parseInt(editId, 10) }),
        examName: baseInfo.title,
        examType: baseInfo.type,
        examYear: baseInfo.year?.toString(),
        examRegion: baseInfo.region,
        difficulty: (baseInfo.difficulty || '').toUpperCase(),
        examDescription: baseInfo.description,
        source: baseInfo.source || '官方样题',
        creatorId: 1,
        status: 0
      };

      // 编辑模式提交全部 section/question（含 delFlag）供后端软删；新增模式仅提交未删除项
      const sectionsToSubmit = isEditMode ? sections : sections.filter(s => s.delFlag !== '1');
      const questionsToSubmit = isEditMode ? questions : questions.filter(q => q.delFlag !== '1');

      examSections = sectionsToSubmit.map(section => ({
        ...(isEditMode && { examId: parseInt(editId, 10) }),
        ...(isEditMode && { sectionId: section.id }),
        sectionName: section.name,
        sectionCategory: section.subject,
        sectionDifficulty: (section.difficulty || '').toUpperCase(),
        sectionTiming: section.duration,
        status: 0,
        delFlag: section.delFlag || '0'
      }));

      questionsData = questionsToSubmit.map(question => {
        const [optionA, optionB, optionC, optionD] = getQuestionOptionsForSubmit(question);
        return {
          ...(isEditMode && { questionId: question.id }),
          sectionId: question.sectionId,
          sectionName: question.sectionName,
          questionType: question.interactionType,
          questionCategory: (question.subject || '').toUpperCase(),
          questionSubCategory: question.type,
          difficulty: (question.difficulty || '').toUpperCase(),
          questionContent: question.content,
          questionDescription: question.description || '',
          optionA,
          optionB,
          optionC,
          optionD,
          answer: question.correctAnswer,
          analysis: question.explanation || '',
          delFlag: question.delFlag || '0'
        };
      });

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
                <div 
                  ref={questionListRef}
                  className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
                >
                  {questions.map((q, index) => {
                    const isDeleted = q.delFlag === '1';
                    const section = sections.find(s => s.id === q.sectionId);
                    const isSectionDeleted = section?.delFlag === '1';
                    
                    return (
                    <div 
                      key={q.id || `question-${index}`}
                      onClick={() => !isDeleted && setSelectedQuestionId(q.id)}
                      className={`p-2.5 rounded-xl transition-all border-2 ${
                        isDeleted 
                          ? 'border-red-200 bg-red-50/50 cursor-not-allowed' 
                          : selectedQuestionId === q.id 
                            ? 'border-blue-500 bg-blue-50 shadow-sm cursor-pointer' 
                            : 'border-transparent hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isDeleted 
                              ? 'bg-red-500 text-white' 
                              : selectedQuestionId === q.id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isDeleted ? '×' : index + 1}
                          </span>
                          <Tag color={q.interactionType === 'CHOICE' ? 'blue' : 'green'} className="m-0 border-0 text-[9px] font-bold px-1.5 leading-3">
                            {q.interactionType === 'CHOICE' ? 'CHOICE' : 'BLANK'}
                          </Tag>
                        </div>
                        <Tag color={isSectionDeleted ? 'red' : 'purple'} className="m-0 border-0 text-[9px] font-bold px-1 leading-3">
                          {section?.name?.split(':')[0] || '未分配'}
                          {isSectionDeleted && ' (已删除)'}
                        </Tag>
                      </div>
                      <div className="text-[10px] font-medium leading-tight">
                        {isDeleted ? (
                          <span className="text-red-500">已删除</span>
                        ) : (
                          <span className="text-gray-500">{q.status === 1 ? '已录入' : q.status === 0 ? '草稿' : q.status || '已录入'}</span>
                        )}
                      </div>
                    </div>
                  )})}
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
                                  // 安全检查：确保q.options是数组
                                  const currentOptions = Array.isArray(q.options) ? q.options : ['', '', '', ''];
                                  const newOpts = [...currentOptions];
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
          loading: submitLoading,
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
                  <div className="text-base font-bold text-gray-900 truncate">{summaryFormValues.title}</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">考试类型</div>
                  <div className="text-base font-bold text-gray-900">{summaryFormValues.type}</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">总题目数</div>
                  <div className="text-2xl font-black text-red-600">{questions.filter(q => q.delFlag !== '1').length} <span className="text-sm font-bold text-gray-400">题</span></div>
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
            
            {sections.filter(s => s.delFlag !== '1').map((section, index) => {
              const activeQuestionsList = questions.filter(q => q.delFlag !== '1');
              const sectionQuestions = activeQuestionsList.filter(q => q.sectionId === section.id);

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
                          占比 {activeQuestionsList.length > 0 ? Math.round((sectionQuestions.length / activeQuestionsList.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
            <div>
              <h4 className="font-bold text-amber-900 mb-2">提交前请确认</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                请仔细核对各 Section 的题目数量和分布情况，确认无误后点击「确认提交」完成录入。提交后将无法修改，如需调整请点击「返回修改」。
              </p>
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
          loading: sectionSaveLoading,
          className: 'h-11 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 font-bold shadow-lg'
        }}
        cancelButtonProps={{
          className: 'h-11 px-8 rounded-xl font-bold'
        }}
      >
        {sectionForm && (
        <Form form={sectionForm} layout="vertical" className="pt-6">
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
                onChange={(value) => {
                  // 根据选择的Section自动设置科目和默认时长
                  if (value.includes('Reading and Writing')) {
                    sectionForm.setFieldsValue({ 
                      subject: '阅读语法',
                      duration: 32 
                    });
                  } else if (value.includes('Math')) {
                    sectionForm.setFieldsValue({ 
                      subject: '数学',
                      duration: 35 
                    });
                  }
                }}
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
                <Option value="Easy">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-star text-green-500"></i>
                    <span>简单</span>
                  </div>
                </Option>
                <Option value="Medium">
                  <div className="flex items-center space-x-2 py-1">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span>中等</span>
                  </div>
                </Option>
                <Option value="Hard">
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

      <style dangerouslySetInnerHTML={{
        __html: `
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
          .section-dropdown .ant-select-item {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .section-dropdown .ant-select-item-option-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
          }
        `
      }} />
    </div>
  );
}

export default ExamSetEntry;