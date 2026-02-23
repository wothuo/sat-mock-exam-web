import React, { useEffect, memo } from 'react';

import { formatText, renderMathInContainers, renderMathInContainerById } from '../../pages/ExamSetEntry/examSetEntryUtils';

/**
 * 题目内容格式化预览组件
 * @param {string} content - 原始题目文本（含 Markdown、$公式$、![图片](url)）
 * @param {boolean} singleLine - 是否单行截断（line-clamp-1）
 * @param {string} className - 额外样式类
 * @param {string} containerId - 可选，传入时仅对本容器渲染公式（套题录入多预览场景，避免联动闪屏）
 */
function FormattedQuestionPreview({ content, singleLine = false, className = '', containerId }) {
  useEffect(() => {
    if (!(content || '').trim()) return;
    const cleanup = containerId
      ? renderMathInContainerById(containerId)
      : renderMathInContainers();
    return cleanup;
  }, [content, containerId]);

  const baseClasses = 'math-content break-words markdown-body';
  const clampClass = singleLine ? 'line-clamp-1' : '';
  const combinedClassName = [baseClasses, clampClass, className].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClassName}
      dangerouslySetInnerHTML={{ __html: formatText(content || '') }}
    />
  );
}

export default memo(FormattedQuestionPreview);
