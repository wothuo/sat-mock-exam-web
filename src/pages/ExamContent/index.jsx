import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import {
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined
} from '@ant-design/icons';

import { examData } from './examData';
import { renderMathInContainers } from './renderMath';
import { formatQuestionTime } from './utils/formatTime';
import { calculateScore } from './utils/examScore';
import { formatText } from './utils/formatText';
import { useExamTimer } from './hooks/useExamTimer';
import { useExamProgress } from './hooks/useExamProgress';
import { useHighlightAndNotes } from './hooks/useHighlightAndNotes';
import './ExamContent.css';

import {
  PreparingScreen,
  TimeModeScreen,
  IntroScreen,
  ExamReportView
} from './components/screens';
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
import { ReferenceDrawer } from './components/drawers';

const INITIAL_TIME_SEC = 34 * 60 + 55;

function ExamContent() {
  const { examId } = useParams();
  const navigate = useNavigate();

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

  const progress = useExamProgress(examData);
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

  const handleFinishExam = () => {
    recordQuestionTime(currentQuestion);
    setExamFinished(true);
    setShowEndExamModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isPreparing) {
    return <PreparingScreen />;
  }

  if (examFinished) {
    const scores = calculateScore(examData, answers);
    return (
      <ExamReportView
        examData={examData}
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
        title={examData.title}
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
              totalQuestions={examData.totalQuestions}
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
        examTitle={examData.title}
        totalQuestions={examData.totalQuestions}
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

