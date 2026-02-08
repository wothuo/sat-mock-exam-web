/**
 * 套题录入页工具函数：题目选项解析、提交 payload 构建等
 */

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
