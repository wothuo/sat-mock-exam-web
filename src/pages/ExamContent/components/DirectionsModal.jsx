import React from 'react';

function DirectionsModal({ open, title, content, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
      <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 ease-out border border-white/20">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20 transform -rotate-3">
              <i className="fas fa-book-open text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Exam Guidelines & Reference</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all duration-200 group"
          >
            <i className="fas fa-times text-slate-300 group-hover:text-slate-600 text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate max-w-none">
              <div className="text-slate-600 leading-relaxed text-lg font-medium space-y-6">
                {content}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center">
          <span className="text-xs font-bold text-slate-400 mr-auto hidden sm:block">
            <i className="fas fa-keyboard mr-2" />
            Press ESC to close
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center"
          >
            Got it, Close
            <i className="fas fa-check-circle ml-2 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DirectionsModal;
