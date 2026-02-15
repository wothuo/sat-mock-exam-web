import { mathDirections } from './math';
import { readingWritingDirections } from './readingWriting';

/**
 * 根据 sectionCategory 返回对应 Directions 内容
 * @param {string} sectionCategory - Section 分类：数学 / 阅读语法
 * @returns {{ title: string, content: string }}
 */
export function getDirectionsBySectionType(sectionCategory) {
  if(!sectionCategory) return null; 
  if(sectionCategory === '数学') return mathDirections;
  if(sectionCategory === '阅读语法') return readingWritingDirections;
  return null;
}

/**
 * 从题目数据获取 sectionCategory
 * @param {Object} firstItem - 题目列表第一项
 * @returns {string} 数学 | 阅读语法
 */
export function getSectionCategory(firstItem) {
  console.log('firstItem', firstItem);
  const sectionCategory = firstItem?.question?.questionCategory;
  if (sectionCategory === '数学' || sectionCategory === '阅读语法') {
    return sectionCategory;
  }
  return '';
}
