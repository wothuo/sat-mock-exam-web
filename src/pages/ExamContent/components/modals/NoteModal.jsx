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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 overflow-hidden">
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <i className="fas fa-sticky-note text-red-500 text-lg"></i>
            <h3 className="text-lg font-bold text-gray-900">添加备注</h3>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6 space-y-4">
          {/* 选中文本显示 */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-quote-left text-gray-400 text-xs"></i>
              <span className="text-sm font-medium text-gray-700">选中的文本</span>
            </div>
            <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 text-sm leading-relaxed shadow-sm">
              <span className="text-gray-800 font-medium">"{selectedText}"</span>
            </div>
          </div>
          
          {/* 备注输入框 */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-edit text-gray-400 text-xs"></i>
              <span className="text-sm font-medium text-gray-700">备注内容</span>
            </div>
            <textarea
              value={noteInputValue}
              onChange={(e) => setNoteInputValue(e.target.value)}
              placeholder="请输入你的备注内容..."
              className="w-full h-28 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-300 resize-none transition-all duration-200 shadow-sm"
              autoFocus
            />
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <i className="fas fa-save mr-1.5"></i>
              保存备注
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;