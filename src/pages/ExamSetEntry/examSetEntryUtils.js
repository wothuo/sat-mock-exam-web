/**
 * 套题录入页工具函数：题目选项解析、提交 payload 构建、格式化、草稿、公式渲染等
 */

import { DRAFT_STORAGE_KEY, DEFAULT_SOURCE, DEFAULT_CREATOR_ID, CATEGORY_TO_SUBJECT } from './examSetEntryConstants';

const DEFAULT_OPTIONS = ['', '', '', ''];

/**
 * 解析题目 options，兼容数组 / JSON 字符串 / 对象多种后端格式
 * @param {unknown} options
 * @returns {string[]} 长度至少为 4 的选项数组
 */
export function parseQuestionOptions(options) {
  if (!options) return [...DEFAULT_OPTIONS];
  try {
    if (Array.isArray(options)) {
      const arr = [...options];
      while (arr.length < 4) arr.push('');
      return arr;
    }
    if (typeof options === 'string') {
      const parsed = JSON.parse(options);
      if (typeof parsed === 'object' && parsed !== null) {
        return [
          parsed.optionA ?? parsed.A ?? parsed.a ?? parsed[0] ?? '',
          parsed.optionB ?? parsed.B ?? parsed.b ?? parsed[1] ?? '',
          parsed.optionC ?? parsed.C ?? parsed.c ?? parsed[2] ?? '',
          parsed.optionD ?? parsed.D ?? parsed.d ?? parsed[3] ?? ''
        ];
      }
    }
    if (typeof options === 'object' && options !== null) {
      const o = options;
      return [
        o.optionA ?? o.A ?? o.a ?? o[0] ?? '',
        o.optionB ?? o.B ?? o.b ?? o[1] ?? '',
        o.optionC ?? o.C ?? o.c ?? o[2] ?? '',
        o.optionD ?? o.D ?? o.d ?? o[3] ?? ''
      ];
    }
  } catch (e) {
    // 解析失败时返回默认
  }
  return [...DEFAULT_OPTIONS];
}

/**
 * 从 HTML/富文本中提取纯文本并 trim，用于校验是否填写
 * @param {string} html
 * @returns {string}
 */
