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
import ExamSetSectionStep from './components/ExamSetSectionStep';
import ExamSetQuestionStep from './components/ExamSetQuestionStep';
import SectionFormModal from './components/SectionFormModal';
import ExamSetSummaryModal from './components/ExamSetSummaryModal';
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
            const categoryToSubject = { READING: '阅读语法', WRITING: '阅读语法', MATH: '数学' };
            const formattedQuestions = questionListData.map(item => {
              const { question, sectionName } = item;
              const optionsArray = parseQuestionOptions(question.options);
              const section = sections.find(s => s.id === question.sectionId);
              const subject = section?.subject || categoryToSubject[question.questionCategory] || '阅读语法';
              return {
                id: question.questionId,
                sectionId: question.sectionId,
                sectionName,
                subject,
                questionCategory: question.questionCategory,
                questionSubCategory: question.questionSubCategory,
                difficulty: question.difficulty,
                type: question.questionSubCategory || '',
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
            <ExamSetQuestionStep
              questions={questions}
              sections={sections}
              selectedQuestionId={selectedQuestionId}
              activeEditorId={activeEditorId}
              questionTypesMap={questionTypesMap}
              difficulties={difficulties}
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