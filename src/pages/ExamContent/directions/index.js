import { SECTION_SUBJECT_ENUM } from '../../ExamSetEntry/examSetEntryConstants';
import { mathDirections } from './math';
import { readingWritingDirections } from './readingWriting';

/**
 * 根据 sectionCategory 返回对应 Directions 内容
 * @param {string} sectionCategory - Section 分类枚举：SAT_RW | SAT_MATH
 * @returns {{ title: string, content: string }}
 */
export function getDirectionsBySectionType(sectionCategory) {
  if (!sectionCategory) return null;
  if (sectionCategory === SECTION_SUBJECT_ENUM.SAT_MATH) return mathDirections;
  if (sectionCategory === SECTION_SUBJECT_ENUM.SAT_RW) return readingWritingDirections;
  return null;
}

/**
 * 从题目数据获取 sectionCategory（Section 科目枚举）
 * @param {Object} firstItem - 题目列表第一项（含 sectionCategory）
 * @returns {string} SAT_RW | SAT_MATH
 */
export function getSectionCategory(firstItem) {
  return firstItem?.sectionCategory || '';
}
