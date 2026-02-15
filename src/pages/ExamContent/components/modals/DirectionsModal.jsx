import React, { useEffect } from 'react';

function DirectionsModal({ open, title, content, onClose }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-[100] p-4 sm:p-6">
      <div className="bg-white max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close"
          >
            <i className="fas fa-times text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-white custom-scrollbar">
          <div className="text-gray-800 text-base leading-relaxed">
            {content}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 text-sm font-medium hover:bg-blue-700 border-0"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default DirectionsModal;

