import React, { useEffect } from 'react';

import { formatText, renderMathInContainers } from '../../pages/ExamSetEntry/examSetEntryUtils';

/**
 * 题目内容格式化预览组件
 * 统一处理 Markdown、数学公式、图片，与套题录入预览、作答页渲染逻辑一致
 * @param {string} content - 原始题目文本（含 Markdown、$公式$、![图片](url)）
 * @param {boolean} singleLine - 是否单行截断（line-clamp-1）
 * @param {string} className - 额外样式类
 */
function FormattedQuestionPreview({ content, singleLine = false, className = '' }) {
  useEffect(() => {
    if (!(content || '').trim()) return;
    const cleanup = renderMathInContainers();
    return cleanup;
  }, [content]);

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

export default FormattedQuestionPreview;
