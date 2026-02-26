import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal } from 'antd';

const BLANKS_TYPES = ['BLANK'];

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
  const [previewImageSrc, setPreviewImageSrc] = useState(null);
  const [clickedImageEl, setClickedImageEl] = useState(null);
  const contentRef = useRef(null);

  const handleImageAction = useCallback((e) => {
    if (e.target.tagName !== 'IMG') return;
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      if (e.type === 'keydown') e.preventDefault();
      setPreviewImageSrc(e.target.src);
      setClickedImageEl(e.target);
    }
  }, []);

  const handleContentClick = useCallback((e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      handleImageAction(e);
    }
  }, [handleImageAction]);

  const handleContentKeyDown = useCallback((e) => {
    if (e.target.tagName === 'IMG') handleImageAction(e);
  }, [handleImageAction]);

  const handleCloseModal = useCallback(() => {
    const el = clickedImageEl;
    setPreviewImageSrc(null);
    setClickedImageEl(null);
    if (el && typeof el.focus === 'function') {
      setTimeout(() => el.focus(), 0);
    }
  }, [clickedImageEl]);

  useEffect(() => {
    if (!contentRef.current || !question) return;
    const imgs = contentRef.current.querySelectorAll('img');
    imgs.forEach((img) => {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('title', 'Enlarge');
      img.setAttribute('aria-label', 'Enlarge');
      if (img.closest('.img-enlarge-wrapper')) return;
      const wrapper = document.createElement('span');
      wrapper.className = 'img-enlarge-wrapper inline-block relative align-middle';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      const icon = document.createElement('span');
      icon.className = 'img-enlarge-icon absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded pointer-events-none';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<i class="fas fa-expand"></i>';
      wrapper.appendChild(icon);
    });
  }, [question]);

  if (!question) return null;

  const renderOptions = () => (
    <div className="space-y-4">
      {question.followUpQuestion && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <div className="font-medium text-gray-900 mb-4 selectable-text"
               onMouseUp={(e) => handleTextSelection(e, 'followUpQuestion')}>
              {renderFormattedText(question.followUpQuestion, question.id, 'followUpQuestion')}
            </div>
        </div>
      )}

      {question.options?.map(
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
              <div className="modern-radio-circle" onMouseUp={(e) => e.stopPropagation()} />
            </div>
            <div
              className="radio-text flex-1 selectable-text break-all"
              onMouseUp={(e) => handleTextSelection(e, 'option')}
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
      <div className="text-gray-700 selectable-text"
           onMouseUp={(e) => handleTextSelection(e, 'answerFormat')}>
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

    const renderBlankInput = (blank) => {
        // 确保答案值是字符串类型
        const answerValue = typeof answers[currentQuestion]?.[blank.id] === 'string' 
            ? answers[currentQuestion][blank.id] 
            : typeof answers[currentQuestion]?.[blank.id] === 'object'
                ? JSON.stringify(answers[currentQuestion][blank.id])
                : '';
                
        return (
            <input
                key={blank.id}
                type="text"
                value={answerValue}
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
    };

    return (
      <div className="space-y-6">
        <div className="text-gray-700 text-base leading-relaxed">
          <p className="text-gray-600 text-sm mb-3">
            Enter your answer in the box below.
          </p>
          {blanks.length > 0 && (
            <div className="space-y-4 break-all">
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
          <div className="radio-text flex-1 selectable-text"
               onMouseUp={(e) => handleTextSelection(e, 'tableOption')}>
              {renderFormattedText(option, question.id, 'tableOption')}
            </div>
        </label>
      ))}
    </div>
  );

  return (
    <div className={`question-answer-panel col-span-1${columnClassName ? ` ${columnClassName}` : ''} bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col`}>
      <div ref={contentRef} className="space-y-6" onClick={handleContentClick} onKeyDown={handleContentKeyDown} role="presentation">
        {question.description && (
          <div className="mb-6">
            <div className="text-base text-gray-900 leading-relaxed max-h-48 overflow-y-auto break-all selectable-text"
               onMouseUp={(e) => handleTextSelection(e, 'description')}>
            {renderFormattedText(question.description, question.id, 'description')}
          </div>
          </div>
        )}

        {question.type === 'CHOICE' && renderOptions()}

        {question.type === 'BLANK' && renderFillInBlanks()}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Answer Preview:</div>
          <div className="text-base font-medium text-gray-900 break-all">
            {BLANKS_TYPES.includes(question.type) ? (
              <div className="space-y-2">
                {(question.blanks || []).map((blank) => (
                  <div key={blank.id} className="font-mono">
                    {typeof answers[currentQuestion]?.[blank.id] === 'string' 
                      ? answers[currentQuestion][blank.id] 
                      : typeof answers[currentQuestion]?.[blank.id] === 'object' 
                        ? Object.values(answers[currentQuestion][blank.id])[0] || ''
                        : answers[currentQuestion]?.[blank.id] ?? '—'}
                  </div>
                ))}
              </div>
            ) : (
              typeof answers[currentQuestion] === 'object' 
                ? JSON.stringify(answers[currentQuestion]) 
                : answers[currentQuestion] || 'No answer selected'
            )}
          </div>
        </div>
      </div>

      <Modal
        open={!!previewImageSrc}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width="auto"
        styles={{ body: { padding: 0 } }}
        aria-label="Answer option image preview"
      >
        {previewImageSrc && (
          <img
            src={previewImageSrc}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        )}
      </Modal>
    </div>
  );
}

export default QuestionAnswerPanel;