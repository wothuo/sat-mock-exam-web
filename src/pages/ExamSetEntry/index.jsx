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
  updateExamSectionAndQuestion,
  createExamSet,
  updateExamSet,
  createExamSection,
  updateExamSection,
  deleteExamSection
} from '@/services/exam';
import { uploadToOss } from '@/services/oss';

import ExamSetBaseInfoForm from './components/ExamSetBaseInfoForm';
import ExamSetQuestionStep from './components/ExamSetQuestionStep';
import ExamSetSectionStep from './components/ExamSetSectionStep';
import ExamSetSummaryModal from './components/ExamSetSummaryModal';
import SectionFormModal from './components/SectionFormModal';
import {
  DIFFICULTIES,
  QUESTION_TYPES_MAP,
  FORM_INITIAL_VALUES,
  STEP_ITEMS,
  DEFAULT_SOURCE
} from './examSetEntryConstants';
import {
  clearDraft,
  transformExamSetFromList,
  formatSectionListFromApi,
  formatQuestionListFromApi,
  buildExamPoolPayload,
  buildExamSectionsPayload,
  buildQuestionsPayload,
  validateQuestions,
  renderMathInPreview,
  renderMathInContainers
} from './examSetEntryUtils';

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
  const [fetchExamError, setFetchExamError] = useState(null);
  const [stepNextLoading, setStepNextLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sectionSaveLoading, setSectionSaveLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryFormValues, setSummaryFormValues] = useState({});
  const [questionValidationErrors, setQuestionValidationErrors] = useState([]);

  const fetchExamSetData = async (id, signal) => {
    setFetchLoading(true);
    setFetchExamError(null);
    try {
      const params = {
        examType: 'SAT',
        pageNum: 1,
        pageSize: 100
      };
      const requestConfig = signal ? { signal, showError: false } : {};
      const result = await getExamSetList(params, requestConfig);

      if (signal?.aborted) return null;
      if (result && result.list) {
        const examSet = result.list.find(item => item.examId === parseInt(id, 10));
        return transformExamSetFromList(examSet);
      }
      return null;
    } catch (error) {
      if (signal?.aborted || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return null;
      setFetchExamError(error);
      return null;
    } finally {
      if (!signal?.aborted) setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (!editId) return;
    const controller = new AbortController();
    const loadExamData = async () => {
      setIsEditMode(true);
      const data = await fetchExamSetData(editId, controller.signal);

      if (controller.signal.aborted) return;
      if (data) {
        setFetchExamError(null);
        form.setFieldsValue({
          title: data.title,
          year: data.year,
          type: data.type,
          region: data.region,
          difficulty: data.difficulty,
          source: data.source,
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
              interactionType: '选择题',
              type: QUESTION_TYPES_MAP[section.subject] ? QUESTION_TYPES_MAP[section.subject][0] : '未分类',
              difficulty: '中等',
              content: `题目 ${qId} 的内容`,
              options: ['选项A', '选项B', '选项C', '选项D'],
              correctAnswer: 'A',
              explanation: '解析内容'
            }))
        );
        setQuestions(mockQuestions);
      }
    };

    loadExamData();
    return () => controller.abort();
  }, [editId]);

  const handleFetchRetry = () => {
    setFetchExamError(null);
    const controller = new AbortController();
    const loadExamData = async () => {
      setIsEditMode(true);
      const data = await fetchExamSetData(editId, controller.signal);
      if (controller.signal.aborted) return;
      if (data) {
        setFetchExamError(null);
        form.setFieldsValue({
          title: data.title,
          year: data.year,
          type: data.type,
          region: data.region,
          difficulty: data.difficulty,
          source: data.source,
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
              interactionType: '选择题',
              type: QUESTION_TYPES_MAP[section.subject] ? QUESTION_TYPES_MAP[section.subject][0] : '未分类',
              difficulty: '中等',
              content: `题目 ${qId} 的内容`,
              options: ['选项A', '选项B', '选项C', '选项D'],
              correctAnswer: 'A',
              explanation: '解析内容'
            }))
        );
        setQuestions(mockQuestions);
      }
    };
    loadExamData();
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
            difficulty: baseInfo.difficulty,
            examDescription: baseInfo.description,
            source: baseInfo.source || DEFAULT_SOURCE,
            status: 0
          };

          const examExists = await checkExamExists(payload);
          if (examExists) {
            message.warning('套题已存在，请检查套题名称、年份、类型、区域、难度或描述是否重复');
            return;
          }
          // 更新套题基础信息
          await updateExamSet(payload);
          setExamData(payload);
          setExamId(editExamId);

          try {
            const sectionListData = await getSectionListByExamId(editExamId);
            if (sectionListData && sectionListData.length > 0) {
              setSections(formatSectionListFromApi(sectionListData));
            }
          } catch (error) {
            message.error('获取Section列表信息失败');
            return;
          }

          message.success('套题基础信息更新成功');
        } else {
          // 新增模式：检查是否已经有examId（从第二步返回的情况）
          console.log('【测试日志】新增模式，当前examId:', examId, 'examData:', examData);

          if (examId) {
            // 如果examId存在，说明是从第二步返回，需要调用更新接口
            console.log('【测试日志】检测到已有examId，执行更新逻辑');

            const updateData = {
              examId: examId,
              examName: baseInfo.title,
              examType: baseInfo.type,
              examYear: baseInfo.year.toString(),
              examRegion: baseInfo.region,
              difficulty: baseInfo.difficulty,
              examDescription: baseInfo.description,
              source: baseInfo.source || DEFAULT_SOURCE,
              status: 0
            };

            console.log('【测试日志】更新数据:', updateData);

            // 调用更新套题接口
            await updateExamSet(updateData);
            console.log('【测试日志】更新套题接口调用成功');
            message.success('套题基础信息已更新');
            setExamData(updateData);
          } else {
            // 首次新增：调用检查套题是否存在接口
            console.log('【测试日志】首次新增，执行检查+新增逻辑');

            // 准备检查套题是否存在接口所需数据
            const examData = {
              examName: baseInfo.title,
              examType: baseInfo.type,
              examYear: baseInfo.year.toString(),
              examRegion: baseInfo.region,
              difficulty: baseInfo.difficulty, // 使用中文难度
              examDescription: baseInfo.description,
              source: baseInfo.source || DEFAULT_SOURCE, // 默认值，后续可从登录信息获取
              creatorId: 1 // 假设当前用户ID为1，后续可从登录信息获取
            };

            console.log('【测试日志】检查套题数据:', examData);

            // 调用检查套题是否存在接口
            const result = await checkExamExists(examData);
            console.log('【测试日志】检查套题是否存在结果:', result);

            // 如果套题不存在，则新增套题
            if (!result) {
              // 调用新增套题接口
              const newExamId = await createExamSet(examData);
              console.log('【测试日志】新增套题成功，返回examId:', newExamId);
              // 记录examId并暂存套题信息
              setExamId(newExamId);
              setExamData(examData);
            } else {
              // 如果套题已存在，提示用户
              console.log('【测试日志】套题已存在，阻止继续');
              message.warning('套题已存在，请检查套题名称、年份、类型、区域、难度或描述是否重复');
              return;
            }
          }

          console.log('【测试日志】套题基础信息保存成功，即将进入下一步');
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
    // 设置默认难度为中等
    sectionForm.setFieldsValue({ difficulty: '中等' });
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

      // 准备Section数据
      const sectionData = {
        examId: examId, // 使用之前保存的套题ID
        sectionName: values.name,
        sectionCategory: values.subject,
        sectionDifficulty: values.difficulty,
        sectionTiming: values.duration,
        creatorId: 1, // 假设当前用户ID为1，后续可从登录信息获取
        status: 0
      };

      // 统一处理逻辑：根据sectionId正负值决定调用哪个API

      // 检查Section名称、分类、难度、限时是否与其他Section重复
      const isDuplicate = sections.some(section => {
        // 如果是编辑模式，排除当前编辑的Section
        if (editingSection && section.id === editingSection.id) {
          return false;
        }
        return section.name === values.name &&
            section.subject === values.subject &&
            section.difficulty === values.difficulty &&
            section.duration === values.duration;
      });

      if (isDuplicate) {
        message.warning('Section 已存在，请检查Section名称、分类、难度或限时是否重复');
        return;
      }

      // 调用检查Section是否存在接口
      const result = await checkSectionExists(sectionData);

      if (result) {
        // 如果Section已存在，提示用户
        message.warning('Section 已存在，请检查Section名称、分类、难度或限时是否重复');
        return;
      }

      // Section不存在，根据sectionId正负值决定调用哪个API
      if (editingSection) {
        // 编辑模式：调用updateExamSection
        sectionData.sectionId = editingSection.id;
        const updateSuccess = await updateExamSection(sectionData);

        if (updateSuccess) {
          setSections(prev => prev.map(s =>
              s.id === editingSection.id ? { ...s, ...values } : s
          ));
          message.success('Section 已更新');
        } else {
          message.error('Section 更新失败，请稍后重试');
          return;
        }
      } else {
        // 新增模式：调用createExamSection
        const newSectionId = await createExamSection(sectionData);
        
        if (newSectionId && newSectionId > 0) {
          const newSection = {
            id: newSectionId, // 使用API返回的真实Section ID
            examId: examId, // 使用之前保存的套题ID
            name: values.name,
            subject: values.subject,
            difficulty: values.difficulty,
            duration: values.duration,
            status: 0
          };
          setSections(prev => [...prev, newSection]);
          message.success('Section 已添加');
        } else {
          message.error('Section 添加失败，请稍后重试');
          return;
        }
      }

      setIsSectionModalVisible(false);
    } catch (error) {
      message.error('保存Section失败，请稍后重试');
    } finally {
      setSectionSaveLoading(false);
    }
  };

  const removeSection = async (id) => {
    try {
      console.log('【测试日志】删除Section，调用deleteExamSection接口，sectionId:', id);

      // 调用删除Section接口
      const success = await deleteExamSection(id);

      if (success) {
        console.log('【测试日志】Section删除成功');
        // 设置section的delFlag为1（软删除）
        setSections(prev => prev.map(s =>
            s.id === id ? { ...s, delFlag: '1' } : s
        ));
        // 设置该section下所有题目的delFlag为1
        setQuestions(prev => prev.map(q =>
            q.sectionId === id ? { ...q, delFlag: '1' } : q
        ));
        message.success('Section 已删除');
      } else {
        console.log('【测试日志】Section删除失败');
        message.error('Section 删除失败，请稍后重试');
      }
    } catch (error) {
      console.error('【测试日志】删除Section失败:', error);
      message.error('删除Section失败，请稍后重试');
    }
  };

  const addQuestion = () => {
    if (sections.length === 0) {
      message.warning('请先在第二步定义 Section 信息');
      return;
    }
    const newId = Date.now() * -1;
    const defaultSection = sections[0];
    // 根据subject设置默认的subjectCategory
    const defaultSubjectCategory = defaultSection.subject === '阅读语法' ? '阅读' : defaultSection.subject;
    const questionTypes = QUESTION_TYPES_MAP[defaultSubjectCategory] || [];
    const newQuestion = {
      id: newId,
      sectionId: defaultSection.id,
      sectionName: defaultSection.name,
      subject: defaultSection.subject,
      subjectCategory: defaultSubjectCategory,
      interactionType: '选择题',
      type: questionTypes.length > 0 ? questionTypes[0] : '未分类',
      difficulty: '中等',
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
            const defaultSubjectCategory = targetSection.subject === '阅读语法' ? '阅读' : targetSection.subject;
            updated.subjectCategory = defaultSubjectCategory;
            const questionTypes = QUESTION_TYPES_MAP[defaultSubjectCategory] || [];
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

    const { valid, errors } = validateQuestions(questions, sections);
    if (!valid) {
      setQuestionValidationErrors(errors);
      message.warning(`有 ${errors.length} 处题目信息未填写完整，请检查后提交`);
      if (questionListRef.current) {
        questionListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setQuestionValidationErrors([]);
    setSummaryFormValues(form.getFieldsValue());
    setShowSummaryModal(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitLoading(true);
    try {
      const baseInfo = form.getFieldsValue();
      const examPool = buildExamPoolPayload(baseInfo, isEditMode, editId);
      const examSections = buildExamSectionsPayload(sections, isEditMode, editId);
      
      const updatedQuestions = questions.map(question => {
        // 查找对应的Section，如果Section的ID已经更新为真实ID，则更新题目的sectionId
        const matchedSection = sections.find(section => 
          section.id === question.sectionId || 
          (section.id < 0 && section.id === question.sectionId)
        );
        
        // 如果找到匹配的Section且Section的ID是真实ID（正数），则更新题目的sectionId
        if (matchedSection && matchedSection.id > 0 && question.sectionId < 0) {
          return {
            ...question,
            sectionId: matchedSection.id
          };
        }
        
        return question;
      });
      
      const questionsData = buildQuestionsPayload(updatedQuestions, isEditMode);

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
      navigate('/management');
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
      case 'underline':
        newValue = currentValue.substring(0, start) + `<u>${selectedText}</u>` + currentValue.substring(end);
        break;
      case 'insertUnderline':
        newValue = currentValue.substring(0, start) + '<u>\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0</u>' + currentValue.substring(end);
        break;
      case 'strikethrough':
        newValue = currentValue.substring(0, start) + `~~${selectedText}~~` + currentValue.substring(end);
        break;
      case 'superscript':
        newValue = currentValue.substring(0, start) + `<sup>${selectedText}</sup>` + currentValue.substring(end);
        break;
      case 'subscript':
        newValue = currentValue.substring(0, start) + `<sub>${selectedText}</sub>` + currentValue.substring(end);
        break;
      case 'highlight':
        newValue = currentValue.substring(0, start) + `<mark>${selectedText}</mark>` + currentValue.substring(end);
        break;
      case 'unorderedList': {
        const ulItems = selectedText.split('\n').filter(Boolean).map(line => `<li>${line}</li>`).join('');
        newValue = currentValue.substring(0, start) + `<ul>${ulItems}</ul>` + currentValue.substring(end);
        break;
      }
      case 'orderedList': {
        const olItems = selectedText.split('\n').filter(Boolean).map(line => `<li>${line}</li>`).join('');
        newValue = currentValue.substring(0, start) + `<ol>${olItems}</ol>` + currentValue.substring(end);
        break;
      }
      case 'blockIndent':
        newValue = currentValue.substring(0, start) + `<div style="margin-left: 2em;">${selectedText}</div>` + currentValue.substring(end);
        break;
      case 'center':
        newValue = currentValue.substring(0, start) + `<div style="text-align: center;">${selectedText}</div>` + currentValue.substring(end);
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
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          message.loading({ content: '图片上传中...', key: 'oss_upload' });
          const finalUrl = await uploadToOss(file);
          handleToolbarAction('image', finalUrl, activeEditorId);
          message.success({ content: '图片上传成功', key: 'oss_upload' });
        } catch (error) {
          console.error('图片上传失败:', error);
          message.error({ content: '图片上传失败，请重试', key: 'oss_upload' });
        }
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
        <div className="max-w-5xl mx-auto padding-bottom-1 flex items-center justify-center min-h-[400px]">
          <Spin size="large" tip="加载套题数据中..." />
        </div>
    );
  }

  if (fetchExamError && editId) {
    return (
        <div className="max-w-5xl mx-auto padding-bottom-1 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
            <i className="fas fa-exclamation-circle text-5xl text-amber-500 mb-4"></i>
            <p className="text-gray-600 mb-6">获取套题数据失败，请稍后重试</p>
            <button
                type="button"
                onClick={handleFetchRetry}
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all"
            >
              重试
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto padding-bottom-1">
        <div className="flex items-center justify-between mb-2">
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
            initialValues={editId ? { ...FORM_INITIAL_VALUES, source: undefined } : FORM_INITIAL_VALUES}
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
                questionValidationErrors={questionValidationErrors}
                onAddQuestion={addQuestion}
                onSelectQuestion={setSelectedQuestionId}
                onUpdateQuestion={updateQuestion}
                onRemoveQuestion={removeQuestion}
                onToolbarAction={handleToolbarAction}
                onRenderMathInPreview={renderMathInPreview}
                onInsertImage={insertImage}
                onPrev={() => {
                  setQuestionValidationErrors([]);
                  setCurrentStep(1);
                }}
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