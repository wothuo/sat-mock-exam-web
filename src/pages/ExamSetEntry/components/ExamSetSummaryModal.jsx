import React, { useEffect } from 'react';

import { Modal } from 'antd';

/** 与题目索引一致的 Markdown→HTML，保留 $...$ 供 KaTeX 渲染 */
function formatContentToHtml(text) {
  if (!text || typeof text !== 'string') return '';
  const mathBlocks = [];
  let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g, (match) => {
    const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
    mathBlocks.push(match);
    return placeholder;
  });
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');
  processed = processed.replace(/(?<!\*)(\*)(?!\*)(.+?)(?<!\*)(\*)(?!\*)/g, '<em>$2</em>');
  processed = processed.replace(/(?<!_)(_)(?!_)(.+?)(?<!_)(_)(?!_)/g, '<em>$2</em>');
  processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-1 max-h-8 object-contain" />');
  processed = processed.replace(/\n/g, '<br />');
  mathBlocks.forEach((block, index) => {
    processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
  });
  return processed;
}

function getQuestionPreviewPlaceholder(content) {
  if (!content || typeof content !== 'string') return true;
  const t = content.trim();
  return !t || t === '已录入';
}

/**
 * Section 题目汇总弹窗，提交前展示套题基本信息和各 Section 题目分布
 * 仅负责展示，确认提交逻辑由父组件 onOk 处理
 */
function ExamSetSummaryModal({ open, onCancel, onOk, loading, summaryFormValues = {}, sections = [], questions = [] }) {
  const activeSections = sections.filter(s => s.delFlag !== '1');
  const activeQuestionsList = questions.filter(q => q.delFlag !== '1');
  const totalCount = activeQuestionsList.length;

  useEffect(() => {
    if (!open || typeof window === 'undefined' || !window.renderMathInElement) return;
    const t = setTimeout(() => {
      activeQuestionsList.forEach((q) => {
        const el = document.getElementById(`summary-preview-${q.id}`);
        if (el) {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$', right: '$', display: false },
              { left: '$$', right: '$$', display: true },
            ],
            throwOnError: false,
          });
        }
      });
    }, 200);
    return () => clearTimeout(t);
  }, [open, questions]);

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-clipboard-check text-white text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 m-0">Section 题目汇总</h3>
            <p className="text-xs text-gray-500 m-0 font-normal">请仔细核对各 Section 的题目分布</p>
          </div>
        </div>
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="确认提交"
      cancelText="返回修改"
      width={900}
      className="summary-modal"
      okButtonProps={{
        loading,
        className: 'h-11 px-8 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 font-bold shadow-lg'
      }}
      cancelButtonProps={{
        className: 'h-11 px-8 rounded-xl font-bold'
      }}
    >
      <div className="py-6">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-info-circle text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 m-0">套题基本信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">套题名称</div>
                <div className="text-base font-bold text-gray-900 truncate">{summaryFormValues.title}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">考试类型</div>
                <div className="text-base font-bold text-gray-900">{summaryFormValues.type}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">总题目数</div>
                <div className="text-2xl font-black text-red-600">{totalCount} <span className="text-sm font-bold text-gray-400">题</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-layer-group text-white text-sm"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0">各 Section 题目分布</h3>
          </div>

          {activeSections.map((section, index) => {
            const sectionQuestions = activeQuestionsList.filter(q => q.sectionId === section.id);
            const percent = totalCount > 0 ? Math.round((sectionQuestions.length / totalCount) * 100) : 0;

            return (
              <div key={section.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl flex items-center justify-center text-lg font-black shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base mb-1">{section.name}</h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <i className="fas fa-book mr-1"></i>
                          {section.subject}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center">
                          <i className="fas fa-clock mr-1"></i>
                          {section.duration} 分钟
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-blue-600">{sectionQuestions.length}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">题目</div>
                  </div>
                </div>

                {sectionQuestions.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <i className="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                    <p className="text-sm text-gray-400 font-medium">该 Section 暂无题目</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-blue-900">
                        <i className="fas fa-check-circle mr-2"></i>
                        已录入 {sectionQuestions.length} 道题目
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        占比 {percent}%
                      </span>
                    </div>
                    <ul className="space-y-2 list-none pl-0 m-0">
                      {sectionQuestions.map((q, i) => (
                        <li key={q.id} className="flex items-start gap-2 text-sm text-gray-700 bg-white/60 rounded-lg px-3 py-2 border border-blue-100/50">
                          <span className="text-blue-600 font-bold shrink-0">{i + 1}.</span>
                          {getQuestionPreviewPlaceholder(q.content) ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <div
                              id={`summary-preview-${q.id}`}
                              className="summary-question-preview line-clamp-2 break-words [&_.katex]:text-sm"
                              dangerouslySetInnerHTML={{
                                __html: formatContentToHtml(q.content),
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
          <div>
            <h4 className="font-bold text-amber-900 mb-2">提交前请确认</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              请仔细核对各 Section 的题目数量和分布情况，确认无误后点击「确认提交」完成录入。提交后将无法修改，如需调整请点击「返回修改」。
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ExamSetSummaryModal;
