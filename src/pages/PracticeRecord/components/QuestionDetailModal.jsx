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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* 头部 */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Analysis</span>
            <h3 className="text-lg font-bold text-gray-900 truncate max-w-md">{question.title}</h3>
            {question.timeSpent && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-clock mr-1"></i>
                {formatQuestionTime(question.timeSpent)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        {/* 内容 */}
        <div id="modal-math-content" className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 左侧：题目 */}
            <div className="space-y-6">
              <div className="text-xl font-medium text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(question.question) }}></div>
              {question.passage && (
                <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-red-500 text-gray-700 italic text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(question.passage) }}></div>
              )}
            </div>

            {/* 右侧：选项与解析 */}
            <div className="space-y-6">
              <div className="space-y-3">
                {question.options?.map((opt, i) => {
                  const optChar = opt.charAt(0);
                  const isUserChoice = question.userAnswer === optChar;
                  const isCorrect = question.correctAnswer === optChar;
                  
                  return (
                    <div 
                      key={i}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCorrect ? 'border-blue-500 bg-blue-50' : isUserChoice ? 'border-red-500 bg-red-50' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isCorrect ? 'bg-blue-500 text-white' : isUserChoice ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {optChar}
                        </div>
                        <div className="text-gray-800 flex-1 text-sm" dangerouslySetInnerHTML={{ __html: formatText(opt.substring(3)) }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 解析盒子 */}
              <div className="border-2 border-red-100 rounded-2xl overflow-hidden">
                <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center">
                  <i className="fas fa-lightbulb text-red-500 mr-2"></i>
                  <span className="font-bold text-red-700 text-sm">Correct Answer & Analysis</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correct Answer</span>
                    <div className="text-2xl font-black text-gray-900">{question.correctAnswer}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explanation</span>
                    <div className="mt-2 text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(question.explanation) }}></div>
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