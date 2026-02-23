import React, { useEffect, useCallback } from 'react';

import { formatText } from '../utils/formatText';

/**
 * 题干选中、高亮、备注及格式化渲染
 * @param {number} currentQuestion - 当前题 id
 * @param {function} setShowNotesPanel - 控制备注面板显示的函数
 */
export function useHighlightAndNotes(currentQuestion, setShowNotesPanel) {
  const [highlights, setHighlights] = React.useState({});
  const [notes, setNotes] = React.useState({});
  const [selectedText, setSelectedText] = React.useState('');
  const [showNoteModal, setShowNoteModal] = React.useState(false);
  const [notePosition, setNotePosition] = React.useState({ x: 0, y: 0 });
  const [expandedNotes, setExpandedNotes] = React.useState(new Set());

  const hideHighlightMenu = useCallback(() => {
    const el = document.getElementById('highlight-menu');
    if (el) el.style.display = 'none';
  }, []);

  const applyNoteHighlight = useCallback((notesMap, noteId) => {
    const note = notesMap[noteId];
    if (!note) return;
    document.querySelectorAll('.selectable-text').forEach((element) => {
      if (element.textContent.includes(note.text)) {
        const escaped = note.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'g');
        element.innerHTML = element.innerHTML.replace(
            re,
            `<span class="note-highlight" data-note-id="${noteId}">${note.text}</span>`
        );
      }
    });
  }, []);

  const removeNoteHighlight = useCallback((noteId) => {
    document.querySelectorAll(`[data-note-id="${noteId}"]`).forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }, []);

  const handleTextSelection = useCallback(
      (event, textSource) => {
        event.stopPropagation();
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectedText(text);
          // 保存当前文本来源，用于后续添加高亮
          window.currentTextSource = textSource;
          setNotePosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
          setTimeout(() => {
            const menu = document.getElementById('highlight-menu');
            if (menu) {
              menu.style.display = 'block';
              menu.style.left = `${Math.max(10, rect.left + rect.width / 2 - 100)}px`;
              menu.style.top = `${Math.max(10, rect.top + window.scrollY - 50)}px`;
              menu.style.zIndex = '9999';
            }
          }, 50);
        } else {
          hideHighlightMenu();
        }
      },
      [hideHighlightMenu, setShowNotesPanel]
  );

  const addHighlight = useCallback(
      (color) => {
        const selection = window.getSelection();
        const textSource = window.currentTextSource || 'question'; // 默认为题干
        
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;

          // 获取选中文本在容器中的位置信息
          let startOffset = range.startOffset;
          let endOffset = range.endOffset;
          let containerText = container.textContent || '';

          setHighlights((prev) => ({
            ...prev,
            [`highlight-${Date.now()}`]: {
              text: selectedText,
              color,
              questionId: currentQuestion,
              textSource: textSource, // 添加文本来源标识
              // 保存位置信息用于精确标注
              containerText: containerText,
              startOffset: startOffset,
              endOffset: endOffset
            }
          }));
        } else {
          // 回退到原来的逻辑
          setHighlights((prev) => ({
            ...prev,
            [`highlight-${Date.now()}`]: {
              text: selectedText,
              color,
              questionId: currentQuestion,
              textSource: textSource // 添加文本来源标识
            }
          }));
        }
        setSelectedText('');
        if (window.getSelection()) window.getSelection().removeAllRanges();
        hideHighlightMenu();
        // 清除临时保存的文本来源
        window.currentTextSource = null;
      },
      [selectedText, currentQuestion, hideHighlightMenu]
  );

  const removeHighlight = useCallback(() => {
    const textSource = window.currentTextSource || 'question'; // 默认为题干
    const entry = Object.entries(highlights).find(
        ([, h]) => h.text === selectedText && h.questionId === currentQuestion && h.textSource === textSource
    );
    if (entry) {
      setHighlights((prev) => {
        const next = { ...prev };
        delete next[entry[0]];
        return next;
      });
    }
    setSelectedText('');
    if (window.getSelection()) window.getSelection().removeAllRanges();
    hideHighlightMenu();
    // 清除临时保存的文本来源
    window.currentTextSource = null;
  }, [highlights, selectedText, currentQuestion, hideHighlightMenu]);

  const addUnderline = useCallback(() => {
    const selection = window.getSelection();
    const textSource = window.currentTextSource || 'question'; // 默认为题干

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;

      // 获取选中文本在容器中的位置信息
      let startOffset = range.startOffset;
      let endOffset = range.endOffset;
      let containerText = container.textContent || '';

      setHighlights((prev) => ({
        ...prev,
        [`underline-${Date.now()}`]: {
          text: selectedText,
          color: 'underline',
          questionId: currentQuestion,
          textSource: textSource, // 添加文本来源标识
          // 保存位置信息用于精确标注
          containerText: containerText,
          startOffset: startOffset,
          endOffset: endOffset
        }
      }));
    } else {
      // 回退到原来的逻辑
      setHighlights((prev) => ({
        ...prev,
        [`underline-${Date.now()}`]: {
          text: selectedText,
          color: 'underline',
          questionId: currentQuestion,
          textSource: textSource // 添加文本来源标识
        }
      }));
    }
    setSelectedText('');
    if (window.getSelection()) window.getSelection().removeAllRanges();
    hideHighlightMenu();
    // 清除临时保存的文本来源
    window.currentTextSource = null;
  }, [selectedText, currentQuestion, hideHighlightMenu]);

  const addNote = useCallback(() => {
    if (selectedText) {
      setShowNoteModal(true);
      hideHighlightMenu();
    }
  }, [selectedText, hideHighlightMenu]);

  const saveNote = useCallback(
      (noteText) => {
        const textSource = window.currentTextSource || 'question'; // 默认为题干
        
        if (selectedText && noteText && noteText.trim()) {
          const noteId = `note-${Date.now()}`;
          setNotes((prev) => ({
            ...prev,
            [noteId]: {
              text: selectedText,
              note: noteText.trim(),
              questionId: currentQuestion,
              textSource: textSource, // 添加文本来源标识
              position: notePosition
            }
          }));
        }
        setShowNoteModal(false);
        setSelectedText('');
        if (window.getSelection()) window.getSelection().removeAllRanges();
        // 清除临时保存的文本来源
        window.currentTextSource = null;
      },
      [selectedText, currentQuestion, notePosition]
  );

  const toggleNoteExpansion = useCallback(
      (noteId) => {
        setExpandedNotes((prev) => {
          const next = new Set(prev);
          if (next.has(noteId)) {
            next.delete(noteId);
            removeNoteHighlight(noteId);
          } else {
            next.add(noteId);
            setNotes((currentNotes) => {
              applyNoteHighlight(currentNotes, noteId);
              return currentNotes;
            });
          }
          return next;
        });
      },
      [removeNoteHighlight, applyNoteHighlight]
  );

  const deleteNote = useCallback(
      (noteId) => {
        removeNoteHighlight(noteId);
        setNotes((prev) => {
          const next = { ...prev };
          delete next[noteId];
          return next;
        });
        setExpandedNotes((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });
      },
      [removeNoteHighlight]
  );

  const renderFormattedText = useCallback(
      (text, questionId, textSource = 'question') => {
        let processedText = formatText(text);

        Object.entries(highlights).forEach(([id, highlight]) => {
          // 只应用匹配当前文本来源的高亮
          if (highlight.questionId === questionId && highlight.textSource === textSource) {
            const cls = highlight.color === 'underline' ? 'text-underline' : `highlight-${highlight.color}`;

            // 如果有位置信息，使用精确位置标注
            if (highlight.containerText && highlight.startOffset !== undefined && highlight.endOffset !== undefined) {
              const containerText = highlight.containerText;
              const startOffset = highlight.startOffset;
              const endOffset = highlight.endOffset;

              // 在原始文本中找到选中文本的位置
              const beforeText = containerText.substring(0, startOffset);
              const selectedText = containerText.substring(startOffset, endOffset);
              const afterText = containerText.substring(endOffset);

              // 对选中文本进行HTML转义
              const escapedSelectedText = selectedText
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');

              // 构建精确的高亮文本
              const highlightedText = beforeText +
                  // `<span class="${cls}" data-highlight-id="${id}">${selectedText}</span>` +
                  `<span class="${cls}" data-highlight-id="${id}">${escapedSelectedText}</span>` +
                  afterText;

              // 如果当前处理的文本包含原始容器文本，则进行替换
              if (processedText.includes(containerText)) {
                processedText = processedText.replace(containerText, highlightedText);
              } else {
                // 回退到原来的匹配逻辑
                const escaped = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escaped})(?![^<]*>)(?![^<]*</span>)`);
                processedText = processedText.replace(
                    regex,
                    `<span class="${cls}" data-highlight-id="${id}">$1</span>`
                );
              }
            } else {
              // 没有位置信息时使用原来的逻辑（只匹配第一个）
              const escaped = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`(${escaped})(?![^<]*>)(?![^<]*</span>)`);
              processedText = processedText.replace(
                  regex,
                  `<span class="${cls}" data-highlight-id="${id}">$1</span>`
              );
            }
          }
        });

        return React.createElement('div', {
          dangerouslySetInnerHTML: { __html: processedText },
          onMouseUp: (e) => handleTextSelection(e, textSource),
          className: 'selectable-text math-content',
          role: 'presentation'
        });
      },
      [highlights, handleTextSelection]
  );

  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('#highlight-menu') && !window.getSelection().toString()) {
        hideHighlightMenu();
      }
    };
    const onSelectionChange = () => {
      if (!window.getSelection().toString()) hideHighlightMenu();
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [hideHighlightMenu]);

  return {
    highlights,
    notes,
    selectedText,
    setSelectedText,
    showNoteModal,
    setShowNoteModal,
    notePosition,
    expandedNotes,
    handleTextSelection,
    addHighlight,
    removeHighlight,
    addUnderline,
    addNote,
    saveNote,
    toggleNoteExpansion,
    deleteNote,
    hideHighlightMenu,
    renderFormattedText
  };
}