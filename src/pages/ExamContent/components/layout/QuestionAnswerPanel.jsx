import React from 'react';

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
            {renderFormattedText(question.followUpQuestion, question.id)}
          </div>
        </div>
      )}

      {(question.options || (question.type === 'reading-passage' && question.options))?.map(
        (option, index) => (
          <label
            key={index}
            className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
          >
            <div className="modern-radio">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option.charAt(0)}
                checked={answers[currentQuestion] === option.charAt(0)}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              />
              <div className="modern-radio-circle" />
            </div>
            <div
              className="radio-text flex-1 selectable-text"
              onMouseUp={handleTextSelection}
            >
              {renderFormattedText(option, question.id)}
            </div>
          </label>
        )
      )}
    </div>
  );

  const renderStudentProduced = () => (
    <div className="space-y-6">
      <div className="text-gray-700">
        {renderFormattedText(question.answerFormat, question.id)}
      </div>
      <div>
        <input
          type="text"
          value={answers[currentQuestion] || ''}
          onChange={(e) => handleAnswerSelect(e.target.value)}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter your answer"
        />
      </div>
    </div>
  );

  const renderFillInBlanks = () => (
    <div className="space-y-6">
      <div className="text-gray-700 text-base leading-relaxed">
        {question.content && (
          <div className="mb-4">
            {question.content.split('_____').map((part, index, array) => (
              <span key={index}>
                <span
                  dangerouslySetInnerHTML={{ __html: formatText(part) }}
                  onMouseUp={handleTextSelection}
                />
                {index < array.length - 1 && (
                  <input
                    type="text"
                    value={answers[currentQuestion]?.[question.blanks[index]?.id] || ''}
                    onChange={(e) => {
                      const newAnswers = { ...answers };
                      if (!newAnswers[currentQuestion]) {
                        newAnswers[currentQuestion] = {};
                      }
                      newAnswers[currentQuestion][question.blanks[index].id] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="inline-block w-32 mx-2 px-2 py-1 border-b-2 border-red-500 focus:outline-none focus:border-red-700 text-center"
                    placeholder={question.blanks[index]?.placeholder}
                  />
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTableOptions = () => (
    <div className="space-y-4">
      {question.options.map((option, index) => (
        <label
          key={index}
          className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
        >
          <div className="modern-radio">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={option.charAt(0)}
              checked={answers[currentQuestion] === option.charAt(0)}
              onChange={(e) => handleAnswerSelect(e.target.value)}
            />
            <div className="modern-radio-circle" />
          </div>
          <div className="radio-text flex-1">
            {renderFormattedText(option, question.id)}
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
              {renderFormattedText(question.description, question.id)}
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

        {(question.type === 'fill-in-blanks' || question.type === 'image-with-blanks') &&
          renderFillInBlanks()}

        {(question.type === 'table-question' || question.type === 'complex-table') &&
          renderTableOptions()}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Answer Preview:</div>
          <div className="text-base font-medium text-gray-900">
            {question.type === 'fill-in-blanks' || question.type === 'image-with-blanks' ? (
              <div className="space-y-2">
                {question.blanks?.map((blank) => (
                  <div key={blank.id} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{blank.placeholder}:</span>
                    <span className="font-mono">
                      {answers[currentQuestion]?.[blank.id] || 'Not answered'}
                    </span>
                  </div>
                )) || 'No blanks filled'}
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

