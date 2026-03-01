/**
 * 套题录入页工具函数：题目选项解析、提交 payload 构建、格式化、草稿、公式渲染等
 */

import { DRAFT_STORAGE_KEY, DEFAULT_SOURCE, DEFAULT_CREATOR_ID, CATEGORY_TO_SECTION_SUBJECT, DEFAULT_REGION, DEFAULT_DIFFICULTY, DEFAULT_SECTION_DIFFICULTY, DEFAULT_SECTION_SUBJECT, SECTION_SUBJECT_TO_DEFAULT_CATEGORY, INTERACTION_TYPE_ENUM, SUBJECT_CATEGORY_ENUM, QUESTION_TYPES_BY_CATEGORY } from './examSetEntryConstants';

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

    if (q.interactionType === INTERACTION_TYPE_ENUM.CHOICE) {
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
  const source = examSet.source || DEFAULT_SOURCE;
  return {
    id: examSet.examId,
    title: examSet.examName,
    year: examSet.examYear,
    type: examSet.examType,
    region: examSet.examRegion || DEFAULT_REGION,
    difficulty: examSet.difficulty || DEFAULT_DIFFICULTY,
    description: examSet.examDescription || '',
    source,
    sections: (examSet.sections && examSet.sections.length)
      ? formatSectionListFromApi(examSet.sections)
      : []
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
    subject: section.sectionCategory || DEFAULT_SECTION_SUBJECT,
    difficulty: section.sectionDifficulty || DEFAULT_SECTION_DIFFICULTY,
    duration: section.sectionTiming,
    status: section.status
  }));
}

/**
 * 将题目列表接口数据格式化为前端 question 结构
 * 数据来源：question/exam/list 接口
 * - 科目分类：questionCategory (READING/WRITING/MATH)
 * - 知识点：questionSubCategory (如 READING_VOCAB、MATH_BASIC 等)
 * @param {Array} sectionListData 按Section分组的题目数据
 * @param {Array} sections 当前 sections 列表，用于解析 subject
 * @returns {Array}
 */
export function formatQuestionListFromApi(sectionListData, sections) {
  if (!sectionListData || !sectionListData.length) return [];
  
  // 将按Section分组的数据扁平化为题目列表
  const flattenedQuestions = [];
  
  sectionListData.forEach(section => {
    const { sectionCategory, sectionName, sectionTiming, questionList } = section;
    
    if (questionList && questionList.length) {
      questionList.forEach(item => {
        const { question } = item;
        flattenedQuestions.push({
          question,
          sectionName,
          sectionCategory,
          sectionTiming
        });
      });
    }
  });
  
  return flattenedQuestions.map(item => {
    const { question, sectionName } = item;
    const optionsArray = parseQuestionOptions(question.options);
    const section = sections.find(s => s.id === question.sectionId);
    const subject = section?.subject || CATEGORY_TO_SECTION_SUBJECT[question.questionCategory] || DEFAULT_SECTION_SUBJECT;

    // 科目分类：来自 question/exam/list 的 questionCategory
    let subjectCategory = question.questionCategory;
    if (![SUBJECT_CATEGORY_ENUM.READING, SUBJECT_CATEGORY_ENUM.WRITING, SUBJECT_CATEGORY_ENUM.MATH].includes(question.questionCategory)) {
      subjectCategory = SECTION_SUBJECT_TO_DEFAULT_CATEGORY[subject] || SUBJECT_CATEGORY_ENUM.READING;
    }

    return {
      id: question.questionId,
      sectionId: question.sectionId,
      sectionName,
      subject,
      subjectCategory,
      questionCategory: question.questionCategory,
      questionSubCategory: question.questionSubCategory,
      difficulty: question.difficulty || DEFAULT_SECTION_DIFFICULTY,
      type: question.questionSubCategory ? question.questionSubCategory.split(',') : [],
      interactionType: question.questionType === 'CHOICE' ? INTERACTION_TYPE_ENUM.CHOICE : question.questionType === 'BLANK' ? INTERACTION_TYPE_ENUM.BLANK : (question.questionType || INTERACTION_TYPE_ENUM.CHOICE),
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
    difficulty: baseInfo.difficulty || DEFAULT_DIFFICULTY,
    examDescription: baseInfo.description,
    source: baseInfo.source || DEFAULT_SOURCE,
    creatorId: DEFAULT_CREATOR_ID,
    status: baseInfo.status,
    delFlag: baseInfo.delFlag
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
    sectionDifficulty: section.difficulty || DEFAULT_SECTION_DIFFICULTY,
    sectionTiming: section.duration,
    status: section.status,
    delFlag: section.delFlag
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
      questionCategory: question.subjectCategory || question.subject || '',
      questionSubCategory: Array.isArray(question.type) ? question.type.join(',') : (question.type || ''),
      difficulty: question.difficulty || DEFAULT_SECTION_DIFFICULTY,
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
 * 统一富文本转 HTML：套题录入→套题展示→作答页→错题记录 全链路一致
 * 支持：数学公式、图片、加粗、斜体、删除线、换行、填空题占位符
 * @param {string} text
 * @param {{ omitImages?: boolean }} [options] - omitImages: 题目索引等紧凑预览场景不渲染图片
 * @returns {string}
 */
export function formatText(text, options = {}) {
  if (!text) return text;

  const { omitImages = false } = options;

  const mathBlocks = [];
  let processed = text.replace(/\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g, (match) => {
    const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
    mathBlocks.push(match);
    return placeholder;
  });

  const imageBlocks = [];
  processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const placeholder = `@@@IMGBLOCK${imageBlocks.length}@@@`;
    imageBlocks.push(omitImages ? '' : `<img src="${url}" alt="${alt.replace(/"/g, '&quot;')}" class="max-w-full h-auto rounded-lg my-2" />`);
    return placeholder;
  });

  const blankPlaceholders = [];
  processed = processed.replace(/_{4,}/g, (match) => {
    const placeholder = `@@@BLANKPLACEHOLDER${blankPlaceholders.length}@@@`;
    blankPlaceholders.push(match);
    return placeholder;
  });

  processed = applyMarkdownInlineFormat(processed);

  blankPlaceholders.forEach((block, index) => {
    processed = processed.split(`@@@BLANKPLACEHOLDER${index}@@@`).join(block);
  });

  imageBlocks.forEach((html, index) => {
    processed = processed.split(`@@@IMGBLOCK${index}@@@`).join(html);
  });

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
 * 对指定 id 的单个容器执行 KaTeX 渲染，避免联动其他预览导致闪屏
 * @param {string} containerId 容器元素 id
 * @param {object} options 可选
 */
export function renderMathInContainerById(containerId, options = {}) {
  if (!containerId || typeof window === 'undefined' || !window.renderMathInElement) return () => {};
  const el = document.getElementById(containerId);
  if (!el) return () => {};
  const timer = setTimeout(() => {
    try {
      window.renderMathInElement(el, {
        delimiters: KATEX_DELIMITERS,
        throwOnError: false,
        strict: false,
        ...options
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
    }
  }, 0);
  return () => clearTimeout(timer);
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