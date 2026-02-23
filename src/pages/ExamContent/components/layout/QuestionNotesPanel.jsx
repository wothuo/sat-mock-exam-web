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
    <div className="col-span-1 lg:col-span-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col">
      <div className="space-y-4 flex-1">
        {entries.map(([noteId, note]) => (
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
                    type="button"
                    onClick={() => onToggleNoteExpansion(noteId)}
                    className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                    title="收起"
                  >
                    <i className="fas fa-chevron-up" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(noteId)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="删除备注"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center h-6">
                <i className="fas fa-sticky-note text-yellow-600 text-base mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-sm text-yellow-700 font-medium truncate">
                    {note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleNoteExpansion(noteId)}
                    className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                    title="展开备注"
                  >
                    <i className="fas fa-chevron-down" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(noteId)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="删除备注"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <i className="fas fa-sticky-note text-3xl mb-3" />
            <p className="text-sm">暂无备注</p>
            <p className="text-sm mt-2">选中文字后可添加备注</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionNotesPanel;

