import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { Button, Space } from 'antd';

import {
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined
} from '@ant-design/icons';

import { answerOfSection, finishAnswer } from '@/services';

import { ReferenceDrawer } from './components/drawers';
import {
  ExamHeader,
  ExamFooterBar,
  QuestionStemPanel,
  QuestionAnswerPanel,
  QuestionNotesPanel
} from './components/layout';
import {
  NoteModal,
  ProgressModal,
  EndExamModal,
  SubmitSuccessModal
} from './components/modals';
import {
  PreparingScreen,
  TimeModeScreen,
  IntroScreen,
  ExamReportView
} from './components/screens';
import { getDirectionsBySectionType, getSectionCategory } from './directions';
import { examData } from './examData';
import { useExamProgress } from './hooks/useExamProgress';
import { useExamTimer } from './hooks/useExamTimer';
import { useHighlightAndNotes } from './hooks/useHighlightAndNotes';
import { renderMathInContainers } from './renderMath';
import { calculateScore } from './utils/examScore';
import { formatText } from './utils/formatText';
import { formatQuestionTime } from './utils/formatTime';
import './ExamContent.css';


const FALLBACK_TIME_SEC = 34 * 60 + 55;

function ExamContent() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location', location.state);
  
  // 使用useMemo缓存路由状态，避免无限重渲染
  const { sectionId, examTitle, examDuration, totalQuestions, stateQuestions, stateTimeMode } = useMemo(() => {
    const state = location.state || {};
    return {
      sectionId: state.sectionId || examId,
      examTitle: state.examTitle,
      examDuration: state.examDuration,
      totalQuestions: state.totalQuestions,
      stateQuestions: state.questions || null, // 新增：获取路由状态中的题目数据
      stateTimeMode: state.timeMode || 'timed' // 获取时间模式
    };
  }, [location.state, examId]); // 只有当location.state或examId变化时才重新计算
  
  // 真实题目数据状态
  const [realExamData, setRealExamData] = useState(null);
  const [originalServerData, setOriginalServerData] = useState(null); // 保存原始服务端数据
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hasFetchedRef = React.useRef(false);
  const prevSectionIdRef = React.useRef(sectionId);
  const hasProcessedStateQuestionsRef = React.useRef(false);

  // 获取真实题目数据（初始化仅请求一次，ref 防止 StrictMode 双重调用）
  useEffect(() => {
    const sectionIdChanged = prevSectionIdRef.current !== sectionId;
    if (sectionIdChanged) {
      hasFetchedRef.current = false;
      prevSectionIdRef.current = sectionId;
      setRealExamData(null);
      setOriginalServerData(null);
    }
    if (hasFetchedRef.current) return;
    if (realExamData && !sectionIdChanged) {
      hasFetchedRef.current = true;
      return;
    }

    // 如果路由状态中已有题目数据，直接使用
    if (stateQuestions && !realExamData) {

      
      // 适配不同格式的题目数据
      let questionsData = null;
      if (Array.isArray(stateQuestions)) {
        // 情况1：直接是题目数组
        questionsData = stateQuestions;
        console.log('使用直接返回的数组作为数据源');
      } else if (stateQuestions.code === 0 && Array.isArray(stateQuestions.data)) {
        // 情况2：标准响应格式 {code: 0, data: [...]}
        questionsData = stateQuestions.data;
        console.log('使用标准响应格式的数据源');
      } else {
        setError(`数据格式错误：无法识别返回的数据结构`);
        console.error('数据格式错误:', stateQuestions);
        return;
      }
      
      // 转换后端数据格式为前端需要的格式
      const sectionCategory = getSectionCategory(questionsData[0]);
      const directions = getDirectionsBySectionType(sectionCategory);

      const transformedData = {
        title: questionsData.length > 0 ? questionsData[0].sectionName : examTitle,
        totalQuestions: questionsData.length,
        sectionCategory,
        directions,
        questions: questionsData.map((item, index) => {
          // 验证 item 结构
          if (!item || typeof item !== 'object') {
            console.warn('无效的题目数据项:', item);
            return null;
          }
          
          // 根据实际数据结构，item 包含嵌套的 question 对象
          const questionObj = item.question; // 题目数据在 question 字段中
          
          // 详细调试每个题目的完整数据结构
          console.log(`题目 ${index + 1} 完整数据结构:`, item);
          console.log(`题目 ${index + 1} 嵌套question对象:`, questionObj);
          console.log(`题目 ${index + 1} 关键字段:`, {
            questionId: questionObj?.questionId,
            questionContent: questionObj?.questionContent,
            questionType: questionObj?.questionType,
            options: questionObj?.options,
            hasQuestionContent: !!questionObj?.questionContent,
            keys: questionObj ? Object.keys(questionObj) : []
          });
          
          // 检查题目内容是否存在
          if (!questionObj || !questionObj.questionContent) {
            console.warn(`题目 ${index + 1} 缺少 questionContent 字段，可用字段:`, questionObj ? Object.keys(questionObj) : []);
          }
          
          // 解析选项JSON字符串 - 适配实际的数据格式
          let options = [];
          if (questionObj?.options) {
            try {
              const parsedOptions = JSON.parse(questionObj.options);
              
              // 处理数组格式的选项数据
              if (Array.isArray(parsedOptions)) {
                options = parsedOptions.map(option => `(${option.option}) ${option.content || option.text || option.value}`);
              } else if (typeof parsedOptions === 'object') {
                // 处理对象格式的选项数据
                options = Object.entries(parsedOptions).map(([key, value]) => `(${key}) ${value}`);
              }
              
              console.log(`题目 ${index + 1} 解析后的选项:`, options);
            } catch (e) {
              console.warn('Failed to parse options JSON:', questionObj.options);
              // 尝试直接使用字符串格式的选项
              if (typeof questionObj.options === 'string') {
                options = questionObj.options.split(',').map(opt => opt.trim());
              }
            }
          }
          
          // 根据题目类型确定题型，统一为BLANK和CHOICE两种类型
          let questionType = 'CHOICE'; // 默认设为选择题
          const originalQuestionType = questionObj?.questionType?.toUpperCase();
          
          if (originalQuestionType === 'BLANK' || questionObj?.questionType === '填空题') {
            questionType = 'BLANK';
          } else if (originalQuestionType === 'CHOICE' || questionObj?.questionType === '选择题') {
            questionType = 'CHOICE';
          }
          // 保留原始questionType用于调试
          console.log(`题目 ${index + 1} 原始questionType:`, originalQuestionType, '转换后type:', questionType);
          
          const questionContent = questionObj?.questionContent || 
                                questionObj?.question || 
                                questionObj?.content || 
                                `题目 ${index + 1} 内容加载中...`;
          
          const blanks = questionType === 'BLANK' ? [{ id: 'blank1' }] : [];

          return {
            id: index + 1,
            originalId: questionObj?.questionId,
            type: questionType,
            hasImage: false, // 通过属性区分带图片的题目
            questionType: originalQuestionType, // 保留原始questionType用于调试和后续处理
            question: questionContent,
            content: questionContent,
            description: questionObj?.questionDescription || '',
            options: options,
            blanks: blanks,
            correctAnswer: questionObj?.answer || '',
            analysis: questionObj?.analysis || '',
            difficulty: questionObj?.difficulty || '中等',
            category: questionObj?.questionCategory || '数学',
            subCategory: questionObj?.questionSubCategory || ''
          };
        }).filter(Boolean) // 过滤掉 null 项
      };
      
      // 验证转换后的数据
      console.log('转换后的数据:', transformedData);
      console.log('题目数量:', transformedData.questions.length);
      
      if (transformedData.questions.length === 0) {
        setError('没有找到有效的题目数据');
        return;
      }
      
      hasFetchedRef.current = true;
      setRealExamData(transformedData);
      setOriginalServerData(questionsData);
      setLoading(false);
      return;
    }

    // 从 API 获取数据
    hasFetchedRef.current = true;

    const fetchRealExamData = async () => {
      try {
        setLoading(true);
        console.log('开始请求题目数据，sectionId:', sectionId);
        const result = await answerOfSection(sectionId);
        
        // 调试日志：打印服务端返回的完整数据结构
        console.log('服务端返回数据:', result);
        console.log('result 类型:', typeof result);
        console.log('result 是数组:', Array.isArray(result));
        console.log('result 长度:', Array.isArray(result) ? result.length : 'N/A');
        
        // 验证数据格式 - 适配直接返回数组的情况
        let questionsData = null;
        
        if (Array.isArray(result)) {
          // 情况1：服务端直接返回题目数组
          questionsData = result;
          console.log('使用直接返回的数组作为数据源');
        } else if (result && result.code === 0 && Array.isArray(result.data)) {
          // 情况2：标准响应格式 {code: 0, data: [...]}
          questionsData = result.data;
          console.log('使用标准响应格式的数据源');
        } else {
          setError(`数据格式错误：无法识别返回的数据结构`);
          console.error('数据格式错误:', result);
          return;
        }
        
        // 转换后端数据格式为前端需要的格式
        const sectionCategory = getSectionCategory(questionsData[0]);
        const directions = getDirectionsBySectionType(sectionCategory);

        const transformedData = {
          title: questionsData.length > 0 ? questionsData[0].sectionName : examTitle,
          totalQuestions: totalQuestions,
          sectionCategory,
          directions,
          questions: questionsData.map((item, index) => {
            // 验证 item 结构
            if (!item || typeof item !== 'object') {
              console.warn('无效的题目数据项:', item);
              return null;
            }
            
            // 根据实际数据结构，item 包含嵌套的 question 对象
            const questionObj = item.question; // 题目数据在 question 字段中
            
            // 详细调试每个题目的完整数据结构
            console.log(`题目 ${index + 1} 完整数据结构:`, item);
            console.log(`题目 ${index + 1} 嵌套question对象:`, questionObj);
            console.log(`题目 ${index + 1} 关键字段:`, {
              questionId: questionObj?.questionId,
              questionContent: questionObj?.questionContent,
              questionType: questionObj?.questionType,
              options: questionObj?.options,
              hasQuestionContent: !!questionObj?.questionContent,
              keys: questionObj ? Object.keys(questionObj) : []
            });
            
            // 检查题目内容是否存在
            if (!questionObj || !questionObj.questionContent) {
              console.warn(`题目 ${index + 1} 缺少 questionContent 字段，可用字段:`, questionObj ? Object.keys(questionObj) : []);
            }
            
            // 解析选项JSON字符串 - 适配实际的数据格式
            let options = [];
            if (questionObj?.options) {
              try {
                const parsedOptions = JSON.parse(questionObj.options);
                options = Object.entries(parsedOptions).map(([key, value]) => `(${key}) ${value}`);
              } catch (e) {
                console.warn('Failed to parse options JSON:', questionObj.options);
                // 尝试直接使用字符串格式的选项
                if (typeof questionObj.options === 'string') {
                  options = questionObj.options.split(',').map(opt => opt.trim());
                }
              }
            }
            
            // 根据题目类型确定题型
            let questionType = questionObj?.questionType.toUpperCase();

            const questionContent = questionObj?.questionContent || 
                                  questionObj?.question || 
                                  questionObj?.content || 
                                  `题目 ${index + 1} 内容加载中...`;
            
            const blanks = questionType === 'BLANK' ? [{ id: 'blank1' }] : [];
            
            // 提取图片URL - 检查questionContent中是否包含图片URL
            let imageUrls = [];
            let processedQuestionContent = questionContent;
            
            // 匹配Markdown格式的图片标记 ![图片](url) 或 ![alt text](url)
            const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/gi;
            const markdownMatches = [...questionContent.matchAll(markdownImageRegex)];
            
            if (markdownMatches && markdownMatches.length > 0) {
              // 提取所有匹配的图片URL和alt文本
              imageUrls = markdownMatches.map((match, imgIndex) => ({
                url: match[2], // 第二个捕获组是URL
                alt: match[1] || `题目 ${index + 1} 图片 ${imgIndex + 1}`,
                index: imgIndex
              }));
              
              // 从questionContent中移除所有Markdown图片标记
              processedQuestionContent = questionContent.replace(markdownImageRegex, '').trim();
            } else {
              // 如果没有Markdown格式，尝试匹配裸图片URL
              const imageUrlRegex = /https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?/gi;
              const imageMatches = questionContent.match(imageUrlRegex);
              
              if (imageMatches && imageMatches.length > 0) {
                // 提取所有匹配的图片URL
                imageUrls = imageMatches.map((url, imgIndex) => ({
                  url: url,
                  alt: `题目 ${index + 1} 图片 ${imgIndex + 1}`,
                  index: imgIndex
                }));
                
                // 从questionContent中移除所有图片URL
                processedQuestionContent = questionContent.replace(imageUrlRegex, '').trim();
              }
            }
            
            // 统一使用BLANK和CHOICE类型，通过hasImage属性区分带图片的题目
            let finalQuestionType = questionType;
            
            return {
              id: index + 1, // 使用索引作为ID，确保与currentQuestion匹配
              originalId: questionObj?.questionId, // 保存原始ID用于后续处理
              type: finalQuestionType,
              hasImage: imageUrls.length > 0, // 通过属性区分带图片的题目
              hasTable: false, // 暂时设为false，后续可根据内容判断
              question: processedQuestionContent,
              content: processedQuestionContent,
              images: imageUrls,
              image: imageUrls.length > 0 ? imageUrls[0].url : '',
              imageAlt: imageUrls.length > 0 ? imageUrls[0].alt : `题目 ${index + 1} 图片`,
              description: questionObj?.questionDescription || '',
              options: options,
              blanks: blanks,
              correctAnswer: questionObj?.answer || '',
              analysis: questionObj?.analysis || '',
              difficulty: questionObj?.difficulty || '中等',
              category: questionObj?.questionCategory || '数学',
              subCategory: questionObj?.questionSubCategory || ''
            };
          }).filter(Boolean) // 过滤掉 null 项
        };
        
        // 验证转换后的数据
        console.log('转换后的数据:', transformedData);
        console.log('题目数量:', transformedData.questions.length);
        
        if (transformedData.questions.length === 0) {
          setError('没有找到有效的题目数据');
          return;
        }
        
        setRealExamData(transformedData);
        setOriginalServerData(questionsData); // 保存原始服务端数据
      } catch (err) {
        setError('网络错误，请检查网络连接');
        console.error('获取题目数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealExamData();
  }, [sectionId, stateQuestions]);

  const [showDirections, setShowDirections] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [showTimeMode, setShowTimeMode] = useState(!stateQuestions); // 如果已有题目数据，不显示时间模式选择
  const [showIntro, setShowIntro] = useState(!!stateQuestions); // 如果已有题目数据，直接显示IntroScreen
  const [timeMode, setTimeMode] = useState(stateTimeMode);
  const [examStarted, setExamStarted] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showTimeAsIcon, setShowTimeAsIcon] = useState(false);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [hideTime, setHideTime] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('All');
  const [showReference, setShowReference] = useState(false);

  const examDataToUse = realExamData || [];

  // 根据题目数据计算倒计时初始秒数：套题模考用 sectionTiming，专项训练用 题目数×3分钟，接口无 sectionTiming 按专项训练处理
  const initialTimeSec = useMemo(() => {
    const rawQuestions = originalServerData || stateQuestions;
    if (!rawQuestions || !Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      return FALLBACK_TIME_SEC;
    }
    const firstItem = rawQuestions[0];
    const sectionTiming = firstItem?.sectionTiming ?? 0;
    if (sectionTiming > 0) {
      return sectionTiming * 60;
    }
    return rawQuestions.length * 3 * 60;
  }, [originalServerData, stateQuestions]);
  
  // 只在开发环境或特定条件下输出调试信息
  if (process.env.NODE_ENV === 'development') {
    // 使用useRef记录上次渲染状态，避免重复输出
    const prevRenderRef = React.useRef({});
    const currentState = {
      sectionId,
      hasRealExamData: !!realExamData,
      questionCount: examDataToUse.questions?.length
    };
    
    // 只有当状态真正变化时才输出
    if (JSON.stringify(prevRenderRef.current) !== JSON.stringify(currentState)) {
      console.log('组件状态变化:', currentState);
      prevRenderRef.current = currentState;
    }
  }
  
  const progress = useExamProgress(examDataToUse);
  const {
    currentQuestion,
    currentQ,
    answers,
    setAnswers,
    markedForReview,
    questionTimes,
    handleAnswerSelect,
    recordQuestionTime,
    goToQuestion: progressGoToQuestion,
    goToPrevious,
    goToNext,
    resetOnBeginExam
  } = progress;

  const { timeRemaining, formatTime } = useExamTimer(examStarted, timeMode, initialTimeSec);

  const highlightNotes = useHighlightAndNotes(currentQuestion, setShowNotesPanel);
  const {
    notes,
    selectedText,
    showNoteModal,
    setShowNoteModal,
    setSelectedText,
    expandedNotes,
    saveNote,
    toggleNoteExpansion,
    deleteNote,
    handleTextSelection,
    renderFormattedText,
    addHighlight,
    addUnderline,
    addNote,
    removeHighlight
  } = highlightNotes;

  // 准备阶段依赖 answer/exam/start 接口加载完成（通过 loading 状态体现）
  useEffect(() => {
    if (!loading) {
      setIsPreparing(false);
      // 移除这里的 resetOnBeginExam 调用，避免过早重置开始时间
      // resetOnBeginExam();
    }
  }, [loading]);

  // 如果有题目数据，直接显示IntroScreen
  useEffect(() => {
    if (stateQuestions && !showIntro) {
      setShowIntro(true);
      setShowTimeMode(false);
    }
  }, [stateQuestions]); // 移除showIntro依赖，避免无限循环

  const prevQuestionRef = React.useRef(currentQuestion);
  const prevExamFinishedRef = React.useRef(examFinished);

  useEffect(() => {
    const questionChanged = prevQuestionRef.current !== currentQuestion;
    const examFinishedChanged = prevExamFinishedRef.current !== examFinished;
    prevQuestionRef.current = currentQuestion;
    prevExamFinishedRef.current = examFinished;

    // 仅在题目切换或考试结束时隐藏并重渲染，避免 Directions 开闭导致题目内容闪烁
    if (questionChanged || examFinishedChanged) {
      const containers = document.querySelectorAll('.selectable-text, .math-content');
      containers.forEach((c) => { c.style.visibility = 'hidden'; });
    }

    const timer = setTimeout(() => renderMathInContainers(), 50);
    return () => clearTimeout(timer);
  }, [currentQuestion, showDirections, examFinished]);

  const goToQuestion = (num) => {
    progressGoToQuestion(num);
    setShowProgress(false);
  };

  const handleViewReport = useCallback(() => {
    setShowSubmitSuccessModal(false);
    setExamFinished(true);
  }, []);

  const startExam = () => {
    setShowTimeMode(false);
    setShowIntro(true);
  };

  const beginExam = () => {
    setExamStarted(true);
    setShowIntro(false);
    resetOnBeginExam();
  };

  const questionTimesRef = useRef(questionTimes);
  const hasAutoSubmittedRef = useRef(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    // 当questionTimes更新时，同步更新Ref
    questionTimesRef.current = questionTimes;
  }, [questionTimes]);

  const handleFinishExam = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      // 先记录最后一道题的耗时
      recordQuestionTime(currentQuestion);
      
      // 等待React状态更新完成
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          // 使用Ref获取最新的questionTimes状态
          const latestQuestionTimes = questionTimesRef.current;
          // 检查最后一道题的耗时是否已记录（只要存在即可，0也是有效记录）
          if (latestQuestionTimes.hasOwnProperty(currentQuestion)) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });

      // 使用Ref获取最新的questionTimes状态
      console.log('提交前题目耗时数据:', questionTimesRef.current);

      // 准备提交数据
      const submitData = {
        answers: []
      };

      // 遍历所有题目，构建提交数据
      if (originalServerData && originalServerData.length > 0) {
        // 使用Ref获取最新的状态
        const latestQuestionTimes = questionTimesRef.current;

        console.log('开始构建提交数据，题目数量:', originalServerData.length);
        console.log('用户答案数据:', answers);
        console.log('最新题目耗时数据:', latestQuestionTimes);
        console.log('原始服务端数据结构:', originalServerData);

        for (let i = 0; i < originalServerData.length; i++) {
          // 获取原始服务端数据
          const originalQuestionData = originalServerData[i];
          console.log(`题目 ${i + 1} 原始服务端数据结构:`, originalQuestionData);

          // 从原始服务端数据获取ID
          // 数据结构: {answerId: 102, question: {questionId: 3, ...}, sectionName: '阅读部分', sectionTiming: 65}
          const answerId = originalQuestionData.answerId; // 直接获取answerId
          const questionId = originalQuestionData.question?.questionId; // 从嵌套的question对象获取questionId

          // 获取本地对应的题目数据
          const localQuestion = examDataToUse.questions[i];
          // 用户答案（使用本地题目ID）
          let userAnswer = answers[localQuestion?.id || i + 1] || '';
          // 检查用户答案类型，如果是对象（填空题），转换为JSON字符串
          if (typeof userAnswer === 'object' && userAnswer !== null) {
            userAnswer = JSON.stringify(userAnswer);
          }

          // 获取耗时（使用本地题目ID，与报告页面保持一致）
          let timeConsuming = 0;
          
          if (localQuestion) {
            // 直接使用本地题目ID，与ExamReportView保持一致
            timeConsuming = latestQuestionTimes[localQuestion.id] || 0;
            console.log(`题目 ${i + 1} 耗时查找结果:`, {
              questionId, // 服务端ID
              localQuestionId: localQuestion.id, // 本地ID
              timeConsuming,
              localQuestionIdInQuestionTimes: latestQuestionTimes.hasOwnProperty(localQuestion.id)
            });
          } else {
            timeConsuming = latestQuestionTimes[i + 1] || 0;
            console.warn(`题目 ${i + 1} 未找到对应的本地题目数据，使用索引作为fallback`);
          }

          // 只要有有效的ID就提交，即使没有用户答案（记录未作答状态）
          if (answerId && questionId) {
            submitData.answers.push({
              answerId: answerId,
              questionId: questionId,
              userAnswer: userAnswer,
              timeConsuming: timeConsuming
            });
            console.log(`题目 ${i + 1} 已添加到提交列表`);
          } else {
            console.warn(`题目 ${i + 1} 缺少必要的ID字段，跳过提交`);
            console.warn('answerId:', answerId, 'questionId:', questionId);
          }
        }
      }

      console.log('提交的作答数据:', submitData);

      // 调用结束作答接口
      if (submitData.answers.length > 0) {
        const result = await finishAnswer(submitData);
        console.log('作答提交结果:', result);
      } else {
        console.warn('没有有效的作答数据需要提交');
      }

      setShowSubmitSuccessModal(true);
    } catch (error) {
      console.error('提交作答数据时发生错误:', error);
      setExamFinished(true);
    } finally {
      setShowEndExamModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishExamRef = useRef(handleFinishExam);
  handleFinishExamRef.current = handleFinishExam;

  const shouldAutoSubmit =
    examStarted &&
    timeMode === 'timed' &&
    timeRemaining === 0 &&
    !examFinished &&
    !hasAutoSubmittedRef.current;

  useEffect(() => {
    if (shouldAutoSubmit && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      handleFinishExamRef.current();
    }
  }, [shouldAutoSubmit]);


  if (isPreparing) {
    return <PreparingScreen />;
  }

  if (examFinished) {
    const scores = calculateScore(examDataToUse, answers);
    return (
      <ExamReportView
        examData={examDataToUse}
        scores={scores}
        answers={answers}
        questionTimes={questionTimes}
        formatQuestionTime={formatQuestionTime}
        renderFormattedText={renderFormattedText}
        onExit={() => navigate('/record')}
        activeReportTab={activeReportTab}
        setActiveReportTab={setActiveReportTab}
      />
    );
  }



  if (showTimeMode) {
    return (
      <TimeModeScreen
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        onStart={startExam}
      />
    );
  }

  if (showIntro) {
    return <IntroScreen onContinue={beginExam} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ExamHeader
        title={examDataToUse.title}
        timeMode={timeMode}
        timeRemaining={timeRemaining}
        hideTime={hideTime}
        showTimeAsIcon={showTimeAsIcon}
        formatTime={formatTime}
        directionsOpen={showDirections}
        onToggleDirections={() => setShowDirections(prev => !prev)}
        directionsContent={renderFormattedText(examDataToUse?.directions?.content, 'directions')}
        showReference={examDataToUse?.sectionCategory === 'SAT_MATH'}
        onOpenReference={() => setShowReference(true)}
        onShowTimeAsIcon={() => setShowTimeAsIcon(true)}
        onShowTimeAsText={() => setShowTimeAsIcon(false)}
        onToggleHideTime={() => setHideTime(!hideTime)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto p-3 sm:p-6">
          <div className={`grid gap-4 sm:gap-6 min-h-[calc(100vh-220px)] ${showNotesPanel ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 lg:grid-cols-8'}`}>
            <QuestionStemPanel
              currentQuestion={currentQuestion}
              totalQuestions={examDataToUse.totalQuestions}
              question={currentQ ? { ...currentQ, id: currentQuestion } : null}
              renderFormattedText={renderFormattedText}
              onTextSelect={handleTextSelection}
            />

            {showNotesPanel && (
              <QuestionNotesPanel
                notes={notes}
                currentQuestion={currentQuestion}
                expandedNotes={expandedNotes}
                onToggleNoteExpansion={toggleNoteExpansion}
                onDeleteNote={deleteNote}
              />
            )}

            <QuestionAnswerPanel
              question={currentQ ? { ...currentQ, id: currentQuestion } : null}
              currentQuestion={currentQuestion}
              answers={answers}
              setAnswers={setAnswers}
              handleAnswerSelect={handleAnswerSelect}
              handleTextSelection={handleTextSelection}
              renderFormattedText={renderFormattedText}
              formatText={formatText}
              columnClassName={showNotesPanel ? 'lg:col-span-4' : 'lg:col-span-3'}
            />
          </div>
        </div>
      </div>

      <ExamFooterBar
        isFirstQuestion={currentQuestion === 1}
        isLastQuestion={currentQuestion === examDataToUse.totalQuestions}
        onOpenProgress={() => setShowProgress(true)}
        onPrev={goToPrevious}
        onNext={goToNext}
        onEndExam={() => setShowEndExamModal(true)}
      />

      <div className="h-24"></div>

      <ProgressModal
        open={showProgress}
        examTitle={examDataToUse.title}
        totalQuestions={examDataToUse.totalQuestions}
        currentQuestion={currentQuestion}
        answers={answers}
        markedForReview={markedForReview}
        onClose={() => setShowProgress(false)}
        onGoToQuestion={goToQuestion}
        onEndExam={() => setShowEndExamModal(true)}
      />

      <NoteModal
        open={showNoteModal}
        selectedText={selectedText}
        onSave={saveNote}
        onCancel={() => {
          setShowNoteModal(false);
          setSelectedText('');
          if (window.getSelection()) window.getSelection().removeAllRanges();
        }}
      />

      {/* 高亮菜单 */}
      <div
          id="highlight-menu"
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-[9999]"
          style={{ display: 'none' }}
      >
        <div className="flex items-center space-x-2">
          <button
              onClick={() => addHighlight('yellow')}
              className="w-8 h-8 bg-yellow-200 rounded hover:bg-yellow-300 transition-colors border border-yellow-300"
              title="黄色高亮"
          ></button>
          <button
              onClick={() => addHighlight('green')}
              className="w-8 h-8 bg-green-200 rounded hover:bg-green-300 transition-colors border border-green-300"
              title="绿色高亮"
          ></button>
          <button
              onClick={() => addHighlight('blue')}
              className="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300 transition-colors border border-blue-300"
              title="蓝色高亮"
          ></button>
          <button
              onClick={() => addHighlight('pink')}
              className="w-8 h-8 bg-pink-200 rounded hover:bg-pink-300 transition-colors border border-pink-300"
              title="粉色高亮"
          ></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
              onClick={addUnderline}
              className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              title="添加下划线"
          >
            <i className="fas fa-underline"></i>
          </button>
          <button
              onClick={removeHighlight}
              className="px-2 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              title="删除高亮"
          >
            <i className="fas fa-eraser"></i>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
              onClick={addNote}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              title="添加备注"
          >
            <i className="fas fa-sticky-note mr-1"></i>备注
          </button>
        </div>
      </div>

      <ReferenceDrawer
        open={showReference}
        onClose={() => setShowReference(false)}
      />

      <SubmitSuccessModal
        open={showSubmitSuccessModal}
        onViewReport={handleViewReport}
      />

      <EndExamModal
        open={showEndExamModal}
        totalQuestions={examDataToUse?.totalQuestions ?? examData?.totalQuestions ?? 0}
        answeredCount={Object.entries(answers ?? {}).filter(([, val]) => {
          if (val == null) return false;
          if (typeof val === 'string') return val.trim() !== '';
          if (typeof val === 'object') {
            return Object.values(val).some(v => String(v ?? '').trim() !== '');
          }
          return false;
        }).length}
        timeMode={timeMode}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        onConfirm={handleFinishExam}
        onCancel={() => setShowEndExamModal(false)}
      />

    </div>
  );
}

export default ExamContent;