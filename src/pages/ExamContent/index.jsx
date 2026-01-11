import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Button, Drawer, Space } from 'antd';

import {
  BarChartOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined
} from '@ant-design/icons';

function ExamContent() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showDirections, setShowDirections] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showTimeMode, setShowTimeMode] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [timeMode, setTimeMode] = useState('timed');
  const [timeRemaining, setTimeRemaining] = useState(34 * 60 + 55);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [examStarted, setExamStarted] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedText, setSelectedText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 });
  const [expandedNotes, setExpandedNotes] = useState(new Set());
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showTimeAsIcon, setShowTimeAsIcon] = useState(false);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [hideTime, setHideTime] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('All');
  const [showReference, setShowReference] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});

  useEffect(() => {
    if (isPreparing) {
      const timer = setTimeout(() => {
        setIsPreparing(false);
        setQuestionStartTime(Date.now());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPreparing]);

  useEffect(() => {
    if (examStarted && !isPreparing && !examFinished) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, examStarted, isPreparing, examFinished]);

  useEffect(() => {
    // 立即隐藏未渲染的公式，避免闪烁
    const containers = document.querySelectorAll('.selectable-text, .math-content');
    containers.forEach(container => {
      container.style.visibility = 'hidden';
    });

    const timer = setTimeout(() => {
      if (window.renderMathInElement) {
        containers.forEach(container => {
          try {
            window.renderMathInElement(container, {
              delimiters: [
                {left: '$', right: '$', display: false},
                {left: '$$', right: '$$', display: true}
              ],
              throwOnError: false,
              strict: false
            });
            // 渲染完成后显示内容
            container.style.visibility = 'visible';
          } catch (error) {
            console.error('KaTeX rendering error:', error);
            container.style.visibility = 'visible';
          }
        });
      } else {
        // 如果 KaTeX 不可用，直接显示
        containers.forEach(container => {
          container.style.visibility = 'visible';
        });
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentQuestion, showDirections, examFinished]);

  const formatText = (text) => {
    if (!text) return text;

    // 1. 保护数学公式 - 使用不含下划线的占位符，避免被 Markdown 斜体逻辑干扰
    const mathBlocks = [];
    let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
      const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(match);
      return placeholder;
    });

    // 2. 粗体与斜体
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // 处理无序列表 (以 • 开头的行)
    processed = processed.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•')) {
        return `<div class="flex items-start space-x-3 mb-2 ml-2">
          <span class="text-red-600 font-bold mt-0.5">•</span>
          <span class="flex-1">${trimmed.substring(1).trim()}</span>
        </div>`;
      }
      return line;
    }).join('\n');

    // 换行处理 (排除已经包含 div 的行，避免双重换行)
    processed = processed.split('\n').map(line => {
      if (line.includes('<div') || line.includes('<table') || line.includes('<tr') || line.includes('<td') || line.includes('<th')) {
        return line;
      }
      return line + '<br />';
    }).join('');
    
    // 3. 还原数学公式 - 使用 split/join 确保替换所有可能的占位符
    mathBlocks.forEach((block, index) => {
      processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
    });

    return processed;
  };

  const handleTextSelection = (event) => {
    event.stopPropagation();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selectedText);
      setNotePosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      
      setTimeout(() => {
        const highlightMenu = document.getElementById('highlight-menu');
        if (highlightMenu) {
          highlightMenu.style.display = 'block';
          highlightMenu.style.left = `${Math.max(10, rect.left + rect.width / 2 - 100)}px`;
          highlightMenu.style.top = `${Math.max(10, rect.top + window.scrollY - 50)}px`;
          highlightMenu.style.zIndex = '9999';
        }
      }, 50);
    } else {
      hideHighlightMenu();
    }
  };

  const addHighlight = (color) => {
    if (selectedText) {
      const highlightId = `highlight-${Date.now()}`;
      setHighlights(prev => ({
        ...prev,
        [highlightId]: {
          text: selectedText,
          color: color,
          questionId: currentQuestion
        }
      }));
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const removeHighlight = () => {
    if (selectedText) {
      const highlightToRemove = Object.entries(highlights).find(([id, highlight]) => 
        highlight.text === selectedText && highlight.questionId === currentQuestion
      );
      
      if (highlightToRemove) {
        setHighlights(prev => {
          const newHighlights = { ...prev };
          delete newHighlights[highlightToRemove[0]];
          return newHighlights;
        });
      }
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const addUnderline = () => {
    if (selectedText) {
      const underlineId = `underline-${Date.now()}`;
      setHighlights(prev => ({
        ...prev,
        [underlineId]: {
          text: selectedText,
          color: 'underline',
          questionId: currentQuestion
        }
      }));
      
      window.getSelection().removeAllRanges();
      setSelectedText('');
      hideHighlightMenu();
    }
  };

  const addNote = () => {
    if (selectedText) {
      setShowNoteModal(true);
      hideHighlightMenu();
    }
  };

  const saveNote = (noteText) => {
    if (selectedText && noteText.trim()) {
      const noteId = `note-${Date.now()}`;
      setNotes(prev => ({
        ...prev,
        [noteId]: {
          text: selectedText,
          note: noteText,
          questionId: currentQuestion,
          position: notePosition
        }
      }));
    }
    
    setShowNoteModal(false);
    setSelectedText('');
    window.getSelection().removeAllRanges();
  };

  const toggleNoteExpansion = (noteId) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
        removeNoteHighlight(noteId);
      } else {
        newSet.add(noteId);
        addNoteHighlight(noteId);
      }
      return newSet;
    });
  };

  const addNoteHighlight = (noteId) => {
    const note = notes[noteId];
    if (!note) return;
    
    const textElements = document.querySelectorAll('.selectable-text');
    textElements.forEach(element => {
      if (element.textContent.includes(note.text)) {
        const innerHTML = element.innerHTML;
        const highlightedHTML = innerHTML.replace(
          new RegExp(note.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<span class="note-highlight" data-note-id="${noteId}">${note.text}</span>`
        );
        element.innerHTML = highlightedHTML;
      }
    });
  };

  const removeNoteHighlight = (noteId) => {
    const highlightElements = document.querySelectorAll(`[data-note-id="${noteId}"]`);
    highlightElements.forEach(element => {
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
      parent.normalize();
    });
  };

  const deleteNote = (noteId) => {
    removeNoteHighlight(noteId);
    
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[noteId];
      return newNotes;
    });
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteId);
      return newSet;
    });
  };

  const hideHighlightMenu = () => {
    const highlightMenu = document.getElementById('highlight-menu');
    if (highlightMenu) {
      highlightMenu.style.display = 'none';
    }
  };

  const renderFormattedText = (text, questionId) => {
    let processedText = formatText(text);
    
    Object.entries(highlights).forEach(([id, highlight]) => {
      if (highlight.questionId === questionId) {
        const highlightClass = highlight.color === 'underline' ? 'text-underline' : `highlight-${highlight.color}`;
        processedText = processedText.replace(
          new RegExp(highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<span class="${highlightClass}" data-highlight-id="${id}">${highlight.text}</span>`
        );
      }
    });
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedText }}
        onMouseUp={handleTextSelection}
        className="selectable-text math-content"
      />
    );
  };

  React.useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('#highlight-menu') && !window.getSelection().toString()) {
        hideHighlightMenu();
      }
    };
    
    const handleSelectionChange = () => {
      if (!window.getSelection().toString()) {
        hideHighlightMenu();
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const examData = {
    title: 'Section 1, Module 1: Reading and Writing',
    totalQuestions: 27,
    directions: {
      title: 'Directions',
      content: `The questions in this section address a number of important reading and writing skills.
Use of a calculator is not permitted for this section. These directions can be accessed throughout the test.

**For multiple-choice questions**, solve each problem and choose the correct answer from the choices provided.
Each multiple-choice question has a single correct answer.

**Mathematical Formulas Reference:**
• Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
• Area of a Circle: $A = \\pi r^2$
• Pythagorean Theorem: $a^2 + b^2 = c^2$

**Reference Table:**
<table class="w-full border-collapse border border-gray-200 mt-0 mb-6 text-sm rounded-xl overflow-hidden">
      <thead>
        <tr class="bg-gray-50">
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">Property</th>
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">Formula / Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Slope-Intercept Form</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$y = mx + b$</td>
    </tr>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Volume of a Sphere</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$V = \\frac{4}{3}\\pi r^3$</td>
    </tr>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Constant $\\pi$</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$\\approx 3.14159$</td>
    </tr>
  </tbody>
</table>

**For student-produced response questions:**
• If you find more than one correct answer, enter only one answer.
• You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.
• If your answer is a fraction that doesn't fit in the provided space, enter the decimal equivalent.
• If your answer is a decimal that doesn't fit in the provided space, enter it by truncating or rounding at the fourth digit.`
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '求解方程 $x^2 + 5x + 6 = 0$ 的解',
        description: '这是一道二次方程求解题，需要使用因式分解或求根公式来找出方程的所有解。',
        options: ['A) x = -2 或 x = -3', 'B) x = 2 或 x = 3', 'C) x = -1 或 x = -6', 'D) x = 1 或 x = 6'],
        correctAnswer: 'A'
      },
      {
        id: 2,
        type: 'student-produced',
        question: '计算 $\\sum_{i=1}^{n}$ 当 n=5 时的值',
        description: '求和公式 $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$，请计算当 n=5 时的结果。',
        answerFormat: 'Enter your answer as a number.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: '根据以下数据，$\\sqrt{x}$ 当 x=16 时的值是多少？',
        description: '平方根运算：找出一个数，使其平方等于给定的数值。',
        options: ['A) 2', 'B) 4', 'C) 8', 'D) 16'],
        correctAnswer: 'B'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: '以下哪个公式表示**分数**的正确形式？',
        description: '识别数学表达式中分数的标准写法。',
        options: ['A) $\\frac{numerator}{denominator}$', 'B) $\\sqrt{x}$', 'C) $x^{n}$', 'D) $\\sum_{i=1}^{n}$'],
        correctAnswer: 'A'
      },
      {
        id: 5,
        type: 'student-produced',
        question: '计算 $x^{2}$ 当 x=3 时的值',
        answerFormat: 'Enter your answer as a number.'
      },
      {
        id: 6,
        type: 'multiple-choice',
        question: '积分符号 $\\int_{lower}^{upper}$ 中，lower 和 upper 分别代表什么？',
        options: ['A) 上限和下限', 'B) 下限和上限', 'C) 左边界和右边界', 'D) 起点和终点'],
        correctAnswer: 'B'
      },
      {
        id: 7,
        type: 'multiple-choice',
        question: '极限符号 $\\lim_{x \\to infinity}$ 表示什么含义？',
        options: ['A) x 趋向于 0', 'B) x 趋向于无穷大', 'C) x 趋向于 1', 'D) x 趋向于负无穷'],
        correctAnswer: 'B'
      },
      {
        id: 8,
        type: 'student-produced',
        question: '如果 $\\frac{a}{b} = \\frac{3}{4}$，且 a = 6，求 b 的值',
        answerFormat: 'Enter your answer as a number.'
      },
      {
        id: 9,
        type: 'multiple-choice',
        question: '下列哪个表达式等价于 $\\sqrt{x}$ 当 x = 25？',
        options: ['A) 5', 'B) 12.5', 'C) 25', 'D) 50'],
        correctAnswer: 'A'
      },
      {
        id: 10,
        type: 'multiple-choice',
        question: '求和符号 $\\sum_{i=1}^{5} i$ 的结果是多少？',
        options: ['A) 10', 'B) 15', 'C) 20', 'D) 25'],
        correctAnswer: 'B'
      },
      {
        id: 11,
        type: 'student-produced',
        question: '计算 $x^{3}$ 当 x = 2 时的值',
        answerFormat: 'Enter your answer as a number.'
      },
      {
        id: 12,
        type: 'multiple-choice-with-image',
        question: 'Based on the graph shown, what is the approximate value of y when x = 3?',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        imageAlt: 'Line graph showing relationship between x and y',
        options: ['A) 5', 'B) 7', 'C) 9', 'D) 11'],
        correctAnswer: 'C'
      },
      {
        id: 13,
        type: 'table-question',
        question: 'The table below shows the number of students enrolled in different courses. Which course has the highest enrollment?',
        table: {
          title: 'Student Enrollment by Course',
          headers: ['Course', 'Fall 2023', 'Spring 2024', 'Total'],
          rows: [
            ['Mathematics', '120', '135', '255'],
            ['English', '145', '150', '295'],
            ['Science', '110', '125', '235'],
            ['History', '95', '105', '200']
          ]
        },
        options: ['A) Mathematics', 'B) English', 'C) Science', 'D) History'],
        correctAnswer: 'B'
      },
      {
        id: 14,
        type: 'reading-passage',
        question: 'Which of the following best describes the main purpose of the passage?',
        passage: 'Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, caused primarily by greenhouse gas emissions from human activities, are leading to widespread environmental changes. These include melting polar ice caps, rising sea levels, and more frequent extreme weather events. Scientists warn that without immediate action to reduce carbon emissions, the consequences could be catastrophic for future generations.',
        options: [
          'A) To explain the causes of climate change',
          'B) To describe the effects of rising temperatures',
          'C) To warn about the urgency of addressing climate change',
          'D) To compare different environmental challenges'
        ],
        correctAnswer: 'C'
      },
      {
        id: 15,
        type: 'student-produced-with-image',
        question: 'The diagram shows a rectangular garden. If the length is 12 meters and the width is 8 meters, what is the area in square meters?',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop',
        imageAlt: 'Diagram of a rectangular garden',
        answerFormat: 'Enter your answer as a number.'
      },
      {
        id: 16,
        type: 'complex-table',
        question: 'The table shows the average monthly temperatures (in °C) for three cities. Which city has the greatest temperature variation between summer and winter?',
        table: {
          title: 'Average Monthly Temperatures (°C)',
          headers: ['Month', 'City A', 'City B', 'City C'],
          rows: [
            ['January', '5', '-2', '12'],
            ['April', '15', '8', '18'],
            ['July', '25', '22', '28'],
            ['October', '16', '10', '20']
          ]
        },
        options: ['A) City A', 'B) City B', 'C) City C', 'D) All cities have equal variation'],
        correctAnswer: 'B'
      },
      {
        id: 17,
        type: 'image-with-blanks',
        question: 'Complete the sentences based on the pie chart showing market share distribution.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        imageAlt: 'Pie chart showing market share',
        content: 'Company A holds _____ of the market share, while Company B has _____ percent. Together, they control _____ of the total market.',
        blanks: [
          { id: 'blank1', placeholder: 'percentage' },
          { id: 'blank2', placeholder: 'number' },
          { id: 'blank3', placeholder: 'fraction' }
        ]
      },
      {
        id: 18,
        type: 'multiple-choice-with-image',
        question: 'According to the bar chart, which year showed the greatest increase in sales compared to the previous year?',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        imageAlt: 'Bar chart showing annual sales data',
        options: ['A) 2020', 'B) 2021', 'C) 2022', 'D) 2023'],
        correctAnswer: 'C'
      }
    ]
  };

  useEffect(() => {
    if (!examStarted || timeMode === 'untimed') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeMode]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return examData.questions.find(q => q.id === currentQuestion);
  };

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const recordQuestionTime = (questionId) => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - questionStartTime) / 1000);
    
    setQuestionTimes(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + timeSpent
    }));
  };

  const goToQuestion = (questionNum) => {
    recordQuestionTime(currentQuestion);
    setCurrentQuestion(questionNum);
    setShowProgress(false);
  };

  const goToPrevious = () => {
    if (currentQuestion > 1) {
      recordQuestionTime(currentQuestion);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < examData.totalQuestions) {
      recordQuestionTime(currentQuestion);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const currentQ = getCurrentQuestion();

  const startExam = () => {
    setShowTimeMode(false);
    setShowIntro(true);
  };

  const beginExam = () => {
    setExamStarted(true);
    setShowIntro(false);
    setQuestionStartTime(Date.now());
  };

  const handleFinishExam = () => {
    recordQuestionTime(currentQuestion);
    setExamFinished(true);
    setShowEndExamModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatQuestionTime = (seconds) => {
    if (!seconds) return '0秒';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}秒`;
    return `${mins}分${secs}秒`;
  };

  const calculateScore = () => {
    const total = examData.totalQuestions;
    const answered = Object.keys(answers).length;
    const correct = examData.questions.filter(q => {
      if (q.type === 'multiple-choice' || q.type === 'reading-passage' || q.type === 'table-question' || q.type === 'complex-table' || q.type === 'multiple-choice-with-image') {
        return answers[q.id] === q.correctAnswer;
      }
      return false; // 简化逻辑，填空题暂不自动判分
    }).length;
    
    // 模拟 SAT 评分逻辑 (400-1600)
    const baseScore = 400;
    const rwScore = 200 + Math.round((correct / total) * 600 * 0.6);
    const mathScore = 200 + Math.round((correct / total) * 600 * 0.4);
    
    return {
      total: rwScore + mathScore,
      rw: rwScore,
      math: mathScore,
      correct,
      incorrect: answered - correct,
      omitted: total - answered
    };
  };

  if (isPreparing) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-serif text-gray-800 mb-8 tracking-tight">
          We're Preparing Your Practice Test
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full flex flex-col items-center text-center">
          <div className="relative mb-10">
            <div className="w-24 h-24 flex items-center justify-center">
              <i className="fas fa-hourglass-half text-6xl text-red-500/80 animate-pulse"></i>
            </div>
            {/* 装饰性小点，模拟沙漏掉落 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 flex flex-col space-y-1">
              <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-[280px]">
            This may take up to a minute. Please don't refresh this page or quit the app.
          </p>
        </div>
      </div>
    );
  }

  if (examFinished) {
    const scores = calculateScore();
    return (
      <div className="min-h-screen bg-[#f3f4f7] pb-20">
        {/* 顶部导航 */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-trophy text-white"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Practice Test Report</h1>
            </div>
            <button 
              onClick={() => navigate('/practice-record')}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
            >
              <i className="fas fa-times mr-2"></i> Exit
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* 成绩卡片 */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Current SAT Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-black text-gray-900">{scores.total}</div>
                  <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Total Score</div>
                  <div className="text-xs text-gray-400">400–1600</div>
                </div>
                <div className="text-center space-y-2 border-x border-gray-100">
                  <div className="text-5xl font-bold text-gray-800">{scores.rw}</div>
                  <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Reading and Writing</div>
                  <div className="text-xs text-gray-400">200–800</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-gray-800">{scores.math}</div>
                  <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Math</div>
                  <div className="text-xs text-gray-400">200–800</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0071ce] p-6 text-white text-center">
              <p className="text-sm font-medium">
                This score is based on your performance on this practice test. Use this report to identify areas for improvement.
              </p>
            </div>
          </div>

          {/* 题目概览表格 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{examData.totalQuestions}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{scores.correct}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{scores.incorrect + scores.omitted}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase">Incorrect/Omitted</div>
                </div>
              </div>
              
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {/* {['All', 'Reading and Writing', 'Math'].map(tab => ( */}
                {['All'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveReportTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeReportTab === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Question</th>
                    <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                    <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Your Answer</th>
                    <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Correct Answer</th>
                    <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Time Spent</th>
                    {/* <th className="pb-4 text-right font-bold text-gray-400 text-xs uppercase tracking-wider">Action</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {examData.questions.map((q, idx) => {
                    const isCorrect = answers[q.id] === q.correctAnswer;
                    const isOmitted = !answers[q.id];
                    return (
                      <tr key={q.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-bold text-gray-700">{idx + 1}</td>
                        <td className="py-4">
                          {isCorrect ? (
                            <span className="text-blue-600"><i className="fas fa-check-circle mr-2"></i>Correct</span>
                          ) : isOmitted ? (
                            <span className="text-red-400"><i className="fas fa-minus-circle mr-2"></i>Omitted</span>
                          ) : (
                            <span className="text-red-500"><i className="fas fa-times-circle mr-2"></i>Incorrect</span>
                          )}
                        </td>
                        <td className={`py-4 font-bold ${isCorrect ? 'text-blue-600' : 'text-red-500'}`}>
                          {answers[q.id] || 'Omitted'}
                        </td>
                        <td className="py-4 font-bold text-gray-900">{q.correctAnswer || 'N/A'}</td>
                        <td className="py-4">
                          <span className="text-gray-700 font-medium">
                            {formatQuestionTime(questionTimes[q.id])}
                          </span>
                        </td>
                        {/* <td className="py-4 text-right">
                          <button 
                            onClick={() => {
                              const element = document.getElementById(`review-q-${q.id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                          >
                            Review
                          </button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 详细解析列表 */}
          <div className="space-y-12 mt-12">
            {/* <h2 className="text-3xl font-bold text-gray-900 border-l-8 border-red-600 pl-6">Question Review</h2> */}
            {/* {examData.questions.map((q, idx) => ( */}
            {[].map((q, idx) => (
              <div key={q.id} id={`review-q-${q.id}`} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-bold">Question {idx + 1}</span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        <i className="fas fa-clock mr-1"></i>
                        {formatQuestionTime(questionTimes[q.id])}
                      </span>
                    </div>
                    {answers[q.id] === q.correctAnswer ? (
                      <span className="text-blue-600 font-bold"><i className="fas fa-check mr-2"></i>Correct</span>
                    ) : (
                      <span className="text-red-500 font-bold"><i className="fas fa-times mr-2"></i>Incorrect</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="text-lg font-medium text-gray-900 leading-relaxed">
                        {renderFormattedText(q.question, q.id)}
                      </div>
                      {q.passage && (
                        <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-red-500 text-gray-700 italic">
                          {renderFormattedText(q.passage, q.id)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {q.options?.map((opt, i) => {
                          const optChar = opt.charAt(0);
                          const isUserChoice = answers[q.id] === optChar;
                          const isCorrect = q.correctAnswer === optChar;
                          
                          return (
                            <div 
                              key={i}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                isCorrect 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : isUserChoice 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  isCorrect ? 'bg-blue-500 text-white' : isUserChoice ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {optChar}
                                </div>
                                <div className="text-gray-800 flex-1">
                                  {renderFormattedText(opt.substring(3), q.id)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 解析盒子 */}
                      {/* <div className="mt-8 border-2 border-red-100 rounded-2xl overflow-hidden">
                        <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center">
                          <i className="fas fa-lightbulb text-red-500 mr-2"></i>
                          <span className="font-bold text-red-700">Correct Answer & Analysis</span>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Correct Answer</span>
                            <div className="text-2xl font-black text-gray-900">{q.correctAnswer}</div>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Explanation</span>
                            <div className="mt-2 text-gray-700 leading-relaxed">
                              {renderFormattedText(q.explanation || "The correct answer is " + q.correctAnswer + ". This question tests your ability to analyze the relationship between variables in the given context.", q.id)}
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 返回顶部 */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 transition-all border border-gray-100"
        >
          <i className="fas fa-arrow-up text-xl"></i>
        </button>
      </div>
    );
  }

  if (showTimeMode) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Choose a Time Mode for Your Practice
            </h1>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-medium text-gray-900">
                  Timing <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-500">* = Required</span>
              </div>
              
              <div className="relative">
                <select
                  value={timeMode}
                  onChange={(e) => setTimeMode(e.target.value)}
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="timed">✓ Timed</option>
                  <option value="untimed">Untimed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={startExam}
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Start Practice
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                <strong>Timed:</strong> Practice with time limits to simulate real exam conditions
              </p>
              <p className="mt-2">
                <strong>Untimed:</strong> Practice at your own pace without time pressure
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center py-16 px-4">
        <h1 className="text-4xl font-serif text-gray-800 mb-12 tracking-tight">Practice Test</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-2xl w-full space-y-12">
          <div className="flex items-start space-x-8">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <i className="far fa-clock text-2xl text-gray-700"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Timing</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice tests are timed, but you can pause them. To continue on another device, you have to start over. We delete incomplete practice tests after 90 days.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-8">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <i className="fas fa-file-signature text-2xl text-gray-700"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scores</h3>
              <p className="text-gray-600 leading-relaxed">
                When you finish the practice test, go to My Practice to see your scores and get personalized study tips.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-8">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <i className="fas fa-user-check text-2xl text-gray-700"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Assistive Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                If you use assistive technology, try it out on the practice test so you know what to expect on test day.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-8">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <i className="fas fa-lock-open text-2xl text-gray-700"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Device Lock</h3>
              <p className="text-gray-600 leading-relaxed">
                We don't lock your device during practice. On test day, you'll be blocked from accessing other programs or apps.
              </p>
            </div>
          </div>

          <div className="pt-8 flex justify-center">
            <button 
              onClick={beginExam}
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">{examData.title}</h1>
            <Button
              type="link"
              onClick={() => setShowDirections(true)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center"
            >
              <i className="fas fa-info-circle mr-1.5 text-xs"></i>
              <span className="underline underline-offset-4">Directions</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-6">
            {timeMode === 'timed' && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                {!hideTime && (
                  <div className="flex items-center">
                    {showTimeAsIcon ? (
                      <Button
                        type="text"
                        icon={<ClockCircleOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setShowTimeAsIcon(false)}
                        title={`剩余时间: ${formatTime(timeRemaining)}`}
                        className="flex items-center justify-center p-0 h-auto text-gray-700"
                      />
                    ) : (
                      <Button
                        type="text"
                        onClick={() => setShowTimeAsIcon(true)}
                        className="text-xl font-mono font-black text-gray-800 p-0 h-auto leading-none hover:text-red-600 transition-colors"
                        title="点击切换为图标显示"
                      >
                        {formatTime(timeRemaining)}
                      </Button>
                    )}
                  </div>
                )}
                {hideTime && (
                  <ClockCircleOutlined style={{ fontSize: '20px', color: '#9ca3af' }} />
                )}
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <Button 
                  size="small"
                  onClick={() => setHideTime(!hideTime)}
                  className="h-7 px-3 rounded-lg bg-white border-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-wider hover:text-red-600 hover:border-red-200 transition-all shadow-none"
                >
                  {hideTime ? 'Show' : 'Hide'}
                </Button>
              </div>
            )}
            {timeMode === 'untimed' && (
              <div className="text-lg font-medium text-gray-600">
                Untimed Practice
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowReference(true)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Reference
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800">More</button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <i className="fas fa-times"></i>
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto p-3 sm:p-6">
          <div className={`grid gap-4 sm:gap-6 min-h-[calc(100vh-220px)] ${showNotesPanel ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 lg:grid-cols-8'}`}>
            <div className={`col-span-1 lg:col-span-5 bg-white rounded-lg p-4 sm:p-6 shadow-sm relative flex flex-col`}>
              {/* <button
                onClick={() => setShowNotesPanel(!showNotesPanel)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  showNotesPanel 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                }`}
                title={showNotesPanel ? '隐藏备注区域' : '显示备注区域'}
              >
                {Object.entries(notes).filter(([noteId, note]) => note.questionId === currentQuestion).length > 0 ? (
                  <span className="relative">
                    <i className="fas fa-sticky-note"></i>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {Object.entries(notes).filter(([noteId, note]) => note.questionId === currentQuestion).length}
                    </span>
                  </span>
                ) : (
                  <i className="fas fa-sticky-note"></i>
                )}
              </button> */}
              <div className="pb-4 mb-6">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestion} of {examData.totalQuestions}
                </span>
              </div>
              
              {currentQ && (
                <div className="space-y-6 flex-1">
                  <div 
                    className="text-lg font-medium text-gray-900 selectable-text"
                    onMouseUp={handleTextSelection}
                  >
                    {renderFormattedText(currentQ.question, currentQuestion)}
                  </div>
                  
                  {currentQ.description && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm font-semibold text-blue-900 mb-2">
                        <i className="fas fa-info-circle mr-2"></i>问题描述
                      </div>
                      <div className="text-sm text-blue-800 leading-relaxed">
                        {renderFormattedText(currentQ.description, currentQuestion)}
                      </div>
                    </div>
                  )}
                  
                  {currentQ.type === 'reading-passage' && currentQ.passage && (
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="prose max-w-none text-gray-700 leading-relaxed text-sm">
                        {renderFormattedText(currentQ.passage, currentQuestion)}
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'multiple-choice-with-image' || 
                    currentQ.type === 'student-produced-with-image' || 
                    currentQ.type === 'image-with-blanks') && currentQ.image && (
                    <div>
                      <img
                        src={currentQ.image}
                        alt={currentQ.imageAlt || 'Question image'}
                        className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  {(currentQ.type === 'table-question' || currentQ.type === 'complex-table') && (
                    <div className="overflow-x-auto">
                      {currentQ.table.title && (
                        <div className="mb-4 text-center font-semibold text-gray-900 text-sm">
                          {renderFormattedText(currentQ.table.title, currentQuestion)}
                        </div>
                      )}
                      
                      <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            {currentQ.table.headers.map((header, index) => (
                            <th key={index} className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-900">
                              {renderFormattedText(header, currentQuestion)}
                            </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentQ.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-300 px-2 py-1 text-gray-700">
                                {renderFormattedText(cell, currentQuestion)}
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
            </div>

            {showNotesPanel && (
              <div className="col-span-1 lg:col-span-3 bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col">
                <div className="space-y-4 flex-1">
                  {Object.entries(notes)
                    .filter(([noteId, note]) => note.questionId === currentQuestion)
                    .map(([noteId, note], index) => (
                      <div
                        key={noteId}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 transition-all duration-300"
                      >
                        {expandedNotes.has(noteId) ? (
                          <div>
                            <div className="text-sm text-gray-700 mb-3 p-3 bg-yellow-100 rounded-md border-l-3 border-yellow-400">
                              "{note.text}"
                            </div>
                            <div className="text-sm text-gray-800 leading-relaxed mb-3">{note.note}</div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => toggleNoteExpansion(noteId)}
                                className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                                title="收起"
                              >
                                <i className="fas fa-chevron-up"></i>
                              </button>
                              <button
                                onClick={() => deleteNote(noteId)}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="删除备注"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center h-6">
                            <i className="fas fa-sticky-note text-yellow-600 text-base mr-3 flex-shrink-0"></i>
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="text-sm text-yellow-700 font-medium truncate">
                                {note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                onClick={() => toggleNoteExpansion(noteId)}
                                className="w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors"
                                title="展开备注"
                              >
                                <i className="fas fa-chevron-down"></i>
                              </button>
                              <button
                                onClick={() => deleteNote(noteId)}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="删除备注"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  
                  {Object.entries(notes).filter(([noteId, note]) => note.questionId === currentQuestion).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <i className="fas fa-sticky-note text-3xl mb-3"></i>
                      <p className="text-sm">暂无备注</p>
                      <p className="text-sm mt-2">选中文字后可添加备注</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`col-span-1 ${showNotesPanel ? 'lg:col-span-4' : 'lg:col-span-3'} bg-white rounded-lg p-4 sm:p-6 shadow-sm flex flex-col`}>
              <div className="pb-4 mb-6">
                <div className="flex items-center justify-end">
                  {/* <Button
                    size="small"
                    icon={<FlagOutlined />}
                    onClick={toggleMarkForReview}
                    className={markedForReview.has(currentQuestion) ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                  >
                    {markedForReview.has(currentQuestion) ? 'Marked for Review' : 'Mark for Review'}
                  </Button> */}
                </div>
              </div>
              {currentQ && (
                <div className="space-y-6">
                  {currentQ.description && (
                    <div className="mb-6">
                      <div className="text-base text-gray-900 leading-relaxed">
                        {renderFormattedText(currentQ.description, currentQuestion)}
                      </div>
                    </div>
                  )}
                  
                  {(currentQ.type === 'multiple-choice' || 
                    currentQ.type === 'multiple-choice-with-image' || 
                    currentQ.type === 'reading-passage') && (
                    <div className="space-y-4">
                      {currentQ.type === 'reading-passage' && currentQ.followUpQuestion && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg">
                          <div className="font-medium text-gray-900 mb-4">
                            {renderFormattedText(currentQ.followUpQuestion, currentQuestion)}
                          </div>
                        </div>
                      )}
                      
                  {(currentQ.options || (currentQ.type === 'reading-passage' && currentQ.options))?.map((option, index) => (
                    <label 
                      key={index} 
                      className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
                    >
                      <div className="modern-radio">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option.charAt(0)}
                          checked={answers[currentQuestion] === option.charAt(0)}
                          onChange={(e) => handleAnswerSelect(e.target.value)}
                        />
                        <div className="modern-radio-circle"></div>
                      </div>
                      <div 
                        className="radio-text flex-1 selectable-text"
                        onMouseUp={handleTextSelection}
                      >
                        {renderFormattedText(option, currentQuestion)}
                      </div>
                    </label>
                  ))}
                    </div>
                  )}

                  {(currentQ.type === 'student-produced' || currentQ.type === 'student-produced-with-image') && (
                    <div className="space-y-6">
                      <div className="text-gray-700">
                        {renderFormattedText(currentQ.answerFormat, currentQuestion)}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={answers[currentQuestion] || ''}
                          onChange={(e) => handleAnswerSelect(e.target.value)}
                          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter your answer"
                        />
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'fill-in-blanks' || currentQ.type === 'image-with-blanks') && (
                    <div className="space-y-6">
                      <div className="text-gray-700 text-base leading-relaxed">
                        {currentQ.content && (
                          <div className="mb-4">
                            {currentQ.content.split('_____').map((part, index, array) => (
                              <span key={index}>
                                <span dangerouslySetInnerHTML={{ __html: formatText(part) }} onMouseUp={handleTextSelection} />
                                {index < array.length - 1 && (
                                  <input
                                    type="text"
                                    value={answers[currentQuestion]?.[currentQ.blanks[index]?.id] || ''}
                                    onChange={(e) => {
                                      const newAnswers = { ...answers };
                                      if (!newAnswers[currentQuestion]) {
                                        newAnswers[currentQuestion] = {};
                                      }
                                      newAnswers[currentQuestion][currentQ.blanks[index].id] = e.target.value;
                                      setAnswers(newAnswers);
                                    }}
                                    className="inline-block w-32 mx-2 px-2 py-1 border-b-2 border-red-500 focus:outline-none focus:border-red-700 text-center"
                                    placeholder={currentQ.blanks[index]?.placeholder}
                                  />
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(currentQ.type === 'table-question' || currentQ.type === 'complex-table') && (
                    <div className="space-y-4">
                      {currentQ.options.map((option, index) => (
                        <label 
                          key={index} 
                          className={`radio-option ${answers[currentQuestion] === option.charAt(0) ? 'selected' : ''}`}
                        >
                          <div className="modern-radio">
                            <input
                              type="radio"
                              name={`question-${currentQuestion}`}
                              value={option.charAt(0)}
                              checked={answers[currentQuestion] === option.charAt(0)}
                              onChange={(e) => handleAnswerSelect(e.target.value)}
                            />
                            <div className="modern-radio-circle"></div>
                          </div>
                          <div className="radio-text flex-1">
                            {renderFormattedText(option, currentQuestion)}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Answer Preview:</div>
                    <div className="text-base font-medium text-gray-900">
                      {currentQ.type === 'fill-in-blanks' || currentQ.type === 'image-with-blanks' ? (
                        <div className="space-y-2">
                          {currentQ.blanks?.map((blank, index) => (
                            <div key={blank.id} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{blank.placeholder}:</span>
                              <span className="font-mono">
                                {answers[currentQuestion]?.[blank.id] || 'Not answered'}
                              </span>
                            </div>
                          )) || 'No blanks filled'}
                        </div>
                      ) : (
                        answers[currentQuestion] || 'No answer selected'
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-3 sm:py-5 z-40">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600 text-sm"></i>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">张同学</div>
            </div>
          </div>
          
          <Space size="small" className="w-full sm:w-auto justify-between sm:justify-end">
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setShowProgress(true)}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden xs:inline">Progress</span>
            </Button>
            <Button
              icon={<LeftOutlined />}
              onClick={goToPrevious}
              disabled={currentQuestion === 1}
              type="primary"
            >
              Back
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={goToNext}
              disabled={currentQuestion === examData.totalQuestions}
              type="primary"
            >
              Next
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndExamModal(true)}
            >
              结束考试
            </Button>
          </Space>
        </div>
      </div>

      <div className="h-24"></div>

      {showProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">考试进度</h2>
                <button
                  onClick={() => setShowProgress(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">{examData.title}</h3>
                
                <div className="flex items-center justify-center space-x-6 text-sm mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Answered</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>For Review</span>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-11 gap-2 max-w-2xl">
                    {Array.from({ length: examData.totalQuestions }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          goToQuestion(num);
                          setShowProgress(false);
                        }}
                        className={`w-10 h-10 text-sm rounded-lg font-medium transition-colors ${
                          num === currentQuestion
                            ? 'bg-blue-500 text-white'
                            : markedForReview.has(num)
                            ? 'bg-yellow-500 text-white'
                            : answers[num]
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-center space-x-4">
                  {/* <button className="bg-red-600 text-white px-8 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">
                    Go to Review Page
                  </button> */}
                  <button 
                    onClick={() => setShowEndExamModal(true)}
                    className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-stop mr-2"></i>结束考试
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDirections && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
          <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 ease-out border border-white/20">
            {/* 头部 - 渐变背景 */}
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20 transform -rotate-3">
                  <i className="fas fa-book-open text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{examData.directions.title}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Exam Guidelines & Reference</p>
                </div>
              </div>
              <button
                onClick={() => setShowDirections(false)}
                className="w-12 h-12 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all duration-200 group"
              >
                <i className="fas fa-times text-slate-300 group-hover:text-slate-600 text-lg"></i>
              </button>
            </div>
            
            {/* 内容 - 优化排版 */}
            <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-600 leading-relaxed text-lg font-medium space-y-6">
                    {renderFormattedText(examData.directions.content, 'directions')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 底部 - 简洁操作 */}
            <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center">
              <span className="text-xs font-bold text-slate-400 mr-auto hidden sm:block">
                <i className="fas fa-keyboard mr-2"></i>
                Press ESC to close
              </span>
              <button
                onClick={() => setShowDirections(false)}
                className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center"
              >
                Got it, Close
                <i className="fas fa-check-circle ml-2 opacity-50"></i>
              </button>
            </div>
          </div>
        </div>
      )}
{/* 
      <div
        id="highlight-menu"
        className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-[9999]"
        style={{ display: 'none' }}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addHighlight('yellow')}
            className="w-8 h-8 bg-yellow-200 rounded hover:bg-yellow-300 transition-colors border border-yellow-300"
            title="黄色高亮"
          ></button>
          <button
            onClick={() => addHighlight('green')}
            className="w-8 h-8 bg-green-200 rounded hover:bg-green-300 transition-colors border border-green-300"
            title="绿色高亮"
          ></button>
          <button
            onClick={() => addHighlight('blue')}
            className="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300 transition-colors border border-blue-300"
            title="蓝色高亮"
          ></button>
          <button
            onClick={() => addHighlight('pink')}
            className="w-8 h-8 bg-pink-200 rounded hover:bg-pink-300 transition-colors border border-pink-300"
            title="粉色高亮"
          ></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            onClick={addUnderline}
            className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            title="添加下划线"
          >
            <i className="fas fa-underline"></i>
          </button>
          <button
            onClick={removeHighlight}
            className="px-2 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            title="删除高亮"
          >
            <i className="fas fa-eraser"></i>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            onClick={addNote}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="添加备注"
          >
            <i className="fas fa-sticky-note mr-1"></i>备注
          </button>
        </div>
      </div> */}

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加备注</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">选中的文本：</div>
              <div className="p-3 bg-gray-50 rounded border text-sm">
                "{selectedText}"
              </div>
            </div>
            <textarea
              id="note-input"
              placeholder="输入你的备注..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            ></textarea>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const noteText = document.getElementById('note-input').value;
                  saveNote(noteText);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-shapes text-white"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">Reference</span>
          </div>
        }
        placement="right"
        width={520}
        onClose={() => setShowReference(false)}
        open={showReference}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                shape: 'Circle',
                formulas: ['A = πr²', 'C = 2πr'],
                svg: '<circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="40" x2="70" y2="40" stroke="currentColor" stroke-width="2"/><text x="55" y="35" font-size="10" fill="currentColor">r</text>'
              },
              {
                shape: 'Rectangle',
                formulas: ['A = lw'],
                svg: '<rect x="10" y="20" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2"/><text x="35" y="45" font-size="10" fill="currentColor">l</text><text x="5" y="42" font-size="10" fill="currentColor">w</text>'
              },
              {
                shape: 'Triangle',
                formulas: ['A = ½bh'],
                svg: '<polygon points="40,10 10,70 70,70" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/><text x="42" y="45" font-size="10" fill="currentColor">h</text><text x="35" y="75" font-size="10" fill="currentColor">b</text>'
              },
              {
                shape: 'Right Triangle (30-60-90)',
                formulas: ['x, x√3, 2x'],
                svg: '<polygon points="10,70 10,10 70,70" fill="none" stroke="currentColor" stroke-width="2"/><text x="5" y="42" font-size="10" fill="currentColor">x</text><text x="35" y="75" font-size="10" fill="currentColor">x√3</text><text x="35" y="35" font-size="10" fill="currentColor">2x</text>'
              },
              {
                shape: 'Right Triangle (45-45-90)',
                formulas: ['s, s, s√2'],
                svg: '<polygon points="10,70 10,10 70,70" fill="none" stroke="currentColor" stroke-width="2"/><text x="5" y="42" font-size="10" fill="currentColor">s</text><text x="35" y="75" font-size="10" fill="currentColor">s</text><text x="35" y="35" font-size="10" fill="currentColor">s√2</text>'
              },
              {
                shape: 'Cube',
                formulas: ['V = s³'],
                svg: '<rect x="10" y="30" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"/><rect x="20" y="20" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="30" x2="20" y2="20" stroke="currentColor" stroke-width="2"/><line x1="50" y1="30" x2="60" y2="20" stroke="currentColor" stroke-width="2"/><line x1="10" y1="70" x2="20" y2="60" stroke="currentColor" stroke-width="2"/>'
              },
              {
                shape: 'Cylinder',
                formulas: ['V = πr²h'],
                svg: '<ellipse cx="40" cy="20" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="20" x2="10" y2="60" stroke="currentColor" stroke-width="2"/><line x1="70" y1="20" x2="70" y2="60" stroke="currentColor" stroke-width="2"/><ellipse cx="40" cy="60" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>'
              },
              {
                shape: 'Sphere',
                formulas: ['V = (4/3)πr³'],
                svg: '<circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="40" cy="40" rx="30" ry="10" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>'
              },
              {
                shape: 'Cone',
                formulas: ['V = (1/3)πr²h'],
                svg: '<ellipse cx="40" cy="60" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="60" x2="40" y2="10" stroke="currentColor" stroke-width="2"/><line x1="70" y1="60" x2="40" y2="10" stroke="currentColor" stroke-width="2"/>'
              },
              {
                shape: 'Pyramid',
                formulas: ['V = (1/3)lwh'],
                svg: '<polygon points="40,10 10,60 70,60" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="10" x2="40" y2="60" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/><line x1="10" y1="60" x2="70" y2="50" stroke="currentColor" stroke-width="2"/><line x1="70" y1="60" x2="70" y2="50" stroke="currentColor" stroke-width="2"/>'
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <svg width="70" height="70" viewBox="0 0 80 80" className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: item.svg }} />
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-xs mb-1">{item.shape}</div>
                  {item.formulas.map((formula, i) => (
                    <div key={i} className="text-[10px] text-gray-600 font-mono">{formula}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>The number of degrees of arc in a circle is 360.</strong></p>
              <p><strong>The number of radians of arc in a circle is 2π.</strong></p>
              <p><strong>The sum of the measures in degrees of the angles of a triangle is 180.</strong></p>
            </div>
          </div>
        </div>
      </Drawer>

      {showEndExamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 ease-out border border-white/20">
            {/* 头部 */}
            <div className="px-10 pt-10 pb-6 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner">
                <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Ready to Finish?</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                You are about to end this section. Once submitted, you cannot change your answers.
              </p>
            </div>

            {/* 统计网格 */}
            <div className="px-10 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 transition-all hover:bg-blue-50">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Answered</div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-blue-700">{Object.keys(answers).length}</span>
                    <span className="text-sm font-bold text-blue-300">/ {examData.totalQuestions}</span>
                  </div>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 transition-all hover:bg-amber-50">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">For Review</div>
                  {/* <div className="text-2xl font-black text-amber-700">{markedForReview.size}</div> */}
                  <div className="text-2xl font-black text-amber-700">not supported</div>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 transition-all hover:bg-slate-50">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Left</div>
                  <div className="text-2xl font-black text-slate-700 font-mono">
                    {timeMode === 'timed' ? formatTime(timeRemaining) : '--:--'}
                  </div>
                </div>
                <div className="bg-red-50/50 border border-red-100 rounded-3xl p-5 transition-all hover:bg-red-50">
                  <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Unanswered</div>
                  <div className="text-2xl font-black text-red-700">
                    {examData.totalQuestions - Object.keys(answers).length}
                  </div>
                </div>
              </div>
            </div>

            {/* 操作区 */}
            <div className="px-10 pb-10 pt-4 space-y-3">
              <button
                onClick={handleFinishExam}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
              >
                Yes, Submit Exam
              </button>
              <button
                onClick={() => setShowEndExamModal(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-base hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                No, Continue Testing
              </button>
              <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
                Your progress is automatically saved
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .selectable-text {
          user-select: text;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
        }
        
        .highlight-yellow {
          background-color: #fef08a;
          padding: 2px 4px;
          border-radius: 3px;
        }
        
        .highlight-green {
          background-color: #bbf7d0;
          padding: 2px 4px;
          border-radius: 3px;
        }
        
        .highlight-blue {
          background-color: #bfdbfe;
          padding: 2px 4px;
          border-radius: 3px;
        }
        
        .highlight-pink {
          background-color: #fbcfe8;
          padding: 2px 4px;
          border-radius: 3px;
        }
        
        .text-underline {
          text-decoration: underline;
          text-decoration-color: #dc2626;
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
        }
        
        .note-highlight {
          background-color: #fbbf24;
          padding: 2px 4px;
          border-radius: 3px;
          border: 2px solid #f59e0b;
          animation: pulse-highlight 2s ease-in-out;
        }
        
        @keyframes pulse-highlight {
          0% { background-color: #fbbf24; }
          50% { background-color: #f59e0b; }
          100% { background-color: #fbbf24; }
        }
        
        .selectable-text::selection {
          background-color: #3b82f6;
          color: white;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

export default ExamContent;

