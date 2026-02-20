import React from 'react';

function QuestionStemPanel({
  currentQuestion,
  totalQuestions,
  question,
  renderFormattedText,
  onTextSelect
}) {
  return (
    <div className="col-span-1 lg:col-span-5 bg-white rounded-lg p-4 sm:p-6 shadow-sm relative flex flex-col">
      <div className="pb-4 mb-6">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>

      {question && (
        <div className="space-y-6 flex-1">
          <div
            className="text-lg font-medium text-gray-900 selectable-text"
          >
            {renderFormattedText(question.question, question.id, 'question')}
          </div>

          {/*{question.description && (*/}
          {/*  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">*/}
          {/*    <div className="text-sm font-semibold text-blue-900 mb-2">*/}
          {/*      <i className="fas fa-info-circle mr-2" />*/}
          {/*      问题描述*/}
          {/*    </div>*/}
          {/*    <div className="text-sm text-blue-800 leading-relaxed">*/}
          {/*      {renderFormattedText(question.description, question.id)}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}

          {question.type === 'reading-passage' && question.passage && (
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <div className="prose max-w-none text-gray-700 leading-relaxed text-sm">
                {renderFormattedText(question.passage, question.id, 'passage')}
              </div>
            </div>
          )}

          {question.hasImage && question.images && question.images.length > 0 && (
              <div className="space-y-4">
                {question.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="flex justify-center">
                    <img
                      src={img.url}
                      alt={img.alt || `Question image ${imgIndex + 1}`}
                      className="max-w-full max-h-96 h-auto rounded-lg border border-gray-200 shadow-sm object-contain transition-all duration-300 hover:shadow-md"
                      style={{
                        maxWidth: 'min(100%, 600px)',
                        width: 'auto',
                        height: 'auto'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.warn(`图片加载失败: ${img.url}`);
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

          {question.hasTable && question.table && (
            <div className="overflow-x-auto">
              {question.table.title && (
                <div className="mb-4 text-center font-semibold text-gray-900 text-sm">
                  {renderFormattedText(question.table.title, question.id, 'tableTitle')}
                </div>
              )}

              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {question.table.headers.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-900"
                      >
                        {renderFormattedText(header, question.id, 'tableHeader')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 px-2 py-1 text-gray-700"
                        >
                          {renderFormattedText(cell, question.id, 'tableCell')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionStemPanel;