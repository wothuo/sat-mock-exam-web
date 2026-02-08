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
import './ExamContent.css';

import PreparingScreen from './components/PreparingScreen';
import TimeModeScreen from './components/TimeModeScreen';
import IntroScreen from './components/IntroScreen';
import ExamReportView from './components/ExamReportView';
import DirectionsModal from './components/DirectionsModal';
import NoteModal from './components/NoteModal';
import ProgressModal from './components/ProgressModal';
import EndExamModal from './components/EndExamModal';
import ReferenceDrawer from './components/ReferenceDrawer';

function ExamContent() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showDirections, setShowDirections] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showTimeMode, setShowTimeMode] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [timeMode, setTimeMode] = useState('timed');
  const [timeRemaining, setTimeRemaining] = useState(34 * 60 + 55);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [examStarted, setExamStarted] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedText, setSelectedText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 });
  const [expandedNotes, setExpandedNotes] = useState(new Set());
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showTimeAsIcon, setShowTimeAsIcon] = useState(false);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [hideTime, setHideTime] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('All');
  const [showReference, setShowReference] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});

  useEffect(() => {
    if (isPreparing) {
      const timer = setTimeout(() => {
        setIsPreparing(false);
        setQuestionStartTime(Date.now());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPreparing]);

  useEffect(() => {
    if (examStarted && !isPreparing && !examFinished) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, examStarted, isPreparing, examFinished]);

  useEffect(() => {
    const containers = document.querySelectorAll('.selectable-text, .math-content');
    containers.forEach((c) => { c.style.visibility = 'hidden'; });

    const timer = setTimeout(() => {
      renderMathInContainers();
    }, 50);

    return () => clearTimeout(timer);
  }, [currentQuestion, showDirections, examFinished]);

  const formatText = (text) => {
    if (!text) return text;

    // 1. 保护数学公式 - 使用不含下划线的占位符，避免被 Markdown 斜体逻辑干扰
    const mathBlocks = [];
    let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 粗体与斜体
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // 处理无序列表 (以 • 开头的行)
    processed = processed.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•')) {
        return `<div class="flex items-start space-x-3 mb-2 ml-2">
          <span class="text-red-600 font-bold mt-0.5">•</span>
          <span class="flex-1">${trimmed.substring(1).trim()}</span>
        </div>`;
      }
      return line;
    }).join('\n');

    // 换行处理 (排除已经包含 div 的行，避免双重换行)
    processed = processed.split('\n').map(line => {
      if (line.includes('<div') || line.includes('<table') || line.includes('<tr') || line.includes('<td') || line.includes('<th')) {
        return line;
      }
      return line + '<br />';
    }).join('');
    
    // 3. 还原数学公式 - 使用 split/join 确保替换所有可能的占位符
    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
  };

  const handleTextSelection = (event) => {
    event.stopPropagation();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selectedText);
      setNotePosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      
      setTimeout(() => {
        const highlightMenu = document.getElementById('highlight-menu');
        if (highlightMenu) {
          highlightMenu.style.display = 'block';
          highlightMenu.style.left = `${Math.max(10, rect.left + rect.width / 2 - 100)}px`;
          highlightMenu.style.top = `${Math.max(10, rect.top + window.scrollY - 50)}px`;
          highlightMenu.style.zIndex = '9999';
        }
      }, 50);
    } else {
      hideHighlightMenu();
    }
  };

  const addHighlight = (color) => {
    if (selectedText) {
      const highlightId = `highlight-${Date.now()}`;
      setHighlights(prev => ({
        ...prev,
        [highlightId]: {
          text: selectedText,
          color: color,
          questionId: currentQuestion
        }
      }));
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const removeHighlight = () => {
    if (selectedText) {
      const highlightToRemove = Object.entries(highlights).find(([id, highlight]) => 
        highlight.text === selectedText && highlight.questionId === currentQuestion
      );
      
      if (highlightToRemove) {
        setHighlights(prev => {
          const newHighlights = { ...prev };
          delete newHighlights[highlightToRemove[0]];
          return newHighlights;
        });
      }
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const addUnderline = () => {
    if (selectedText) {
      const underlineId = `underline-${Date.now()}`;
      setHighlights(prev => ({
        ...prev,
        [underlineId]: {
          text: selectedText,
          color: 'underline',
          questionId: currentQuestion
        }
      }));
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const addNote = () => {
    if (selectedText) {
      setShowNoteModal(true);
      hideHighlightMenu();
    }
  };

  const saveNote = (noteText) => {
    if (selectedText && noteText && noteText.trim()) {
      const noteId = `note-${Date.now()}`;
      setNotes(prev => ({
        ...prev,
        [noteId]: {
          text: selectedText,
          note: noteText.trim(),
          questionId: currentQuestion,
          position: notePosition
        }
      }));
    }
    setShowNoteModal(false);
    setSelectedText('');
    if (window.getSelection()) window.getSelection().removeAllRanges();
  };

  const toggleNoteExpansion = (noteId) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
        removeNoteHighlight(noteId);
      } else {
        newSet.add(noteId);
        addNoteHighlight(noteId);
      }
      return newSet;
    });
  };

  const addNoteHighlight = (noteId) => {
    const note = notes[noteId];
    if (!note) return;
    
    const textElements = document.querySelectorAll('.selectable-text');
    textElements.forEach(element => {
      if (element.textContent.includes(note.text)) {
        const innerHTML = element.innerHTML;
        const highlightedHTML = innerHTML.replace(
          new RegExp(note.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<span class="note-highlight" data-note-id="${noteId}">${note.text}</span>`
        );
        element.innerHTML = highlightedHTML;
      }
    });
  };

  const removeNoteHighlight = (noteId) => {
    const highlightElements = document.querySelectorAll(`[data-note-id="${noteId}"]`);
    highlightElements.forEach(element => {
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
      parent.normalize();
    });
  };

  const deleteNote = (noteId) => {
    removeNoteHighlight(noteId);
    
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[noteId];
      return newNotes;
    });
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteId);
      return newSet;
    });
  };

  const hideHighlightMenu = () => {
    const highlightMenu = document.getElementById('highlight-menu');
    if (highlightMenu) {
      highlightMenu.style.display = 'none';
    }
  };

  const renderFormattedText = (text, questionId) => {
    let processedText = formatText(text);
    
    Object.entries(highlights).forEach(([id, highlight]) => {
      if (highlight.questionId === questionId) {
        const highlightClass = highlight.color === 'underline' ? 'text-underline' : `highlight-${highlight.color}`;
        processedText = processedText.replace(
          new RegExp(highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<span class="${highlightClass}" data-highlight-id="${id}">${highlight.text}</span>`
        );
      }
    });
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedText }}
        onMouseUp={handleTextSelection}
        className="selectable-text math-content"
      />
    );
  };

  React.useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('#highlight-menu') && !window.getSelection().toString()) {
        hideHighlightMenu();
      }
    };
    
    const handleSelectionChange = () => {
      if (!window.getSelection().toString()) {
        hideHighlightMenu();
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    if (!examStarted || timeMode === 'untimed') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeMode]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return examData.questions.find(q => q.id === currentQuestion);
  };

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const recordQuestionTime = (questionId) => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - questionStartTime) / 1000);
    
    setQuestionTimes(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + timeSpent
    }));
  };

  const goToQuestion = (questionNum) => {
    recordQuestionTime(currentQuestion);
    setCurrentQuestion(questionNum);
    setShowProgress(false);
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

  const currentQ = getCurrentQuestion();

  const startExam = () => {
    setShowTimeMode(false);
    setShowIntro(true);
  };

  const beginExam = () => {
    setExamStarted(true);
    setShowIntro(false);
    setQuestionStartTime(Date.now());
  };

  const handleFinishExam = () => {
    recordQuestionTime(currentQuestion);
    setExamFinished(true);
    setShowEndExamModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatQuestionTime = (seconds) => {
    if (!seconds) return '0秒';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}秒`;
    return `${mins}分${secs}秒`;
  };

  const calculateScore = () => {
    const total = examData.totalQuestions;
    const answered = Object.keys(answers).length;
    const correct = examData.questions.filter(q => {
      if (q.type === 'multiple-choice' || q.type === 'reading-passage' || q.type === 'table-question' || q.type === 'complex-table' || q.type === 'multiple-choice-with-image') {
        return answers[q.id] === q.correctAnswer;
      }
      return false; // 简化逻辑，填空题暂不自动判分
    }).length;
    
    // 模拟 SAT 评分逻辑 (400-1600)
    const baseScore = 400;
    const rwScore = 200 + Math.round((correct / total) * 600 * 0.6);
    const mathScore = 200 + Math.round((correct / total) * 600 * 0.4);
    
    return {
      total: rwScore + mathScore,
      rw: rwScore,
      math: mathScore,
      correct,
      incorrect: answered - correct,
      omitted: total - answered
    };
  };

  if (isPreparing) {
    return <PreparingScreen />;
  }

  if (examFinished) {
    const scores = calculateScore();
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-3 sm:py-5 z-40">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600 text-sm"></i>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">张同学</div>
            </div>
          </div>
          
          <Space size="small" className="w-full sm:w-auto justify-between sm:justify-end">
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setShowProgress(true)}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden xs:inline">Progress</span>
            </Button>
            <Button
              icon={<LeftOutlined />}
              onClick={goToPrevious}
              disabled={currentQuestion === 1}
              type="primary"
            >
              Back
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={goToNext}
              disabled={currentQuestion === examData.totalQuestions}
              type="primary"
            >
              Next
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndExamModal(true)}
            >
              结束考试
            </Button>
          </Space>
        </div>
      </div>

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

