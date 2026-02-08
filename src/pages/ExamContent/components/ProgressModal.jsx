import React from 'react';

function ProgressModal({
  open,
  examTitle,
  totalQuestions,
  currentQuestion,
  answers,
  markedForReview,
  onClose,
  onGoToQuestion,
  onEndExam
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">考试进度</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-4">{examTitle}</h3>

            <div className="flex items-center justify-center space-x-6 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <span>Unanswered</span>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-11 gap-2 max-w-2xl">
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      onGoToQuestion(num);
                      onClose();
                    }}
                    className={`w-10 h-10 text-sm rounded-lg font-medium transition-colors ${
                      num === currentQuestion
                        ? 'bg-blue-500 text-white'
                        : markedForReview.has(num)
                          ? 'bg-yellow-500 text-white'
                          : answers[num]
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                type="button"
                onClick={onEndExam}
                className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-stop mr-2" />结束考试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressModal;
