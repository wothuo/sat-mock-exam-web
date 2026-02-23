import React, { useEffect, useState, useCallback, memo } from 'react';

import { Modal } from 'antd';

import { formatText, renderMathInContainers, renderMathInContainerById } from '../../pages/ExamSetEntry/examSetEntryUtils';

/**
 * 题目内容格式化预览组件
 * @param {string} content - 原始题目文本（含 Markdown、$公式$、![图片](url)）
 * @param {boolean} singleLine - 是否单行截断（line-clamp-1）
 * @param {string} className - 额外样式类
 * @param {string} containerId - 可选，传入时仅对本容器渲染公式（套题录入多预览场景，避免联动闪屏）
 */
function FormattedQuestionPreview({ content, singleLine = false, className = '', containerId }) {
  const [previewImageSrc, setPreviewImageSrc] = useState(null);

  useEffect(() => {
    if (!(content || '').trim()) return;
    const cleanup = containerId
      ? renderMathInContainerById(containerId)
      : renderMathInContainers();
    return cleanup;
  }, [content, containerId]);

  const handleContainerClick = useCallback((e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      setPreviewImageSrc(e.target.src);
    }
  }, []);

  const baseClasses = 'math-content break-words markdown-body';
  const clampClass = singleLine ? 'line-clamp-1' : '';
  const imagePreviewClasses = '[&_img]:max-h-[140px] [&_img]:object-contain [&_img]:cursor-pointer [&_img]:rounded-lg [&_img]:transition-opacity hover:[&_img]:opacity-90';
  const combinedClassName = [baseClasses, clampClass, imagePreviewClasses, className].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={combinedClassName}
        dangerouslySetInnerHTML={{ __html: formatText(content || '') }}
        onClick={handleContainerClick}
        role="presentation"
      />
      <Modal
        open={!!previewImageSrc}
        onCancel={() => setPreviewImageSrc(null)}
        footer={null}
        centered
        width="auto"
        styles={{ body: { padding: 0 } }}
      >
        {previewImageSrc && (
          <img
            src={previewImageSrc}
            alt=""
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        )}
      </Modal>
    </>
  );
}

export default memo(FormattedQuestionPreview);
