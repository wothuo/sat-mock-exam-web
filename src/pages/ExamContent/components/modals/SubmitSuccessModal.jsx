import React from 'react';

function SubmitSuccessModal({ open, onViewReport }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 ease-out border border-white/20">
        <div className="px-10 pt-10 pb-6 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner">
            <i className="fas fa-check-circle text-green-500 text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Answers Submitted</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Your answers have been submitted successfully. You can now view your score report.
          </p>
        </div>

        <div className="px-10 pb-10 pt-4">
          <button
            type="button"
            onClick={onViewReport}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 active:scale-[0.98]"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitSuccessModal;
