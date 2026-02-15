import { useState, useMemo } from 'react';

/**
 * 答题进度：当前题、答案、标记、单题用时、导航
 * @param {Object} examData - { questions, totalQuestions }
 * @returns 当前题、答案、导航与记录方法等
 */
export function useExamProgress(examData) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});

  const currentQ = useMemo(
    () => examData.questions.find((q) => q.id === currentQuestion),
    [examData.questions, currentQuestion]
  );

  const handleAnswerSelect = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion)) next.delete(currentQuestion);
      else next.add(currentQuestion);
      return next;
    });
  };

  const recordQuestionTime = (questionId) => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + timeSpent
    }));
    setQuestionStartTime(Date.now());
  };

  const goToQuestion = (questionNum) => {
    recordQuestionTime(currentQuestion);
    setCurrentQuestion(questionNum);
  };

  const goToPrevious = () => {
    if (currentQuestion > 1) {
      recordQuestionTime(currentQuestion);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < examData.totalQuestions) {
      recordQuestionTime(currentQuestion);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetOnBeginExam = () => {
    // 重置题目开始时间和耗时记录
    setQuestionStartTime(Date.now());
    setQuestionTimes({});
  };

  return {
    currentQuestion,
    setCurrentQuestion,
    currentQ,
    answers,
    setAnswers,
    markedForReview,
    toggleMarkForReview,
    questionStartTime,
    setQuestionStartTime,
    questionTimes,
    handleAnswerSelect,
    recordQuestionTime,
    goToQuestion,
    goToPrevious,
    goToNext,
    resetOnBeginExam
  };
}