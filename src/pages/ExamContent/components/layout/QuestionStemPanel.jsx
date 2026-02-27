import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal } from 'antd';

function QuestionStemPanel({
                               currentQuestion,
                               totalQuestions,
                               question,
                               renderFormattedText,
                               onTextSelect,
                               notes,
                               showNotesPanel,
                               setShowNotesPanel
                           }) {
    const [previewImageSrc, setPreviewImageSrc] = useState(null);
    const [clickedImageEl, setClickedImageEl] = useState(null);
    const contentRef = useRef(null);

    const currentNotesCount = Object.entries(notes).filter(([noteId, note]) => note.questionId === currentQuestion).length;

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
      if (!contentRef.current) return;
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

    return (
        <div className="question-stem-panel col-span-1 lg:col-span-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm relative flex flex-col">
            {/* 备注图标按钮 功能暂不开放 */}
            <button
                disabled
                className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed shadow-md"
                title="备注功能已禁用"
            >
                {currentNotesCount > 0 ? (
                    <span className="relative">
                        <i className="fas fa-sticky-note"></i>
                        <span className="absolute -top-2 -right-2 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md bg-gradient-to-br from-gray-400 to-gray-500">
                            {currentNotesCount}
                        </span>
                    </span>
                ) : (
                    <i className="fas fa-sticky-note"></i>
                )}
            </button>
            {/*备注图标按钮*/}
            {/*<button*/}
            {/*    onClick={() => setShowNotesPanel(!showNotesPanel)}*/}
            {/*    className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${*/}
            {/*        showNotesPanel*/}
            {/*            ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white scale-105'*/}
            {/*            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 hover:from-yellow-100 hover:to-orange-100 hover:text-yellow-600'*/}
            {/*    }`}*/}
            {/*    title={showNotesPanel ? '隐藏备注区域' : '显示备注区域'}*/}
            {/*>*/}
            {/*    {currentNotesCount > 0 ? (*/}
            {/*        <span className="relative">*/}
            {/*            <i className="fas fa-sticky-note"></i>*/}
            {/*            <span className={`absolute -top-2 -right-2 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md ${*/}
            {/*                showNotesPanel */}
            {/*                    ? 'bg-gradient-to-br from-red-500 to-pink-500' */}
            {/*                    : 'bg-gradient-to-br from-red-400 to-pink-400'*/}
            {/*            }`}>*/}
            {/*                {currentNotesCount}*/}
            {/*            </span>*/}
            {/*        </span>*/}
            {/*    ) : (*/}
            {/*        <i className="fas fa-sticky-note"></i>*/}
            {/*    )}*/}
            {/*</button>*/}

            <div className="pb-4 mb-6">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </span>
            </div>

            {question && (
                <div ref={contentRef} className="space-y-6 flex-1" onClick={handleContentClick} onKeyDown={handleContentKeyDown} role="presentation">
                    <div
                        className="text-lg font-medium text-gray-900 selectable-text"
                        onMouseUp={(e) => onTextSelect(e, 'question')}
                    >
                        {renderFormattedText(question.question, question.id)}
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
                            <div className="prose max-w-none text-gray-700 leading-relaxed text-sm selectable-text"
                                 onMouseUp={(e) => onTextSelect(e, 'passage')}>
                                {renderFormattedText(question.passage, question.id)}
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
                      className="question-stem-img max-w-full max-h-[100px] h-auto rounded-lg border border-gray-200 shadow-sm object-contain cursor-pointer transition-all duration-300 hover:shadow-md hover:opacity-95"
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
                <div className="mb-4 text-center font-semibold text-gray-900 text-sm selectable-text"
                     onMouseUp={(e) => onTextSelect(e, 'tableTitle')}>
                  {renderFormattedText(question.table.title, question.id, 'tableTitle')}
                </div>
              )}

              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {question.table.headers.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-900 selectable-text"
                        onMouseUp={(e) => onTextSelect(e, 'tableHeader')}
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
                        className="border border-gray-300 px-2 py-1 text-gray-700 selectable-text"
                        onMouseUp={(e) => onTextSelect(e, 'tableCell')}
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

      <Modal
        open={!!previewImageSrc}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width="auto"
        styles={{ body: { padding: 0 } }}
        aria-label="Question image preview"
      >
        {previewImageSrc && (
          <img
            src={previewImageSrc}
            alt="Question image (enlarged)"
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        )}
      </Modal>
    </div>
  );
}

export default QuestionStemPanel;