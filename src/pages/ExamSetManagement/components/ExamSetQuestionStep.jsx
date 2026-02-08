import React from 'react';

import { Button, Empty, Input, Select, Space, Tag } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import RichTextEditor from './RichTextEditor';

const { Option } = Select;

/**
 * 套题录入 - 题目内容（步骤 2）
 * 仅负责展示与事件转发，题目状态与工具栏/公式等逻辑保留在父组件
 */
function ExamSetQuestionStep({
  questions,
  sections,
  selectedQuestionId,
  activeEditorId,
  questionTypesMap,
  difficulties,
  isEditMode,
  questionListRef,
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
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-20 z-10">
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
          </div>
          <div className="text-xs text-gray-500 ml-4">
            {activeEditorId ? '当前编辑器已激活' : '点击输入框激活编辑器'}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[800px]">
        <div className="w-full md:w-72 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <span className="font-bold text-gray-900">题目索引 ({questions.length})</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={onAddQuestion}
              className="rounded-lg bg-blue-600 border-0 font-bold"
            >
              添加
            </Button>
          </div>
          <div
            ref={questionListRef}
            className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
          >
            {questions.map((q, index) => {
              const isDeleted = q.delFlag === '1';
              const section = sections.find(s => s.id === q.sectionId);
              const isSectionDeleted = section?.delFlag === '1';

              return (
                <div
                  key={q.id || `question-${index}`}
                  onClick={() => !isDeleted && onSelectQuestion(q.id)}
                  className={`p-2.5 rounded-xl transition-all border-2 ${
                    isDeleted
                      ? 'border-red-200 bg-red-50/50 cursor-not-allowed'
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
                      <Tag color={q.interactionType === 'CHOICE' ? 'blue' : 'green'} className="m-0 border-0 text-[9px] font-bold px-1.5 leading-3">
                        {q.interactionType === 'CHOICE' ? 'CHOICE' : 'BLANK'}
                      </Tag>
                    </div>
                    <Tag color={isSectionDeleted ? 'red' : 'purple'} className="m-0 border-0 text-[9px] font-bold px-1 leading-3">
                      {section?.name?.split(':')[0] || '未分配'}
                      {isSectionDeleted && ' (已删除)'}
                    </Tag>
                  </div>
                  <div className="text-[10px] font-medium leading-tight">
                    {isDeleted ? (
                      <span className="text-red-500">已删除</span>
                    ) : (
                      <span className="text-gray-500">{q.status === 1 ? '已录入' : q.status === 0 ? '草稿' : q.status || '已录入'}</span>
                    )}
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

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {selectedQuestionId ? (
            <>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <Space size="middle">
                  <span className="font-black text-gray-500 uppercase tracking-widest text-sm">Editing Question</span>
                  <Tag color="purple" className="font-bold border-0 text-sm px-3 py-1">
                    {questions.find(q => q.id === selectedQuestionId)?.subject}
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {questions.filter(q => q.id === selectedQuestionId).map(q => (
                  <div key={q.id} className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">题目类型</label>
                        <Select
                          value={q.interactionType}
                          onChange={v => {
                            onUpdateQuestion(q.id, 'interactionType', v);
                            onUpdateQuestion(q.id, 'correctAnswer', v === 'CHOICE' ? 'A' : '');
                          }}
                          className="w-full h-10 rounded-lg text-sm"
                        >
                          <Option value="CHOICE">选择题</Option>
                          <Option value="BLANK">填空题</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">所属 Section</label>
                        <Select
                          value={q.sectionId}
                          onChange={v => onUpdateQuestion(q.id, 'sectionId', v)}
                          className="w-full h-10 rounded-lg text-sm"
                        >
                          {sections.map(s => (
                            <Option key={s.id} value={s.id}>{s.name}</Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">知识点</label>
                        <Select
                          value={q.type}
                          onChange={v => onUpdateQuestion(q.id, 'type', v)}
                          className="w-full h-10 rounded-lg text-sm"
                        >
                          {(questionTypesMap[q.subject] || []).map(t => (
                            <Option key={t} value={t}>{t}</Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">难度</label>
                        <Select
                          value={q.difficulty}
                          onChange={v => onUpdateQuestion(q.id, 'difficulty', v)}
                          className="w-full h-10 rounded-lg text-sm"
                        >
                          {difficulties.map(d => (
                            <Option key={d} value={d}>{d}</Option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-600 uppercase mb-2">题目内容</label>
                      <RichTextEditor
                        id={`question-content-${q.id}`}
                        value={q.content}
                        onChange={value => onUpdateQuestion(q.id, 'content', value)}
                        placeholder={q.interactionType === 'BLANK' ? '输入题目正文，填空处可用 _____ 表示...\n支持：**粗体**、*斜体*、$公式$' : '输入题目正文，支持 KaTeX 公式...\n支持：**粗体**、*斜体*、$公式$、图片上传'}
                        onRenderMath={() => onRenderMathInPreview(`preview-question-content-${q.id}`)}
                        showToolbar={false}
                        onToolbarAction={onToolbarAction}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-600 uppercase mb-2">问题描述</label>
                      <RichTextEditor
                        id={`question-description-${q.id}`}
                        value={q.description || ''}
                        onChange={value => onUpdateQuestion(q.id, 'description', value)}
                        placeholder="输入问题描述...\n支持：**粗体**、*斜体*、$公式$、图片上传"
                        showPreview={true}
                        onRenderMath={() => onRenderMathInPreview(`preview-question-description-${q.id}`)}
                        showToolbar={false}
                        onToolbarAction={onToolbarAction}
                      />
                    </div>

                    {q.interactionType === 'CHOICE' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {['A', 'B', 'C', 'D'].map((opt, idx) => (
                          <div key={opt}>
                            <label className="block text-sm font-bold text-gray-600 uppercase mb-2">选项 {opt}</label>
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
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-600 uppercase mb-2">正确答案</label>
                        {q.interactionType === 'CHOICE' ? (
                          <Select
                            value={q.correctAnswer}
                            onChange={v => onUpdateQuestion(q.id, 'correctAnswer', v)}
                            className="w-full h-10 rounded-lg text-sm"
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
                            className="h-10 rounded-lg text-sm"
                          />
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-bold text-gray-600 uppercase mb-2">解析</label>
                        <RichTextEditor
                          id={`explanation-${q.id}`}
                          value={q.explanation}
                          onChange={value => onUpdateQuestion(q.id, 'explanation', value)}
                          placeholder="输入答案解析..."
                          showPreview={true}
                          onRenderMath={() => onRenderMathInPreview(`preview-explanation-${q.id}`)}
                          showToolbar={false}
                          onToolbarAction={onToolbarAction}
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
        <Button size="large" onClick={onPrev} className="h-12 px-8 rounded-xl">
          上一步：修改 Section 信息
        </Button>
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={onSubmit}
            className="h-12 px-12 rounded-xl bg-green-600 hover:bg-green-700 border-0 font-bold shadow-lg shadow-green-500/20"
          >
            {isEditMode ? '保存修改' : '提交并完成录入'}
          </Button>
        </Space>
      </div>
    </>
  );
}

export default ExamSetQuestionStep;
