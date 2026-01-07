import { Input } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = '输入内容...', 
  showPreview = true,
  id,
  onRenderMath,
  showToolbar = true,
  onToolbarAction
}) {
  const [previewVisible, setPreviewVisible] = useState(showPreview);

  const formatText = (text) => {
    if (!text) return text;
    
    const mathBlocks = [];
    let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/(?<!\*)(\*)(?!\*)(.+?)(?<!\*)(\*)(?!\*)/g, '<em>$2</em>');
    processed = processed.replace(/(?<!_)(_)(?!_)(.+?)(?<!_)(_)(?!_)/g, '<em>$2</em>');
    processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');
    processed = processed.replace(/\n/g, '<br />');

    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
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

  // 自动渲染数学公式
  React.useEffect(() => {
    if (showPreview && value && onRenderMath) {
      setTimeout(() => {
        onRenderMath();
      }, 100);
    }
  }, [value, showPreview, onRenderMath]);

  return (
    <div>
      <TextArea 
        id={id}
        rows={6} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl font-mono text-xs leading-relaxed"
        onFocus={() => handleToolbarAction('focus', null)}
      />
      {showPreview && previewVisible && (
        <div 
          id={`preview-${id}`}
          className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div 
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: formatText(value || '')
            }}
          />
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;

