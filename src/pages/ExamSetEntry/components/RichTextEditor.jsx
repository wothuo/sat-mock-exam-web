import React, { useState, useRef, useEffect } from 'react';

import { Input } from 'antd';

import FormattedQuestionPreview from '../../../components/common/FormattedQuestionPreview';

const { TextArea } = Input;

/** 约 1 行高度（px），匹配 12px 字号 + 1.5 行高 */
const ROW_HEIGHT = 24;
const MAX_AUTO_ROWS = 5;

function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = '输入内容...', 
  showPreview = true,
  previewPlaceholder,
  id,
  onRenderMath,
  showToolbar = true,
  onToolbarAction
}) {
  const [previewVisible, setPreviewVisible] = useState(showPreview);
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const userResizedRef = useRef(false);

  const syncHeight = () => {
    const wrapper = wrapperRef.current;
    const textarea = id ? document.getElementById(id) : textareaRef.current?.resizableTextArea?.textArea;
    if (!wrapper || !textarea || userResizedRef.current) return;
    const minH = ROW_HEIGHT;
    const maxH = ROW_HEIGHT * MAX_AUTO_ROWS;
    wrapper.dataset.measuring = '1';
    textarea.style.setProperty('height', 'auto', 'important');
    const scrollH = textarea.scrollHeight;
    textarea.style.removeProperty('height');
    delete wrapper.dataset.measuring;
    const targetH = Math.min(Math.max(scrollH, minH), maxH);
    wrapper.style.height = `${targetH}px`;
  };

  useEffect(() => { syncHeight(); }, [value]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height;
      if (h > ROW_HEIGHT * MAX_AUTO_ROWS) userResizedRef.current = true;
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const handleToolbarAction = (action, data) => {
    if (onToolbarAction) {
      onToolbarAction(action, data, id);
    }
  };

  const togglePreview = () => {
    const newVisible = !previewVisible;
    setPreviewVisible(newVisible);
    
    if (newVisible && onRenderMath) {
      setTimeout(() => {
        onRenderMath();
      }, 50);
    }
  };

  // 自动渲染数学公式（延迟确保预览区 DOM 已更新后再执行 KaTeX）
  React.useEffect(() => {
    if (showPreview && onRenderMath) {
      const t = setTimeout(() => {
        onRenderMath();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [value, showPreview, onRenderMath]);

  return (
    <div className="exam-question-editor-font">
      <div
        ref={wrapperRef}
        className="rich-text-area-wrapper"
        style={{
          minHeight: ROW_HEIGHT,
          resize: 'vertical',
          overflow: 'hidden',
        }}
      >
        <TextArea
          ref={textareaRef}
          id={id}
          rows={1}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTimeout(syncHeight, 0);
          }}
          placeholder={placeholder}
          className="rich-text-area-inner rounded-md exam-question-editor-font"
          onFocus={() => handleToolbarAction('focus', null)}
        />
      </div>
      {showPreview && previewVisible && (
        <div className="mt-1.5 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">预览内容</div>
          <div 
            id={`preview-${id}`}
            className="rich-text-preview bg-white rounded-md border-2 border-dashed border-blue-100 exam-question-editor-font"
          >
            {!(value || '').trim() && previewPlaceholder ? (
              <div className="text-gray-300 italic leading-relaxed">
                {previewPlaceholder}
              </div>
            ) : (
              <FormattedQuestionPreview
                content={value}
                singleLine={false}
                className="text-gray-900 exam-question-editor-font"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;