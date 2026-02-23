import React from 'react';

function QuestionNotesPanel({
  notes,
  currentQuestion,
  expandedNotes,
  onToggleNoteExpansion,
  onDeleteNote
}) {
  const entries = Object.entries(notes).filter(
    ([, note]) => note.questionId === currentQuestion
  );

  return (
    <div className="col-span-1 lg:col-span-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col max-h-[620px] min-h-[200px]">
      {/* 面板标题 */}
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
          <i className="fas fa-sticky-note text-white text-sm" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">题目备注</h3>
          <p className="text-xs text-gray-500">已添加 {entries.length} 条备注</p>
        </div>
        {entries.length > 6 && (
          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            滚动查看更多
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-3">
        {entries.map(([noteId, note]) => (
          <div
            key={noteId}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-yellow-300"
          >
            {expandedNotes.has(noteId) ? (
              <div className="space-y-3">
                {/* 展开状态 - 选中文本 */}
                <div className="flex items-start space-x-2">
                  <i className="fas fa-quote-left text-yellow-500 text-xs mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-800 bg-white/80 rounded-lg p-3 border-l-3 border-yellow-400 leading-relaxed flex-1">
                    "{note.text}"
                  </div>
                </div>
                
                {/* 展开状态 - 备注内容 */}
                <div className="flex items-start space-x-2">
                  <i className="fas fa-comment text-yellow-500 text-xs mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 leading-relaxed flex-1 min-h-16">
                    {note.note}
                  </div>
                </div>
                
                {/* 展开状态 - 操作按钮 */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onToggleNoteExpansion(noteId)}
                    className="px-3 py-1.5 bg-yellow-200 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-300 transition-all duration-200 shadow-sm"
                    title="收起备注"
                  >
                    <i className="fas fa-chevron-up mr-1" />
                    收起
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(noteId)}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
                    title="删除备注"
                  >
                    <i className="fas fa-trash mr-1" />
                    删除
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* 收起状态 - 图标 */}
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <i className="fas fa-sticky-note text-white text-xs" />
                </div>
                
                {/* 收起状态 - 文本预览 */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-yellow-800 truncate mb-1">
                    {note.text.length > 30 ? `${note.text.substring(0, 30)}...` : note.text}
                  </div>
                  <div className="text-xs text-yellow-600 truncate">
                    {note.note.length > 40 ? `${note.note.substring(0, 40)}...` : note.note}
                  </div>
                </div>
                
                {/* 收起状态 - 操作按钮 */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleNoteExpansion(noteId)}
                    className="w-7 h-7 bg-yellow-200 text-yellow-700 rounded-lg text-xs flex items-center justify-center hover:bg-yellow-300 transition-all duration-200 shadow-sm"
                    title="展开查看详情"
                  >
                    <i className="fas fa-expand" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(noteId)}
                    className="w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
                    title="删除备注"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 空状态 */}
        {entries.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[120px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <i className="fas fa-sticky-note text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium mb-1">暂无备注</p>
              <p className="text-xs text-gray-400">选中题目文字后可添加备注</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default QuestionNotesPanel;