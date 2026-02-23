import React, { useEffect } from 'react';

import { Alert, Button, Empty, Input, Select, Space, Tag } from 'antd';

import { CheckCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import {
  INTERACTION_TYPE_ENUM,
  INTERACTION_TYPE_LABELS,
  INTERACTION_TYPE_OPTIONS,
  SECTION_DIFFICULTY_OPTIONS,
  SECTION_SUBJECT_ENUM,
  SECTION_SUBJECT_LABELS,
  SECTION_SUBJECT_CATEGORY_OPTIONS,
  SECTION_SUBJECT_TO_DEFAULT_CATEGORY,
  SUBJECT_CATEGORY_ENUM,
  SUBJECT_CATEGORY_LABELS,
  QUESTION_TYPES_BY_CATEGORY,
  QUESTION_TYPE_LABELS,
  DEFAULT_SUBJECT_CATEGORY, SECTION_DIFFICULTY_ENUM
} from '../examSetEntryConstants';
import { formatText } from '../examSetEntryUtils';

import RichTextEditor from './RichTextEditor';

const { Option } = Select;

/** 题目索引无内容时的占位文案 */
function getIndexPreviewPlaceholder(content) {
  if (!content || typeof content !== 'string') return '—';
  const trimmed = content.trim();
  if (!trimmed || trimmed === '已录入') return '—';
  return null;
}

/**
 * 套题录入 - 题目内容（步骤 2）
 * 仅负责展示与事件转发，题目状态与工具栏/公式等逻辑保留在父组件
 */
function ExamSetQuestionStep({
  questions,
  sections,
  selectedQuestionId,
  activeEditorId,
  isEditMode,
  questionListRef,
  questionValidationErrors = [],
  onAddQuestion,
  onSelectQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onToolbarAction,
  onRenderMathInPreview,
  onInsertImage,
  onPrev,
  onSubmit
}) {
  // 题目索引列表中的公式在 DOM 更新后统一渲染
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== 'undefined' && window.renderMathInElement) {
        questions.forEach((q) => {
          if (q.delFlag === '1') return;
          const el = document.getElementById(`index-preview-${q.id}`);
          if (el) {
            window.renderMathInElement(el, {
              delimiters: [
                { left: '$', right: '$', display: false },
                { left: '$$', right: '$$', display: true },
              ],
              throwOnError: false,
            });
          }
        });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [questions]);

  const invalidQuestionIds = new Set(questionValidationErrors.map(e => e.questionId));

  return (
    <>
      {questionValidationErrors.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="题目信息不完整"
          description={
            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
              {questionValidationErrors.map((e, i) => (
                <li key={i}>{e.message}</li>
              ))}
            </ul>
          }
          className="mb-6 border-2 border-red-300 bg-red-50"
          style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}
        />
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 py-2 px-3 mb-2 sticky top-20 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
            <button
              type="button"
              onClick={() => onToolbarAction('bold', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="粗体"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('italic', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="斜体"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('underline', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="下划线"
            >
              <i className="fas fa-underline"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('strikethrough', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="删除线"
            >
              <i className="fas fa-strikethrough"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('superscript', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="上标"
            >
              <i className="fas fa-superscript"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('subscript', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="下标"
            >
              <i className="fas fa-subscript"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('highlight', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded text-[10px] transition-colors"
              title="高亮"
            >
              <i className="fas fa-highlighter"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('unorderedList', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="无序列表"
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('orderedList', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="有序列表"
            >
              <i className="fas fa-list-ol"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('blockIndent', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="段落整体缩进"
            >
              <i className="fas fa-indent"></i>
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('center', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
              title="居中"
            >
              <i className="fas fa-align-center"></i>
            </button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$\\frac{numerator}{denominator}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="分数"
            >
              分数
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$\\sqrt{x}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="根号"
            >
              根号
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$x^{n}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="幂次"
            >
              幂次
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$\\sum_{i=1}^{n}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="求和"
            >
              求和
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$\\int_{lower}^{upper}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="积分"
            >
              积分
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('formula', '$\\lim_{x \\to \\infty}$', activeEditorId)}
              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] transition-colors"
              title="极限"
            >
              极限
            </button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button
              type="button"
              onClick={onInsertImage}
              className="px-1.5 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[10px] transition-colors"
              title="插入图片"
            >
              <i className="fas fa-image mr-0.5"></i>插入图片
            </button>
            <button
              type="button"
              onClick={() => onToolbarAction('table', null, activeEditorId)}
              className="px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] transition-colors"
              title="插入表格"
            >
              <i className="fas fa-table mr-0.5"></i>插入表格
            </button>
            <button
                type="button"
                onClick={() => onToolbarAction('insertUnderline', null, activeEditorId)}
                className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] transition-colors"
                title="插入下划线"
            >
              <i className="fas fa-minus mr-0.5"></i>插入下划线
            </button>
          </div>
          <div className="text-xs text-gray-500 ml-4">
            {activeEditorId ? '当前编辑器已激活' : '点击输入框激活编辑器'}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[800px]">
        <div className="w-full md:w-72 flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="py-1.5 px-3 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-sm">题目索引 ({questions.length})</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={onAddQuestion}
              className="rounded-md bg-blue-600 border-0 font-bold"
            >
              添加
            </Button>
          </div>
          <div
            ref={questionListRef}
            className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar"
          >
            {questions.map((q, index) => {
              const isDeleted = q.delFlag === '1';
              const section = sections.find(s => s.id === q.sectionId);
              const isSectionDeleted = section?.delFlag === '1';

              const hasValidationError = !isDeleted && invalidQuestionIds.has(q.id);

              return (
                <div
                  key={q.id || `question-${index}`}
                  onClick={() => !isDeleted && onSelectQuestion(q.id)}
                  className={`p-2 rounded-md transition-all border-2 ${
                    isDeleted
                      ? 'border-red-200 bg-red-50/50 cursor-not-allowed'
                      : hasValidationError
                        ? 'border-red-500 bg-red-50 shadow-sm ring-2 ring-red-400/50 cursor-pointer'
                        : selectedQuestionId === q.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm cursor-pointer'
                          : 'border-transparent hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          isDeleted
                            ? 'bg-red-500 text-white'
                            : selectedQuestionId === q.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isDeleted ? '×' : index + 1}
                      </span>
                      <Tag color={q.interactionType === INTERACTION_TYPE_ENUM.CHOICE ? 'blue' : 'green'} className="m-0 border-0 text-[9px] font-bold px-1.5 leading-3">
                        {INTERACTION_TYPE_LABELS[q.interactionType] ?? q.interactionType}
                      </Tag>
                    </div>
                    <Tag color={isSectionDeleted ? 'red' : 'purple'} className="m-0 border-0 text-[9px] font-bold px-1 leading-3">
                      {section?.name?.split(':')[0] || '未分配'}
                      {isSectionDeleted && ' (已删除)'}
                    </Tag>
                  </div>
                  <div className="text-[10px] font-medium leading-tight text-gray-700 min-h-[1.25rem]" title={q.content}>
                    {isDeleted ? (
                      <span className="text-red-500">已删除</span>
                    ) : getIndexPreviewPlaceholder(q.content) !== null ? (
                      <span>{getIndexPreviewPlaceholder(q.content)}</span>
                    ) : (
                      <div
                        id={`index-preview-${q.id}`}
                        className="index-preview-content exam-question-editor-font line-clamp-2 break-words [&_.katex]:text-[10px]"
                        dangerouslySetInnerHTML={{
                          __html: formatText(q.content === '已录入' ? '' : (q.content || ''), { omitImages: true }),
                        }}
                      />
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                    {q.status === 1 ? '已录入' : q.status === 0 ? '草稿' : q.status || '已录入'}
                  </div>
                </div>
              );
            })}
            {questions.length === 0 && (
              <div className="py-20 text-center">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {selectedQuestionId ? (
            <>
              <div className="py-1.5 px-3 border-b border-gray-50 flex items-center justify-between">
                <Space size="small">
                  <span className="font-black text-gray-500 uppercase tracking-widest text-xs">Editing Question</span>
                  <Tag color="purple" className="font-bold border-0 text-xs px-2 py-0.5">
                    {SECTION_SUBJECT_LABELS[questions.find(q => q.id === selectedQuestionId)?.subject] ?? questions.find(q => q.id === selectedQuestionId)?.subject}
                  </Tag>
                </Space>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveQuestion(selectedQuestionId)}
                  className="text-xs"
                >
                  删除
                </Button>
              </div>
              <div className="exam-set-question-form flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {questions.filter(q => q.id === selectedQuestionId).map(q => (
                  <div key={q.id} className="space-y-4">

                    <div className="flex flex-col md:flex-row gap-3">
                      {/* 题目类型 - 均等固定宽度 */}
                      <div className="flex-1 min-w-40">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">题目类型</label>
                        <Select
                            value={q.interactionType}
                            onChange={v => {
                              // 当题目类型改变时，自动更新正确答案的默认值
                              const isChoice = v === INTERACTION_TYPE_ENUM.CHOICE;
                              const isBlank = v === INTERACTION_TYPE_ENUM.BLANK;
                              
                              // 如果从选择题切换到填空题，且当前答案是A/B/C/D，则清空答案
                              if (isBlank && ['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
                                onUpdateQuestion(q.id, 'correctAnswer', '');
                              } 
                              // 如果从填空题切换到选择题，且当前答案为空，则设置为A
                              else if (isChoice && !q.correctAnswer) {
                                onUpdateQuestion(q.id, 'correctAnswer', 'A');
                              } 
                              // 其他情况，只更新题目类型
                              else {
                                onUpdateQuestion(q.id, 'interactionType', v);
                              }
                            }}
                            className="w-full rounded-md"
                        >
                          {Object.entries(INTERACTION_TYPE_LABELS).map(([value, label]) => (
                              <Option key={value} value={value}>{label}</Option>
                          ))}
                        </Select>
                      </div>

                      {/* 所属Section - 均等固定宽度 */}
                      <div className="flex-1 min-w-40">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">所属 Section</label>
                        <Select
                            value={q.sectionName}
                            onChange={v => {
                              // 找到选中的Section对象
                              const selectedSection = sections.find(s => s.name === v);
                              // 更新所属Section
                              onUpdateQuestion(q.id, 'sectionName', v);
                              // 同时更新Section难度为选中Section的难度
                              if (selectedSection) {
                                onUpdateQuestion(q.id, 'sectionDifficulty', selectedSection.difficulty);
                                onUpdateQuestion(q.id, 'difficulty', selectedSection.difficulty);
                                onUpdateQuestion(q.id, 'subject', selectedSection.subject);
                                onUpdateQuestion(q.id, 'sectionId', selectedSection.id);
                                // 更新科目分类为对应Section的默认科目分类
                                const defaultCategory = SECTION_SUBJECT_TO_DEFAULT_CATEGORY[selectedSection.subject] || DEFAULT_SUBJECT_CATEGORY;
                                onUpdateQuestion(q.id, 'subjectCategory', defaultCategory);
                              }
                            }}
                            className="w-full rounded-md"
                        >
                          {sections.map(s => (
                              <Option key={s.id} value={s.name}>{s.name}</Option>
                          ))}
                        </Select>
                      </div>

                      {/* Section难度 - 均等固定宽度 */}
                      <div className="flex-1 min-w-40">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section难度</label>
                        <div className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 text-xs min-h-[32px] flex items-center">
                          {SECTION_DIFFICULTY_OPTIONS.find(opt => opt.value === (q.sectionDifficulty || SECTION_DIFFICULTY_ENUM.MEDIUM))?.label || '中等'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">科目分类</label>
                        <Select
                            value={q.subjectCategory || SECTION_SUBJECT_TO_DEFAULT_CATEGORY[q.subject] || DEFAULT_SUBJECT_CATEGORY}
                            onChange={v => {
                              onUpdateQuestion(q.id, 'subjectCategory', v);
                              const types = QUESTION_TYPES_BY_CATEGORY[v] || [];
                              if (types.length > 0) {
                                onUpdateQuestion(q.id, 'type', types[0]);
                              }
                            }}
                            className="w-full rounded-md"
                        >
                          {(SECTION_SUBJECT_CATEGORY_OPTIONS[q.subject] || []).map(cat => (
                            <Option key={cat} value={cat}>{SUBJECT_CATEGORY_LABELS[cat]}</Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">知识点</label>
                        <Select
                            value={q.type}
                            onChange={v => onUpdateQuestion(q.id, 'type', v)}
                            className="w-full rounded-md"
                        >
                          {(QUESTION_TYPES_BY_CATEGORY[q.subjectCategory || SECTION_SUBJECT_TO_DEFAULT_CATEGORY[q.subject]] || []).map(t => (
                            <Option key={t} value={t}>{QUESTION_TYPE_LABELS[t] ?? t}</Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">题目难度</label>
                        <Select
                            value={q.difficulty}
                            onChange={v => onUpdateQuestion(q.id, 'difficulty', v)}
                            className="w-full rounded-md"
                        >
                          {SECTION_DIFFICULTY_OPTIONS.map(opt => (
                              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">题目内容</label>
                      <RichTextEditor
                        id={`question-content-${q.id}`}
                        value={q.content === '已录入' ? '' : (q.content || '')}
                        onChange={value => onUpdateQuestion(q.id, 'content', value)}
                        placeholder="请输入题目内容..."
                        previewPlaceholder="请输入题目内容..."
                        onRenderMath={() => onRenderMathInPreview(`preview-question-content-${q.id}`)}
                        showPreview={true}
                        showToolbar={false}
                        onToolbarAction={onToolbarAction}
                        filterPasteLineBreaks={true}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">问题描述</label>
                      <RichTextEditor
                        id={`question-description-${q.id}`}
                        value={q.description || ''}
                        onChange={value => onUpdateQuestion(q.id, 'description', value)}
                        placeholder="输入问题描述..."
                        showPreview={true}
                        onRenderMath={() => onRenderMathInPreview(`preview-question-description-${q.id}`)}
                        showToolbar={false}
                        onToolbarAction={onToolbarAction}
                        filterPasteLineBreaks={true}
                      />
                    </div>

                    {q.interactionType === INTERACTION_TYPE_ENUM.CHOICE && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {['A', 'B', 'C', 'D'].map((opt, idx) => (
                          <div key={opt}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">选项 {opt}</label>
                            <RichTextEditor
                              id={`option-${opt}-${q.id}`}
                              value={q.options[idx]}
                              onChange={value => {
                                const currentOptions = Array.isArray(q.options) ? q.options : ['', '', '', ''];
                                const newOpts = [...currentOptions];
                                newOpts[idx] = value;
                                onUpdateQuestion(q.id, 'options', newOpts);
                              }}
                              placeholder={`输入选项${opt}内容...`}
                              showPreview={true}
                              onRenderMath={() => onRenderMathInPreview(`preview-option-${opt}-${q.id}`)}
                              showToolbar={false}
                              onToolbarAction={onToolbarAction}
                              filterPasteLineBreaks={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">正确答案</label>
                        {q.interactionType === INTERACTION_TYPE_ENUM.CHOICE ? (
                          <Select
                            value={q.correctAnswer}
                            onChange={v => onUpdateQuestion(q.id, 'correctAnswer', v)}
                            className="w-full rounded-md"
                          >
                            {['A', 'B', 'C', 'D'].map(o => (
                              <Option key={o} value={o}>{o}</Option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            value={q.correctAnswer}
                            onChange={e => onUpdateQuestion(q.id, 'correctAnswer', e.target.value)}
                            placeholder="输入正确答案"
                            className="rounded-md"
                          />
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">解析</label>
                        <RichTextEditor
                          id={`explanation-${q.id}`}
                          value={q.explanation}
                          onChange={value => onUpdateQuestion(q.id, 'explanation', value)}
                          placeholder="输入答案解析..."
                          showPreview={true}
                          onRenderMath={() => onRenderMathInPreview(`preview-explanation-${q.id}`)}
                          showToolbar={false}
                          onToolbarAction={onToolbarAction}
                          filterPasteLineBreaks={true}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Empty description="请在左侧选择题目或点击添加按钮" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-8">
        <Button size="large" onClick={onPrev} className="h-12 px-8 rounded-md">
          上一步：修改 Section 信息
        </Button>
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={onSubmit}
            className="h-12 px-12 rounded-md bg-green-600 hover:bg-green-700 border-0 font-bold shadow-lg shadow-green-500/20"
          >
            {isEditMode ? '保存修改' : '提交并完成录入'}
          </Button>
        </Space>
      </div>
    </>
  );
}

export default ExamSetQuestionStep;