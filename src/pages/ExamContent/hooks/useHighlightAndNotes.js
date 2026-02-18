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
    (event) => {
      event.stopPropagation();
      const selection = window.getSelection();
      const text = selection.toString().trim();
      if (text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
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
      setHighlights((prev) => ({
        ...prev,
        [`highlight-${Date.now()}`]: {
          text: selectedText,
          color,
          questionId: currentQuestion
        }
      }));
      setSelectedText('');
      if (window.getSelection()) window.getSelection().removeAllRanges();
      hideHighlightMenu();
    },
    [selectedText, currentQuestion, hideHighlightMenu]
  );

  const removeHighlight = useCallback(() => {
    const entry = Object.entries(highlights).find(
      ([, h]) => h.text === selectedText && h.questionId === currentQuestion
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
  }, [highlights, selectedText, currentQuestion, hideHighlightMenu]);

  const addUnderline = useCallback(() => {
    setHighlights((prev) => ({
      ...prev,
      [`underline-${Date.now()}`]: {
        text: selectedText,
        color: 'underline',
        questionId: currentQuestion
      }
    }));
    setSelectedText('');
    if (window.getSelection()) window.getSelection().removeAllRanges();
    hideHighlightMenu();
  }, [selectedText, currentQuestion, hideHighlightMenu]);

  const addNote = useCallback(() => {
    if (selectedText) {
      setShowNoteModal(true);
      hideHighlightMenu();
    }
  }, [selectedText, hideHighlightMenu]);

  const saveNote = useCallback(
    (noteText) => {
      if (selectedText && noteText && noteText.trim()) {
        const noteId = `note-${Date.now()}`;
        setNotes((prev) => ({
          ...prev,
          [noteId]: {
            text: selectedText,
            note: noteText.trim(),
            questionId: currentQuestion,
            position: notePosition
          }
        }));
      }
      setShowNoteModal(false);
      setSelectedText('');
      if (window.getSelection()) window.getSelection().removeAllRanges();
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
    (text, questionId) => {
      let processedText = formatText(text);
      Object.entries(highlights).forEach(([id, highlight]) => {
        if (highlight.questionId === questionId) {
          const cls = highlight.color === 'underline' ? 'text-underline' : `highlight-${highlight.color}`;
          const escaped = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          processedText = processedText.replace(
            new RegExp(escaped, 'g'),
            `<span class="${cls}" data-highlight-id="${id}">${highlight.text}</span>`
          );
        }
      });
      return React.createElement('div', {
        dangerouslySetInnerHTML: { __html: processedText },
        onMouseUp: handleTextSelection,
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