function stripHtmlToText(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 校验题目必填项：题目内容、选项内容（选择题）、正确答案
 * @param {Array} questions 题目列表
 * @returns {{ valid: boolean, errors: Array<{ questionId, index, sectionName, field, message }> }}
 */
export function validateQuestions(questions, sections = []) {
  const errors = [];
  const activeQuestions = (questions || []).filter(q => q.delFlag !== '1');

  activeQuestions.forEach((q, idx) => {
    const displayIndex = idx + 1;
    const section = sections.find(s => s.id === q.sectionId);
    const sectionName = section?.name?.split(':')[0] || '未分配';

    const contentText = stripHtmlToText(q.content === '已录入' ? '' : (q.content || ''));
    if (!contentText) {
      errors.push({
        questionId: q.id,
        index: displayIndex,
        sectionName,
        field: 'content',
        message: `第 ${displayIndex} 题：题目内容未填写`
      });
    }

    if (q.interactionType === '选择题') {
      const opts = Array.isArray(q.options) ? q.options : ['', '', '', ''];
      const optLabels = ['A', 'B', 'C', 'D'];
      const hasEmptyOption = opts.some((opt, i) => !stripHtmlToText(opt ?? '').trim());
      if (hasEmptyOption) {
        const emptyList = opts
          .map((opt, i) => (stripHtmlToText(opt ?? '').trim() ? null : optLabels[i]))
          .filter(Boolean);
        errors.push({
          questionId: q.id,
          index: displayIndex,
          sectionName,
          field: 'options',
          message: `第 ${displayIndex} 题：选项 ${emptyList.join('、')} 未填写`
        });
      }

      const correctAnswer = (q.correctAnswer || '').trim().toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        errors.push({
          questionId: q.id,
          index: displayIndex,
          sectionName,
          field: 'correctAnswer',
          message: `第 ${displayIndex} 题：正确答案未选择`
        });
      }
    } else {
      const correctAnswer = (q.correctAnswer || '').trim();
      if (!correctAnswer) {
        errors.push({
          questionId: q.id,
          index: displayIndex,
          sectionName,
          field: 'correctAnswer',
          message: `第 ${displayIndex} 题：正确答案未填写`
        });
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * 获取题目选项安全访问，用于提交 payload
 * @param {object} question 前端题目对象
 * @returns {[string, string, string, string]}
 */
export function getQuestionOptionsForSubmit(question) {
  const opts = Array.isArray(question.options) ? question.options : [];
  return [
    opts[0] ?? '',
    opts[1] ?? '',
    opts[2] ?? '',
    opts[3] ?? ''
  ];
}

/**
 * 清除套题录入草稿
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // 静默失败
  }
}

/**
 * 将套题列表接口单条转为录入页使用的套题详情
 * @param {object} examSet 列表项
 * @returns {object} 详情对象
 */
export function transformExamSetFromList(examSet) {
  if (!examSet) return null;
  return {
    id: examSet.examId,
    title: examSet.examName,
    year: examSet.examYear,
    type: examSet.examType,
    region: examSet.examRegion,
    difficulty: examSet.difficulty || 'Medium',
    description: examSet.examDescription || '',
    sections: examSet.sections || []
  };
}

/**
 * 将 Section 列表接口数据格式化为前端 section 结构
 * @param {Array} sectionListData
 * @returns {Array}
 */
export function formatSectionListFromApi(sectionListData) {
  if (!sectionListData || !sectionListData.length) return [];
  return sectionListData.map(section => ({
    id: section.sectionId,
    name: section.sectionName,
    subject: section.sectionCategory,
    difficulty: section.sectionDifficulty,
    duration: section.sectionTiming,
    status: section.status
  }));
}

/**
 * 将题目列表接口数据格式化为前端 question 结构
 * @param {Array} questionListData
 * @param {Array} sections 当前 sections 列表，用于解析 subject
 * @returns {Array}
 */
export function formatQuestionListFromApi(questionListData, sections) {
  if (!questionListData || !questionListData.length) return [];
  return questionListData.map(item => {
    const { question, sectionName } = item;
    const optionsArray = parseQuestionOptions(question.options);
    const section = sections.find(s => s.id === question.sectionId);
    const subject = section?.subject || CATEGORY_TO_SUBJECT[question.questionCategory] || '阅读语法';
    return {
      id: question.questionId,
      sectionId: question.sectionId,
      sectionName,
      subject,
      questionCategory: question.questionCategory,
      questionSubCategory: question.questionSubCategory,
      difficulty: question.difficulty,
      type: question.questionSubCategory || '',
      interactionType: question.questionType === 'CHOICE' ? '选择题' : question.questionType === 'BLANK' ? '填空题' : question.questionType,
      content: question.questionContent,
      description: question.questionDescription,
      options: optionsArray,
      answer: question.answer,
      correctAnswer: question.answer || '',
      explanation: question.analysis || '',
      score: question.score,
      status: question.status,
      delFlag: question.delFlag,
      creatorId: question.creatorId,
      createTime: question.createTime,
      updateTime: question.updateTime
    };
  });
}

/**
 * 构建提交用的 examPool payload
 * @param {object} baseInfo 表单基础信息
 * @param {boolean} isEditMode
 * @param {string|null} editId
 */
export function buildExamPoolPayload(baseInfo, isEditMode, editId) {
  return {
    ...(isEditMode && editId && { examId: parseInt(editId, 10) }),
    examName: baseInfo.title,
    examType: baseInfo.type,
    examYear: baseInfo.year?.toString(),
    examRegion: baseInfo.region,
    difficulty: baseInfo.difficulty || '',
    examDescription: baseInfo.description,
    source: baseInfo.source || DEFAULT_SOURCE,
    creatorId: DEFAULT_CREATOR_ID,
    status: 0
  };
}

/**
 * 构建提交用的 examSections payload
 * @param {Array} sections
 * @param {boolean} isEditMode 编辑模式下提交全部（含 delFlag），新增模式仅未删除
 * @param {string|null} editId
 */
export function buildExamSectionsPayload(sections, isEditMode, editId) {
  const sectionsToSubmit = isEditMode ? sections : sections.filter(s => s.delFlag !== '1');
  return sectionsToSubmit.map(section => ({
    ...(isEditMode && editId && { examId: parseInt(editId, 10) }),
    ...(isEditMode && { sectionId: section.id }),
    sectionName: section.name,
    sectionCategory: section.subject,
    sectionDifficulty: section.difficulty || '',
    sectionTiming: section.duration,
    status: 0,
    delFlag: section.delFlag || '0'
  }));
}

/**
 * 构建提交用的 questions payload
 * @param {Array} questions
 * @param {boolean} isEditMode 编辑模式下提交全部（含 delFlag），新增模式仅未删除
 */
export function buildQuestionsPayload(questions, isEditMode) {
  const questionsToSubmit = isEditMode ? questions : questions.filter(q => q.delFlag !== '1');
  return questionsToSubmit.map(question => {
    const [optionA, optionB, optionC, optionD] = getQuestionOptionsForSubmit(question);
    return {
      ...(isEditMode && { questionId: question.id }),
      sectionId: question.sectionId,
      sectionName: question.sectionName,
      questionType: question.interactionType,
      questionCategory: question.subject || '',
      questionSubCategory: question.type,
      difficulty: question.difficulty || '',
      questionContent: question.content === '已录入' ? '' : (question.content || ''),
      questionDescription: question.description || '',
      optionA,
      optionB,
      optionC,
      optionD,
      answer: question.correctAnswer,
      analysis: question.explanation || '',
      delFlag: question.delFlag || '0'
    };
  });
}

/**
 * 共享：对文本应用 Markdown 行内格式（加粗、斜体、删除线、换行）
 * 不处理数学公式和图片，需在调用前/后自行保护或处理
 * @param {string} text
 * @returns {string}
 */
export function applyMarkdownInlineFormat(text) {
  if (!text) return text || '';
  let processed = text;
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');
  processed = processed.replace(/(?<!\*)(\*)(?!\*)(.+?)(?<!\*)(\*)(?!\*)/g, '<em>$2</em>');
  processed = processed.replace(/(?<!_)(_)(?!_)(.+?)(?<!_)(_)(?!_)/g, '<em>$2</em>');
  processed = processed.replace(/~~(.+?)~~/g, '<s>$1</s>');
  processed = processed.replace(/\n/g, '<br />');
  return processed;
}

/**
 * Markdown/公式文本转预览 HTML（加粗、斜体、图片、换行，保留公式块）
 * @param {string} text
 * @returns {string}
 */
export function formatText(text) {
  if (!text) return text;

  const mathBlocks = [];
  let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
    const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
    mathBlocks.push(match);
    return placeholder;
  });

  processed = applyMarkdownInlineFormat(processed);
  processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');

  mathBlocks.forEach((block, index) => {
    processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
  });

  return processed;
}

const KATEX_DELIMITERS = [
  { left: '$', right: '$', display: false },
  { left: '$$', right: '$$', display: true }
];

/**
 * 在指定 id 的 DOM 元素内渲染公式（KaTeX）
 * @param {string} previewId 元素 id
 * @param {number} delayMs 延迟毫秒数，默认 120
 */
export function renderMathInPreview(previewId, delayMs = 120) {
  setTimeout(() => {
    const previewElement = document.getElementById(previewId);
    if (previewElement && typeof window !== 'undefined' && window.renderMathInElement) {
      window.renderMathInElement(previewElement, {
        delimiters: KATEX_DELIMITERS,
        throwOnError: false
      });
    }
  }, delayMs);
}

/**
 * 对页面上所有 .selectable-text, .math-content 容器执行 KaTeX 渲染（用于全局刷新）
 * @param {object} options 可选，传入 { delimiters, throwOnError, strict }
 */
export function renderMathInContainers(options = {}) {
  if (typeof window === 'undefined' || !window.renderMathInElement) return () => {};
  const containers = document.querySelectorAll('.selectable-text, .math-content');
  containers.forEach(container => {
    container.style.visibility = 'hidden';
  });
  const timer = setTimeout(() => {
    containers.forEach(container => {
      try {
        window.renderMathInElement(container, {
          delimiters: KATEX_DELIMITERS,
          throwOnError: false,
          strict: false,
          ...options
        });
        container.style.visibility = 'visible';
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        container.style.visibility = 'visible';
      }
    });
  }, 50);
  return () => clearTimeout(timer);
}