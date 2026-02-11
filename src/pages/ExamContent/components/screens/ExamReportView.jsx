import React from 'react';

function ExamReportView({
  examData,
  scores,
  answers,
  questionTimes,
  formatQuestionTime,
  renderFormattedText,
  onExit,
  activeReportTab,
  setActiveReportTab
}) {
  return (
    <div className="min-h-screen bg-[#f3f4f7] pb-20">
      <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
              <i className="fas fa-trophy text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Practice Test Report</h1>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
          >
            <i className="fas fa-times mr-2" /> Exit
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/*<div className="p-8 md:p-12">*/}
          {/*  <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Current SAT Score</h2>*/}
          {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">*/}
          {/*    <div className="text-center space-y-2">*/}
          {/*      <div className="text-6xl font-black text-gray-900">{scores.total}</div>*/}
          {/*      <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Total Score</div>*/}
          {/*      <div className="text-xs text-gray-400">400–1600</div>*/}
          {/*    </div>*/}
          {/*    <div className="text-center space-y-2 border-x border-gray-100">*/}
          {/*      <div className="text-5xl font-bold text-gray-800">{scores.rw}</div>*/}
          {/*      <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Reading and Writing</div>*/}
          {/*      <div className="text-xs text-gray-400">200–800</div>*/}
          {/*    </div>*/}
          {/*    <div className="text-center space-y-2">*/}
          {/*      <div className="text-5xl font-bold text-gray-800">{scores.math}</div>*/}
          {/*      <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Math</div>*/}
          {/*      <div className="text-xs text-gray-400">200–800</div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="bg-[#0071ce] p-6 text-white text-center">*/}
          {/*  <p className="text-sm font-medium">*/}
          {/*    This score is based on your performance on this practice test. Use this report to identify areas for improvement.*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{examData.totalQuestions}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{scores.correct}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{scores.incorrect + scores.omitted}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">Incorrect/Omitted</div>
              </div>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveReportTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeReportTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Question</th>
                  <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Your Answer</th>
                  <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Correct Answer</th>
                  <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {examData.questions.map((q, idx) => {
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  const isOmitted = !answers[q.id];
                  return (
                    <tr key={q.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-700">{idx + 1}</td>
                      <td className="py-4">
                        {isCorrect ? (
                          <span className="text-blue-600"><i className="fas fa-check-circle mr-2" />Correct</span>
                        ) : isOmitted ? (
                          <span className="text-red-400"><i className="fas fa-minus-circle mr-2" />Omitted</span>
                        ) : (
                          <span className="text-red-500"><i className="fas fa-times-circle mr-2" />Incorrect</span>
                        )}
                      </td>
                      <td className={`py-4 font-bold ${isCorrect ? 'text-blue-600' : 'text-red-500'}`}>
                        {answers[q.id] || 'Omitted'}
                      </td>
                      <td className="py-4 font-bold text-gray-900">{q.correctAnswer || 'N/A'}</td>
                      <td className="py-4">
                        <span className="text-gray-700 font-medium">
                          {formatQuestionTime(questionTimes[q.id])}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 transition-all border border-gray-100"
      >
        <i className="fas fa-arrow-up text-xl" />
      </button>
    </div>
  );
}

export default ExamReportView;

