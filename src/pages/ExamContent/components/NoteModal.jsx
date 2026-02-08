import React, { useState, useEffect } from 'react';

/**
 * 备注弹窗，受控组件：用 state 管理输入，不依赖 getElementById
 */
function NoteModal({ open, selectedText, onSave, onCancel }) {
  const [noteInputValue, setNoteInputValue] = useState('');

  useEffect(() => {
    if (open) {
      setNoteInputValue('');
    }
  }, [open]);

  const handleSave = () => {
    const trimmed = (noteInputValue || '').trim();
    onSave(trimmed);
    setNoteInputValue('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">添加备注</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">选中的文本：</div>
          <div className="p-3 bg-gray-50 rounded border text-sm">
            "{selectedText}"
          </div>
        </div>
        <textarea
          value={noteInputValue}
          onChange={(e) => setNoteInputValue(e.target.value)}
          placeholder="输入你的备注..."
          className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
