import React, { useEffect, useState, useCallback, useRef, memo } from 'react';

import { Modal } from 'antd';

import { formatText, renderMathInContainers, renderMathInContainerById } from '../../pages/ExamSetEntry/examSetEntryUtils';

/** 紧凑预览时过滤换行和多余空格，保护公式块 $...$ 和 $$...$$ 不被破坏 */
function normalizeContentForCompact(raw) {
  if (typeof raw !== 'string') return '';
  const formulaBlocks = [];
  let s = raw.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
    const placeholder = `\u0001FORMULA${formulaBlocks.length}\u0001`;
    formulaBlocks.push(match);
    return placeholder;
  });
  s = s
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
  formulaBlocks.forEach((block, i) => {
    s = s.replace(`\u0001FORMULA${i}\u0001`, block);
  });
  return s;
}

/**
 * 题目内容格式化预览组件
 * @param {string} content - 原始题目文本（含 Markdown、$公式$、![图片](url)）
 * @param {boolean} singleLine - 是否单行截断（line-clamp-1）
 * @param {boolean} compact - 紧凑模式：隐藏图片 + 过滤换行空格（列表缩略场景，等价于 omitImages + normalizeWhitespace）
 * @param {boolean} omitImages - 是否隐藏图片（单独使用时）
 * @param {boolean} normalizeWhitespace - 是否过滤换行空格（单独使用时，会保护公式块）
 * @param {string} className - 额外样式类
 * @param {string} containerId - 可选，传入时仅对本容器渲染公式
 */
function FormattedQuestionPreview({ content, singleLine = false, compact = false, omitImages = false, normalizeWhitespace = false, className = '', containerId }) {
  const [previewImageSrc, setPreviewImageSrc] = useState(null);
  const [clickedImageEl, setClickedImageEl] = useState(null);
  const contentRef = useRef(null);

  const effectiveOmitImages = omitImages || compact;
  const effectiveNormalizeWhitespace = normalizeWhitespace || compact;

  useEffect(() => {
    if (!(content || '').trim()) return;
    const cleanup = containerId
      ? renderMathInContainerById(containerId)
      : renderMathInContainers();
    return cleanup;
  }, [content, containerId]);

  useEffect(() => {
    if (effectiveOmitImages) return;
    const el = contentRef.current;
    if (!el) return;
    const imgs = el.querySelectorAll('img');
    imgs.forEach((img) => {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', '点击查看大图');
    });
  }, [content, effectiveOmitImages]);

  const handleContainerClick = useCallback((e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      setPreviewImageSrc(e.target.src);
      setClickedImageEl(e.target);
    }
  }, []);

  const handleContainerKeyDown = useCallback((e) => {
    if (e.target.tagName !== 'IMG') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPreviewImageSrc(e.target.src);
      setClickedImageEl(e.target);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    const el = clickedImageEl;
    setPreviewImageSrc(null);
    setClickedImageEl(null);
    if (el && typeof el.focus === 'function') {
      setTimeout(() => el.focus(), 0);
    }
  }, [clickedImageEl]);

  const baseClasses = 'math-content break-words markdown-body';
  const clampClass = singleLine ? 'line-clamp-1' : '';
  const imagePreviewClasses = '[&_img]:max-h-[140px] [&_img]:object-contain [&_img]:cursor-pointer [&_img]:rounded-lg [&_img]:transition-opacity hover:[&_img]:opacity-90';
  const combinedClassName = [baseClasses, clampClass, imagePreviewClasses, className].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={contentRef}
        className={combinedClassName}
        dangerouslySetInnerHTML={{ __html: formatText(
          effectiveNormalizeWhitespace ? normalizeContentForCompact(content || '') : (content || ''),
          { omitImages: effectiveOmitImages }
        ) }}
        onClick={handleContainerClick}
        onKeyDown={handleContainerKeyDown}
        role="presentation"
      />
      <Modal
        open={!!previewImageSrc}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width="auto"
        styles={{ body: { padding: 0 } }}
        aria-label="图片预览"
      >
        {previewImageSrc && (
          <img
            src={previewImageSrc}
            alt="题目图片预览"
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        )}
      </Modal>
    </>
  );
}

export default memo(FormattedQuestionPreview);
