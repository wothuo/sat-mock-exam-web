import React, { useEffect, useState } from 'react';
import { SUBJECT_CATEGORY_LABELS, DIFFICULTY_LABELS } from '../../ExamSetEntry/examSetEntryConstants';

function QuestionDetailModal({ question, onClose }) {
  const [isQuestionContentExpanded, setIsQuestionContentExpanded] = useState(false);
  const [isQuestionDescriptionExpanded, setIsQuestionDescriptionExpanded] = useState(false);
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  useEffect(() => {
    if (window.renderMathInElement) {
      const container = document.getElementById('modal-math-content');
      if (container) {
        window.renderMathInElement(container, {
          delimiters: [
            {left: '$', right: '$', display: false},
            {left: '$$', right: '$$', display: true}
          ],
          throwOnError: false
        });
      }
    }
  }, [question]);

  if (!question) return null;

  const formatQuestionTime = (seconds) => {
    if (!seconds) return '未记录';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}秒`;
    return `${mins}分${secs}秒`;
  };

  const formatText = (text) => {
    if (!text) return text;

    // 0. 处理长连续字符串（如哈希值）
    if (text.length > 50 && !text.includes(' ') && !text.includes('\n')) {
      // 如果是长连续字符串，添加换行符
      const chunkSize = 64;
      let processed = '';
      for (let i = 0; i < text.length; i += chunkSize) {
        processed += text.slice(i, i + chunkSize) + '\n';
      }
      text = processed.trim();
    }

    // 1. 保护数学公式
    const mathBlocks = [];
    let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 处理 Markdown 和 HTML 标签
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
    processed = processed.replace(/\n/g, '<br />');

    // 3. 还原数学公式
    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
  };

  const questionText = question.question ?? question.questionContent ?? '';
  const optionsList = Array.isArray(question.options) ? question.options : [];
  const hasOptions = optionsList.length > 0;
  const isOptionObject = hasOptions && typeof optionsList[0] === 'object' && optionsList[0] !== null && 'option' in optionsList[0];
  const isCorrect = question.userAnswer === question.correctAnswer;
  const explanationText = question.explanation ?? question.analysis ?? '';

  // 映射英文值为中文显示
  const getDisplaySubject = (subject) => SUBJECT_CATEGORY_LABELS[subject] || subject;
  const getDisplayDifficulty = (difficulty) => DIFFICULTY_LABELS[difficulty] || difficulty;
  const getDisplayQuestionType = (questionType) => {
    const typeMap = {
      'CHOICE': '选择题',
      'BLANK': '填空题'
    };
    return typeMap[questionType] || questionType;
  };

  return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
          {/* 头部：科目、难度、题集名、日期、耗时 */}
          <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Analysis</span>
              {question.subject && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{getDisplaySubject(question.subject)}</span>
              )}
              {question.difficulty && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">{getDisplayDifficulty(question.difficulty)}</span>
              )}
              {question.questionType && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{getDisplayQuestionType(question.questionType)}</span>
              )}
              {/*{question.score != null && question.score !== '' && (*/}
              {/*  <span className="text-gray-500 text-xs font-medium">分值 {question.score}</span>*/}
              {/*)}*/}
              {(question.timeSpent != null && question.timeSpent !== '') && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-clock mr-1"></i>
                    {formatQuestionTime(question.timeSpent)}
              </span>
              )}
              {question.date && (
                  <span className="text-gray-500 text-sm">
                <i className="far fa-calendar-alt mr-1"></i>
                    {question.date}
              </span>
              )}
              <h3 className="text-sm font-medium text-gray-500 truncate max-w-md">
                <span className="font-semibold">Source: </span>
                {question.title ?? question.taskName}
              </h3>
            </div>
            {/*<button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">*/}
            {/*  <i className="fas fa-times text-gray-400"></i>*/}
            {/*</button>*/}
          </div>

          {/* 内容 */}
          <div id="modal-math-content" className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* 左侧：题目描述、题干、阅读段落 */}
              <div className="space-y-6">
                {questionText && (
                    <div className="border-2 border-blue-100 rounded-2xl overflow-hidden">
                      <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-question-circle text-blue-500 mr-2"></i>
                          <span className="font-bold text-blue-700 text-sm">题目内容</span>
                        </div>
                        {questionText.length > 200 && (
                            <button
                                onClick={() => setIsQuestionContentExpanded(!isQuestionContentExpanded)}
                                className="text-blue-500 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                            >
                              {isQuestionContentExpanded ? (
                                  <>
                                    <i className="fas fa-chevron-up"></i>
                                    收起
                                  </>
                              ) : (
                                  <>
                                    <i className="fas fa-chevron-down"></i>
                                    展开
                                  </>
                              )}
                            </button>
                        )}
                      </div>
                      <div className={`p-6 transition-all duration-300 ${isQuestionContentExpanded || questionText.length <= 200 ? 'max-h-none' : 'max-h-40 overflow-hidden'}`}>
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-medium max-h-96 overflow-y-auto break-all">{questionText}</div>
                        {!isQuestionContentExpanded && questionText.length > 200 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                )}
                {question.questionDescription && (
                    <div className="border-2 border-green-100 rounded-2xl overflow-hidden">
                      <div className="bg-green-50 px-6 py-3 border-b border-green-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-info-circle text-green-500 mr-2"></i>
                          <span className="font-bold text-green-700 text-sm">题目描述</span>
                        </div>
                        {question.questionDescription.length > 200 && (
                            <button
                                onClick={() => setIsQuestionDescriptionExpanded(!isQuestionDescriptionExpanded)}
                                className="text-green-500 hover:text-green-700 text-xs font-medium flex items-center gap-1"
                            >
                              {isQuestionDescriptionExpanded ? (
                                  <>
                                    <i className="fas fa-chevron-up"></i>
                                    收起
                                  </>
                              ) : (
                                  <>
                                    <i className="fas fa-chevron-down"></i>
                                    展开
                                  </>
                              )}
                            </button>
                        )}
                      </div>
                      <div className={`p-6 transition-all duration-300 relative ${isQuestionDescriptionExpanded || question.questionDescription.length <= 200 ? 'max-h-none' : 'max-h-40 overflow-hidden'}`}>
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-medium max-h-96 overflow-y-auto break-all">{question.questionDescription}</div>
                        {!isQuestionDescriptionExpanded && question.questionDescription.length > 200 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                )}
                {question.passage && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">阅读段落</span>
                      <div className="mt-1 p-6 bg-gray-50 rounded-2xl border-l-4 border-red-500 text-gray-700 italic text-sm leading-relaxed max-h-64 overflow-y-auto break-all" dangerouslySetInnerHTML={{ __html: formatText(question.passage) }}></div>
                    </div>
                )}
              </div>

              {/* 右侧：选项（若有）或 你的答案/正确答案 对比 + 解析 */}
              <div className="space-y-6">
                {hasOptions ? (
                    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-list-ol text-gray-500 mr-2"></i>
                          <span className="font-bold text-gray-700 text-sm">选项内容</span>
                        </div>
                        {optionsList.length > 3 && (
                            <button
                                onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
                                className="text-gray-500 hover:text-gray-700 text-xs font-medium flex items-center gap-1"
                            >
                              {isOptionsExpanded ? (
                                  <>
                                    <i className="fas fa-chevron-up"></i>
                                    收起
                                  </>
                              ) : (
                                  <>
                                    <i className="fas fa-chevron-down"></i>
                                    展开
                                  </>
                              )}
                            </button>
                        )}
                      </div>
                      <div className={`p-6 space-y-3 transition-all duration-300 min-h-40 relative ${isOptionsExpanded || optionsList.length <= 3 ? 'max-h-none' : 'max-h-40 overflow-hidden'}`}>
                        {optionsList.map((opt, i) => {
                          const optChar = isOptionObject ? (opt.option ?? '').trim() : (typeof opt === 'string' ? opt.charAt(0) : opt);
                          const isUserChoice = question.userAnswer === optChar;
                          const isCorrectOpt = question.correctAnswer === optChar;
                          const optLabel = isOptionObject ? (opt.content ?? '') : (typeof opt === 'string' && opt.length > 2 ? opt.substring(opt.indexOf(')') + 1).trim() : opt);
                          return (
                              <div
                                  key={i}
                                  className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                                      isCorrectOpt ? 'border-blue-500 bg-blue-50/80' : isUserChoice ? 'border-red-500 bg-red-50/80' : 'border-gray-200 bg-white/80'
                                  }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${
                                      isCorrectOpt ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                                          isUserChoice ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' :
                                              'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                                  }`}>
                                    {optChar}
                                  </div>
                                  <div className="text-gray-800 flex-1 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(optLabel) }}></div>
                                  {isCorrectOpt && (
                                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <i className="fas fa-check text-white text-xs"></i>
                                      </div>
                                  )}
                                  {isUserChoice && !isCorrectOpt && (
                                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <i className="fas fa-times text-white text-xs"></i>
                                      </div>
                                  )}
                                </div>
                              </div>
                          );
                        })}
                        {!isOptionsExpanded && optionsList.length > 3 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                ) : (
                    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center">
                        <i className="fas fa-clipboard-check text-gray-500 mr-2"></i>
                        <span className="font-bold text-gray-700 text-sm">作答结果</span>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">你的答案</span>
                          <div className="mt-1 text-sm font-black text-gray-900 break-all">{question.userAnswer ?? '—'}</div>
                        </div>
                        <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">正确答案</span>
                          <div className="mt-1 text-sm font-black text-gray-900 break-all">{question.correctAnswer ?? '—'}</div>
                        </div>
                      </div>
                    </div>
                )}

                {/* 正确答案与解析 */}
                <div className="border-2 border-red-100 rounded-2xl overflow-hidden">
                  <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-lightbulb text-red-500 mr-2"></i>
                      <span className="font-bold text-red-700 text-sm">Correct Answer & Analysis</span>
                    </div>
                    {explanationText && explanationText.length > 200 && (
                        <button
                            onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                        >
                          {isAnalysisExpanded ? (
                              <>
                                <i className="fas fa-chevron-up"></i>
                                收起
                              </>
                          ) : (
                              <>
                                <i className="fas fa-chevron-down"></i>
                                展开
                              </>
                          )}
                        </button>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Correct Answer</span>
                      <div className="text-sm font-black text-gray-900 break-words">{question.correctAnswer ?? '—'}</div>
                    </div>
                    <div className={`transition-all duration-300 relative ${isAnalysisExpanded || !explanationText || explanationText.length <= 200 ? 'max-h-none' : 'max-h-32 overflow-hidden'}`}>
                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">解析</span>
                      <div className="mt-2 text-gray-700 text-sm leading-relaxed break-all" dangerouslySetInnerHTML={{ __html: formatText(explanationText) || '<span class="text-gray-400">暂无解析</span>' }}></div>
                      {!isAnalysisExpanded && explanationText && explanationText.length > 200 && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部 */}
          <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button onClick={onClose} className="bg-gray-900 text-white px-8 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">
              Close Analysis
            </button>
          </div>
        </div>
      </div>
  );
}

export default QuestionDetailModal;