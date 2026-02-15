import { mathDirections } from './math';
import { readingWritingDirections } from './readingWriting';

/**
 * 根据 sectionCategory 返回对应 Directions 内容
 * @param {string} sectionCategory - Section 分类：数学 / 阅读语法
 * @returns {{ title: string, content: string }}
 */
export function getDirectionsBySectionType(sectionCategory) {
  return sectionCategory === '数学' ? mathDirections : readingWritingDirections;
}

/**
 * 从题目数据推断 sectionCategory（API 可能不返回该字段）
 * @param {Object} firstItem - 题目列表第一项
 * @returns {string} 数学 | 阅读语法
 */
export function inferSectionCategory(firstItem) {
  if (!firstItem) return '阅读语法';

  const sectionCategory = firstItem.sectionCategory;
  if (sectionCategory === '数学' || sectionCategory === '阅读语法') {
    return sectionCategory;
  }

  const sectionName = (firstItem.sectionName || '').toLowerCase();
  if (sectionName.includes('math') || sectionName.includes('数学')) {
    return '数学';
  }
  if (sectionName.includes('reading') || sectionName.includes('writing') || sectionName.includes('阅读') || sectionName.includes('语法')) {
    return '阅读语法';
  }

  const questionCategory = firstItem.question?.questionCategory || '';
  if (questionCategory === '数学') return '数学';
  if (questionCategory === '阅读' || questionCategory === '语法') return '阅读语法';

  return '阅读语法';
}
