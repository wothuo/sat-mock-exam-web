import React from 'react';

const FILL_IN_BLANKS_TYPES = ['fill-in-blanks', 'image-with-blanks'];

function QuestionAnswerPanel({
  question,
  currentQuestion,
  answers,
  setAnswers,
  handleAnswerSelect,
  handleTextSelection,
  renderFormattedText,
  formatText,
  columnClassName = ''
}) {
  if (!question) return null;

  const renderOptions = () => (
    <div className="space-y-4">
      {question.type === 'reading-passage' && question.followUpQuestion && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <div className="font-medium text-gray-900 mb-4">
              {renderFormattedText(question.followUpQuestion, question.id, 'followUpQuestion')}
            </div>
        </div>
      )}

      {(question.options || (question.type === 'reading-passage' && question.options))?.map(
        (option, index) => (
          <label
            key={index}
            className={`radio-option ${answers[currentQuestion] === option.charAt(1) ? 'selected' : ''}`}
          >
            <div className="modern-radio">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option.charAt(1)}
                checked={answers[currentQuestion] === option.charAt(1)}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              />
              <div className="modern-radio-circle" />
            </div>
            <div
              className="radio-text flex-1 selectable-text"
            >
              {renderFormattedText(option, question.id, 'option')}
            </div>
          </label>
        )
      )}
    </div>
  );

  const renderStudentProduced = () => (
    <div className="space-y-6">
      <div className="text-gray-700">
          {renderFormattedText(question.answerFormat, question.id, 'answerFormat')}
        </div>
      <div>
          <input
              type="text"
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent overflow-x-auto whitespace-nowrap"
              placeholder="Enter your answer"
          />
      </div>
    </div>
  );

  const renderFillInBlanks = () => {
    const blanks = question.blanks || [];

    const renderBlankInput = (blank) => (
        <input
            key={blank.id}
            type="text"
            value={answers[currentQuestion]?.[blank.id] || ''}
            onChange={(e) => {
                const newAnswers = { ...answers };
                if (!newAnswers[currentQuestion]) {
                    newAnswers[currentQuestion] = {};
                }
                newAnswers[currentQuestion][blank.id] = e.target.value;
                setAnswers(newAnswers);
            }}
            className="w-full px-3 py-2 border-b-2 border-gray-400 focus:outline-none focus:border-red-500 text-base"
            placeholder={blank.placeholder || 'Enter your answer'}
            aria-label="Answer"
        />
    );

    return (
      <div className="space-y-6">
        <div className="text-gray-700 text-base leading-relaxed">
          <p className="text-gray-600 text-sm mb-3">
            Enter your answer in the box below.
          </p>
          {blanks.length > 0 && (
            <div className="space-y-4">
              {blanks.map((blank) => (
                <div key={blank.id}>
                  {renderBlankInput(blank)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTableOptions = () => (
    <div className="space-y-4">
      {question.options.map((option, index) => (
        <label
          key={index}
          className={`radio-option ${answers[currentQuestion] === option.charAt(1) ? 'selected' : ''}`}
        >
          <div className="modern-radio">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={option.charAt(1)}
              checked={answers[currentQuestion] === option.charAt(1)}
              onChange={(e) => handleAnswerSelect(e.target.value)}
            />
            <div className="modern-radio-circle" />
          </div>
          <div className="radio-text flex-1">
              {renderFormattedText(option, question.id, 'tableOption')}
            </div>
        </label>
      ))}
    </div>
  );

  return (
    <div className={`col-span-1${columnClassName ? ` ${columnClassName}` : ''} bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col`}>
      <div className="space-y-6">
        {question.description && (
          <div className="mb-6">
            <div className="text-base text-gray-900 leading-relaxed">
              {renderFormattedText(question.description, question.id, 'description')}
            </div>
          </div>
        )}

        {(question.type === 'multiple-choice' ||
          question.type === 'multiple-choice-with-image' ||
          question.type === 'reading-passage') &&
          renderOptions()}

        {(question.type === 'student-produced' ||
          question.type === 'student-produced-with-image') &&
          renderStudentProduced()}

        {FILL_IN_BLANKS_TYPES.includes(question.type) && renderFillInBlanks()}

        {(question.type === 'table-question' || question.type === 'complex-table') &&
          renderTableOptions()}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Answer Preview:</div>
          <div className="text-base font-medium text-gray-900">
            {FILL_IN_BLANKS_TYPES.includes(question.type) ? (
              <div className="space-y-2">
                {(question.blanks || []).map((blank) => (
                  <span key={blank.id} className="font-mono">
                    {answers[currentQuestion]?.[blank.id] ?? '—'}
                  </span>
                ))}
              </div>
            ) : (
              answers[currentQuestion] || 'No answer selected'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionAnswerPanel;