import React, { useEffect } from 'react';

function QuestionDetailModal({ question, onClose }) {
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
    
    // 1. 保护数学公式
    const mathBlocks = [];
    let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 处理 Markdown
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* 头部：科目、难度、题集名、日期、耗时 */}
        <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Analysis</span>
            {question.subject && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{question.subject}</span>
            )}
            {question.difficulty && (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">{question.difficulty}</span>
            )}
            {question.questionType && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.questionType}</span>
            )}
            {question.score != null && question.score !== '' && (
              <span className="text-gray-500 text-xs font-medium">分值 {question.score}</span>
            )}
            <h3 className="text-lg font-bold text-gray-900 truncate max-w-md">{question.title ?? question.taskName}</h3>
            {question.date && (
              <span className="text-gray-500 text-xs">
                <i className="far fa-calendar-alt mr-1"></i>
                {question.date}
              </span>
            )}
            {(question.timeSpent != null && question.timeSpent !== '') && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-clock mr-1"></i>
                {formatQuestionTime(question.timeSpent)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        {/* 内容 */}
        <div id="modal-math-content" className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 左侧：题目描述、题干、阅读段落 */}
            <div className="space-y-6">
              {question.questionDescription && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">考查点</span>
                  <div className="mt-1 text-sm text-gray-600 leading-relaxed">{question.questionDescription}</div>
                </div>
              )}
              {questionText && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">题目</span>
                  <div className="mt-1 text-lg font-medium text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(questionText) }}></div>
                </div>
              )}
              {question.passage && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">阅读段落</span>
                  <div className="mt-1 p-6 bg-gray-50 rounded-2xl border-l-4 border-red-500 text-gray-700 italic text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(question.passage) }}></div>
                </div>
              )}
            </div>

            {/* 右侧：选项（若有）或 你的答案/正确答案 对比 + 解析 */}
            <div className="space-y-6">
              {hasOptions ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">选项</span>
                  <div className="space-y-2 mt-1">
                    {optionsList.map((opt, i) => {
                      const optChar = isOptionObject ? (opt.option ?? '').trim() : (typeof opt === 'string' ? opt.charAt(0) : opt);
                      const isUserChoice = question.userAnswer === optChar;
                      const isCorrectOpt = question.correctAnswer === optChar;
                      const optLabel = isOptionObject ? (opt.content ?? '') : (typeof opt === 'string' && opt.length > 2 ? opt.substring(opt.indexOf(')') + 1).trim() : opt);
                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isCorrectOpt ? 'border-blue-500 bg-blue-50' : isUserChoice ? 'border-red-500 bg-red-50' : 'border-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCorrectOpt ? 'bg-blue-500 text-white' : isUserChoice ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {optChar}
                            </div>
                            <div className="text-gray-800 flex-1 text-sm" dangerouslySetInnerHTML={{ __html: formatText(optLabel) }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                    <span className="font-bold text-gray-700 text-sm">作答结果</span>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">你的答案</span>
                      <div className="mt-1 text-xl font-black text-gray-900">{question.userAnswer ?? '—'}</div>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">正确答案</span>
                      <div className="mt-1 text-xl font-black text-gray-900">{question.correctAnswer ?? '—'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 正确答案与解析 */}
              <div className="border-2 border-red-100 rounded-2xl overflow-hidden">
                <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center">
                  <i className="fas fa-lightbulb text-red-500 mr-2"></i>
                  <span className="font-bold text-red-700 text-sm">Correct Answer & Analysis</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correct Answer</span>
                    <div className="text-2xl font-black text-gray-900">{question.correctAnswer ?? '—'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">解析</span>
                    <div className="mt-2 text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(explanationText) || '<span class="text-gray-400">暂无解析</span>' }}></div>
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