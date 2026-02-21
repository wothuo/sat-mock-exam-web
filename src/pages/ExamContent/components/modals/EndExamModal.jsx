import React from 'react';

function EndExamModal({
  open,
  totalQuestions,
  answeredCount,
  timeMode,
  timeRemaining,
  formatTime,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 ease-out border border-white/20">
        <div className="px-10 pt-10 pb-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner">
            <i className="fas fa-exclamation-triangle text-red-500 text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Ready to Finish?</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Once submitted, you cannot change your answers.
          </p>
        </div>

        <div className="px-10 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 transition-all hover:bg-blue-50">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Answered</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-blue-700">{answeredCount ?? 0}</span>
                <span className="text-sm font-bold text-blue-300">/ {totalQuestions ?? 0}</span>
              </div>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 transition-all hover:bg-amber-50">
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">For Review</div>
              <div className="text-2xl font-black text-amber-700">not supported</div>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 transition-all hover:bg-slate-50">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Left</div>
              <div className="text-2xl font-black text-slate-700 font-mono">
                {timeMode === 'timed' && formatTime ? formatTime(timeRemaining ?? 0) : '--:--'}
              </div>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-5 transition-all hover:bg-red-50">
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Unanswered</div>
              <div className="text-2xl font-black text-red-700">
                {Math.max(0, (totalQuestions ?? 0) - (answeredCount ?? 0))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 pb-10 pt-4 space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
          >
            Yes, Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-base hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            No, Continue answering
          </button>
          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
            Your progress is automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}

export default EndExamModal;

