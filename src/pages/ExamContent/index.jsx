import React, { useEffect, useState, useMemo } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { Button, Space } from 'antd';

import {
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined
} from '@ant-design/icons';

import { answerOfSection, finishAnswer } from '../../services/exam';

import { ReferenceDrawer } from './components/drawers';
import {
  ExamHeader,
  ExamFooterBar,
  QuestionStemPanel,
  QuestionAnswerPanel,
  QuestionNotesPanel
} from './components/layout';
import {
  DirectionsModal,
  NoteModal,
  ProgressModal,
  EndExamModal
} from './components/modals';
import {
  PreparingScreen,
  TimeModeScreen,
  IntroScreen,
  ExamReportView
} from './components/screens';
import { examData } from './examData';
import { useExamProgress } from './hooks/useExamProgress';
import { useExamTimer } from './hooks/useExamTimer';
import { useHighlightAndNotes } from './hooks/useHighlightAndNotes';
import { renderMathInContainers } from './renderMath';
import { calculateScore } from './utils/examScore';
import { formatText } from './utils/formatText';
import { formatQuestionTime } from './utils/formatTime';
import './ExamContent.css';


const INITIAL_TIME_SEC = 34 * 60 + 55;

function ExamContent() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 使用useMemo缓存路由状态，避免无限重渲染
  const { sectionId, examTitle, examDuration, totalQuestions } = useMemo(() => {
    const state = location.state || {};
    return {
      sectionId: state.sectionId || examId,
      examTitle: state.examTitle || 'Section 1, Module 1: Reading and Writing',
      examDuration: state.examDuration || '35分钟',
      totalQuestions: state.totalQuestions || 27
    };
  }, [location.state, examId]); // 只有当location.state或examId变化时才重新计算
  
  // 真实题目数据状态
  const [realExamData, setRealExamData] = useState(null);
  const [originalServerData, setOriginalServerData] = useState(null); // 保存原始服务端数据
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 获取真实题目数据
  useEffect(() => {
    // 如果已经有数据，避免重复请求
    if (realExamData) {
      console.log('已有真实数据，跳过请求');
      return;
    }
    
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
        const transformedData = {
          title: examTitle,
          totalQuestions: totalQuestions,
          directions: {
            title: 'Directions',
            content: `The questions in this section address a number of important reading and writing skills.
Use of a calculator is not permitted for this section. These directions can be accessed throughout the test.

**For multiple-choice questions**, solve each problem and choose the correct answer from the choices provided.
Each multiple-choice question has a single correct answer.

**For student-produced response questions:**
• If you find more than one correct answer, enter only one answer.
• You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.
• If your answer is a fraction that doesn't fit in the provided space, enter the decimal equivalent.
• If your answer is a decimal that doesn't fit in the provided space, enter it by truncating or rounding at the fourth digit.`
          },
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
                // 适配两种可能的选项格式
                if (Array.isArray(parsedOptions)) {
                  // 格式: [{"option": "A", "content": "Rare"}, ...]
                  options = parsedOptions.map(opt => {
                    return `${opt.option}) ${opt.content}`;
                  });
                } else if (typeof parsedOptions === 'object') {
                  // 格式: {"A": "Rare", "B": "Common", ...}
                  options = Object.entries(parsedOptions).map(([key, value]) => `${key}) ${value}`);
                }
              } catch (e) {
                console.warn('Failed to parse options JSON:', questionObj.options);
                // 尝试直接使用字符串格式的选项
                if (typeof questionObj.options === 'string') {
                  options = questionObj.options.split(',').map(opt => opt.trim());
                }
              }
            }
            
            // 根据题目类型确定题型 - 适配实际的类型值
            let questionType = 'multiple-choice';
            if (questionObj?.questionType === 'BLANK' || questionObj?.questionType === 'blank') {
              questionType = 'student-produced';
            } else if (questionObj?.questionType === 'choice') {
              questionType = 'multiple-choice';
            }
            
            // 改进题目内容处理逻辑 - 正确访问嵌套的question对象
            const questionContent = questionObj?.questionContent || 
                                  questionObj?.question || 
                                  questionObj?.content || 
                                  `题目 ${index + 1} 内容加载中...`;
            
            return {
              id: index + 1, // 使用索引作为ID，确保与currentQuestion匹配
              originalId: questionObj?.questionId, // 保存原始ID用于后续处理
              type: questionType,
              question: questionContent,
              description: questionObj?.questionDescription || '',
              options: options,
              correctAnswer: questionObj?.answer || '',
              analysis: questionObj?.analysis || '',
              difficulty: questionObj?.difficulty || 'Medium',
              category: questionObj?.questionCategory || 'MATH',
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
  }, [sectionId, realExamData]); // 依赖sectionId和realExamData，避免重复请求

  const [showDirections, setShowDirections] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showTimeMode, setShowTimeMode] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [timeMode, setTimeMode] = useState('timed');
  const [examStarted, setExamStarted] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showTimeAsIcon, setShowTimeAsIcon] = useState(false);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [hideTime, setHideTime] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('All');
  const [showReference, setShowReference] = useState(false);

  const examDataToUse = realExamData || examData;
  
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

  const { timeRemaining, formatTime } = useExamTimer(examStarted, timeMode, INITIAL_TIME_SEC);

  const highlightNotes = useHighlightAndNotes(currentQuestion);
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
    renderFormattedText
  } = highlightNotes;

  useEffect(() => {
    if (isPreparing) {
      const timer = setTimeout(() => {
        setIsPreparing(false);
        resetOnBeginExam();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPreparing, resetOnBeginExam]);

  useEffect(() => {
    const containers = document.querySelectorAll('.selectable-text, .math-content');
    containers.forEach((c) => { c.style.visibility = 'hidden'; });
    const timer = setTimeout(() => renderMathInContainers(), 50);
    return () => clearTimeout(timer);
  }, [currentQuestion, showDirections, examFinished]);

  const goToQuestion = (num) => {
    progressGoToQuestion(num);
    setShowProgress(false);
  };

  const startExam = () => {
    setShowTimeMode(false);
    setShowIntro(true);
  };

  const beginExam = () => {
    setExamStarted(true);
    setShowIntro(false);
    resetOnBeginExam();
  };

  // 使用Ref来追踪最新的questionTimes状态
  const questionTimesRef = React.useRef(questionTimes);
  useEffect(() => {
    // 当questionTimes更新时，同步更新Ref
    questionTimesRef.current = questionTimes;
  }, [questionTimes]);

  const handleFinishExam = async () => {
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
          const userAnswer = answers[localQuestion?.id || i + 1] || '';

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

    } catch (error) {
      console.error('提交作答数据时发生错误:', error);
    } finally {
      setExamFinished(true);
      setShowEndExamModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  if (isPreparing) {
    return <PreparingScreen />;
  }

  if (examFinished) {
    const scores = calculateScore(examDataToUse, answers);
    return (
      <ExamReportView
        examData={examDataToUse}  // 修复：使用真实作答数据而不是模拟数据
        scores={scores}
        answers={answers}
        questionTimes={questionTimes}
        formatQuestionTime={formatQuestionTime}
        renderFormattedText={renderFormattedText}
        onExit={() => navigate('/practice-record')}
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
        onOpenDirections={() => setShowDirections(true)}
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
        isLastQuestion={currentQuestion === examData.totalQuestions}
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

      <DirectionsModal
        open={showDirections}
        title={examData.directions.title}
        content={renderFormattedText(examData.directions.content, 'directions')}
        onClose={() => setShowDirections(false)}
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

      <ReferenceDrawer
        open={showReference}
        onClose={() => setShowReference(false)}
      />

      <EndExamModal
        open={showEndExamModal}
        totalQuestions={examData.totalQuestions}
        answeredCount={Object.keys(answers).length}
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