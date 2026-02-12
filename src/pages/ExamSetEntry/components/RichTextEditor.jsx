import React, { useState } from 'react';

import { Input } from 'antd';

const { TextArea } = Input;

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

  const formatText = (text) => {
    if (!text) return '';
    
    // 1. 保护数学公式 (最高优先级)
    const mathBlocks = [];
    let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 解析图片 (极致稳健平衡扫描版)
    const imageBlocks = [];
    const imgStartRegex = /!\[([^\]]*)\]\(/g;
    const matches = [];
    let match;
    
    while ((match = imgStartRegex.exec(processed)) !== null) {
      const startIdx = match.index;
      const alt = match[1];
      let url = '';
      let openBrackets = 1;
      let i = match.index + match[0].length;
      
      while (i < processed.length && openBrackets > 0) {
        if (processed[i] === '(') openBrackets++;
        else if (processed[i] === ')') openBrackets--;
        
        if (openBrackets > 0) {
          url += processed[i];
        }
        i++;
      }
      
      if (openBrackets === 0) {
        matches.push({
          startIdx,
          fullMatch: processed.substring(startIdx, i),
          alt,
          url: url.trim()
        });
        imgStartRegex.lastIndex = i;
      }
    }

    // 使用占位符保护图片标签，防止被后续的 Markdown 解析破坏
    let processedWithPlaceholders = processed;
    for (let i = matches.length - 1; i >= 0; i--) {
      const { startIdx, fullMatch } = matches[i];
      processedWithPlaceholders = processedWithPlaceholders.substring(0, startIdx) + `@@@IMAGEBLOCK${i}@@@` + processedWithPlaceholders.substring(startIdx + fullMatch.length);
    }

    // 3. 处理基础 Markdown 标签
    let htmlResult = processedWithPlaceholders;
    htmlResult = htmlResult.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    htmlResult = htmlResult.replace(/__(.+?)__/g, '<strong>$1</strong>');
    htmlResult = htmlResult.replace(/~~(.+?)~~/g, '<s>$1</s>');
    htmlResult = htmlResult.replace(/\n/g, '<br />');

    // 4. 还原图片
    matches.forEach((m, i) => {
      const encodedUrl = encodeURI(m.url).replace(/\(/g, '%28').replace(/\)/g, '%29');
      const imgHtml = `<img src="${encodedUrl}" alt="${m.alt}" style="max-width: 100%; max-height: 400px; height: auto; display: block; margin: 12px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #eee; background: #f9f9f9;" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x150?text=Image+Load+Failed';" />`;
      htmlResult = htmlResult.split(`@@@IMAGEBLOCK${i}@@@`).join(imgHtml);
    });

    // 5. 最后还原数学公式
    mathBlocks.forEach((block, index) => {
      htmlResult = htmlResult.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return htmlResult;
  };

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
      <TextArea 
        id={id}
        rows={6} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl text-xs leading-relaxed exam-question-editor-font"
        onFocus={() => handleToolbarAction('focus', null)}
      />
      {showPreview && previewVisible && (
        <div className="mt-2 space-y-2">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">预览内容</div>
          <div 
            id={`preview-${id}`}
            className="p-4 bg-white rounded-xl border-2 border-dashed border-blue-100 exam-question-editor-font min-h-[60px]"
          >
            {!(value || '').trim() && previewPlaceholder ? (
              <div className="text-gray-300 italic leading-relaxed text-sm">
                {previewPlaceholder}
              </div>
            ) : (
              <div 
                className="text-gray-900 leading-relaxed break-words markdown-body"
                dangerouslySetInnerHTML={{ 
                  __html: formatText(value || '')
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
