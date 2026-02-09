import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import {
  BarChartOutlined,
  ClockCircleOutlined,
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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">{examData.title}</h1>
            <Button
              type="link"
              onClick={() => setShowDirections(true)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center"
            >
              <i className="fas fa-info-circle mr-1.5 text-xs"></i>
              <span className="underline underline-offset-4">Directions</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-6">
            {timeMode === 'timed' && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                {!hideTime && (
                  <div className="flex items-center">
                    {showTimeAsIcon ? (
                      <Button
                        type="text"
                        icon={<ClockCircleOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setShowTimeAsIcon(false)}
                        title={`剩余时间: ${formatTime(timeRemaining)}`}
                        className="flex items-center justify-center p-0 h-auto text-gray-700"
                      />
                    ) : (
                      <Button
                        type="text"
                        onClick={() => setShowTimeAsIcon(true)}
                        className="text-xl font-mono font-black text-gray-800 p-0 h-auto leading-none hover:text-red-600 transition-colors"
                        title="点击切换为图标显示"
                      >
                        {formatTime(timeRemaining)}
                      </Button>
                    )}
                  </div>
                )}
                {hideTime && (
                  <ClockCircleOutlined style={{ fontSize: '20px', color: '#9ca3af' }} />
                )}
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <Button 
                  size="small"
                  onClick={() => setHideTime(!hideTime)}
                  className="h-7 px-3 rounded-lg bg-white border-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-wider hover:text-red-600 hover:border-red-200 transition-all shadow-none"
                >
                  {hideTime ? 'Show' : 'Hide'}
                </Button>
              </div>
            )}
            {timeMode === 'untimed' && (
              <div className="text-lg font-medium text-gray-600">
                Untimed Practice
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowReference(true)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Reference
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800">More</button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <i className="fas fa-times"></i>
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto p-3 sm:p-6">
          <div className={`grid gap-4 sm:gap-6 min-h-[calc(100vh-220px)] ${showNotesPanel ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 lg:grid-cols-8'}`}>
            <div className={`col-span-1 lg:col-span-5 bg-white rounded-lg p-4 sm:p-6 shadow-sm relative flex flex-col`}>
              <div className="pb-4 mb-6">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestion} of {examData.totalQuestions}
                </span>
              </div>
              
              {currentQ && (
                <div className="space-y-6 flex-1">
                  <div 
                    className="text-lg font-medium text-gray-900 selectable-text"
                    onMouseUp={handleTextSelection}
                  >
                    {renderFormattedText(currentQ.question, currentQuestion)}
                  </div>
                  
                  {currentQ.description && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm font-semibold text-blue-900 mb-2">
                        <i className="fas fa-info-circle mr-2"></i>问题描述
                      </div>
                      <div className="text-sm text-blue-800 leading-relaxed">
                        {renderFormattedText(currentQ.description, currentQuestion)}
                      </div>
                    </div>
                  )}
                  
                  {currentQ.type === 'reading-passage' && currentQ.passage && (
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="prose max-w-none text-gray-700 leading-relaxed text-sm">
                        {renderFormattedText(currentQ.passage, currentQuestion)}
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'multiple-choice-with-image' || 
                    currentQ.type === 'student-produced-with-image' || 
                    currentQ.type === 'image-with-blanks') && currentQ.image && (
                    <div>
                      <img
                        src={currentQ.image}
                        alt={currentQ.imageAlt || 'Question image'}
                        className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  {(currentQ.type === 'table-question' || currentQ.type === 'complex-table') && (
                    <div className="overflow-x-auto">
                      {currentQ.table.title && (
                        <div className="mb-4 text-center font-semibold text-gray-900 text-sm">
                          {renderFormattedText(currentQ.table.title, currentQuestion)}
                        </div>
                      )}
                      
                      <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            {currentQ.table.headers.map((header, index) => (
                            <th key={index} className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-900">
                              {renderFormattedText(header, currentQuestion)}
                            </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentQ.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-300 px-2 py-1 text-gray-700">
                                {renderFormattedText(cell, currentQuestion)}
                              </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {showNotesPanel && (
              <div className="col-span-1 lg:col-span-3 bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col">
                <div className="space-y-4 flex-1">
                  {Object.entries(notes)
                    .filter(([noteId, note]) => note.questionId === currentQuestion)
                    .map(([noteId, note], index) => (
                      <div
                        key={noteId}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 transition-all duration-300"
                      >
                        {expandedNotes.has(noteId) ? (
                          <div>
                            <div className="text-sm text-gray-700 mb-3 p-3 bg-yellow-100 rounded-md border-l-3 border-yellow-400">
                              "{note.text}"
                            </div>
                            <div className="text-sm text-gray-800 leading-relaxed mb-3">{note.note}</div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => toggleNoteExpansion(noteId)}
                                className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                                title="收起"
                              >
                                <i className="fas fa-chevron-up"></i>
                              </button>
                              <button
                                onClick={() => deleteNote(noteId)}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="删除备注"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center h-6">
                            <i className="fas fa-sticky-note text-yellow-600 text-base mr-3 flex-shrink-0"></i>
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="text-sm text-yellow-700 font-medium truncate">
                                {note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                onClick={() => toggleNoteExpansion(noteId)}
                                className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                                title="展开备注"
                              >
                                <i className="fas fa-chevron-down"></i>
                              </button>
                              <button
                                onClick={() => deleteNote(noteId)}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="删除备注"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  
                  {Object.entries(notes).filter(([noteId, note]) => note.questionId === currentQuestion).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <i className="fas fa-sticky-note text-3xl mb-3"></i>
                      <p className="text-sm">暂无备注</p>
                      <p className="text-sm mt-2">选中文字后可添加备注</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`col-span-1 ${showNotesPanel ? 'lg:col-span-4' : 'lg:col-span-3'} bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col`}>
              {currentQ && (
                <div className="space-y-6">
                  {currentQ.description && (
                    <div className="mb-6">
                      <div className="text-base text-gray-900 leading-relaxed">
                        {renderFormattedText(currentQ.description, currentQuestion)}
                      </div>
                    </div>
                  )}
                  
                  {(currentQ.type === 'multiple-choice' || 
                    currentQ.type === 'multiple-choice-with-image' || 
                    currentQ.type === 'reading-passage') && (
                    <div className="space-y-4">
                      {currentQ.type === 'reading-passage' && currentQ.followUpQuestion && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg">
                          <div className="font-medium text-gray-900 mb-4">
                            {renderFormattedText(currentQ.followUpQuestion, currentQuestion)}
                          </div>
                        </div>
                      )}
                      
                  {(currentQ.options || (currentQ.type === 'reading-passage' && currentQ.options))?.map((option, index) => (
                    <label 
                      key={index} 
                      className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
                    >
                      <div className="modern-radio">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option.charAt(0)}
                          checked={answers[currentQuestion] === option.charAt(0)}
                          onChange={(e) => handleAnswerSelect(e.target.value)}
                        />
                        <div className="modern-radio-circle"></div>
                      </div>
                      <div 
                        className="radio-text flex-1 selectable-text"
                        onMouseUp={handleTextSelection}
                      >
                        {renderFormattedText(option, currentQuestion)}
                      </div>
                    </label>
                  ))}
                    </div>
                  )}

                  {(currentQ.type === 'student-produced' || currentQ.type === 'student-produced-with-image') && (
                    <div className="space-y-6">
                      <div className="text-gray-700">
                        {renderFormattedText(currentQ.answerFormat, currentQuestion)}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={answers[currentQuestion] || ''}
                          onChange={(e) => handleAnswerSelect(e.target.value)}
                          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter your answer"
                        />
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'fill-in-blanks' || currentQ.type === 'image-with-blanks') && (
                    <div className="space-y-6">
                      <div className="text-gray-700 text-base leading-relaxed">
                        {currentQ.content && (
                          <div className="mb-4">
                            {currentQ.content.split('_____').map((part, index, array) => (
                              <span key={index}>
                                <span dangerouslySetInnerHTML={{ __html: formatText(part) }} onMouseUp={handleTextSelection} />
                                {index < array.length - 1 && (
                                  <input
                                    type="text"
                                    value={answers[currentQuestion]?.[currentQ.blanks[index]?.id] || ''}
                                    onChange={(e) => {
                                      const newAnswers = { ...answers };
                                      if (!newAnswers[currentQuestion]) {
                                        newAnswers[currentQuestion] = {};
                                      }
                                      newAnswers[currentQuestion][currentQ.blanks[index].id] = e.target.value;
                                      setAnswers(newAnswers);
                                    }}
                                    className="inline-block w-32 mx-2 px-2 py-1 border-b-2 border-red-500 focus:outline-none focus:border-red-700 text-center"
                                    placeholder={currentQ.blanks[index]?.placeholder}
                                  />
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'table-question' || currentQ.type === 'complex-table') && (
                    <div className="space-y-4">
                      {currentQ.options.map((option, index) => (
                        <label 
                          key={index} 
                          className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
                        >
                          <div className="modern-radio">
                            <input
                              type="radio"
                              name={`question-${currentQuestion}`}
                              value={option.charAt(0)}
                              checked={answers[currentQuestion] === option.charAt(0)}
                              onChange={(e) => handleAnswerSelect(e.target.value)}
                            />
                            <div className="modern-radio-circle"></div>
                          </div>
                          <div className="radio-text flex-1">
                            {renderFormattedText(option, currentQuestion)}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Answer Preview:</div>
                    <div className="text-base font-medium text-gray-900">
                      {currentQ.type === 'fill-in-blanks' || currentQ.type === 'image-with-blanks' ? (
                        <div className="space-y-2">
                          {currentQ.blanks?.map((blank, index) => (
                            <div key={blank.id} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{blank.placeholder}:</span>
                              <span className="font-mono">
                                {answers[currentQuestion]?.[blank.id] || 'Not answered'}
                              </span>
                            </div>
                          )) || 'No blanks filled'}
                        </div>
                      ) : (
                        answers[currentQuestion] || 'No answer selected'
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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

