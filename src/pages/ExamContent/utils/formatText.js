/**
 * 题干/解析等文本的简易 Markdown 与公式占位处理（仅限受信内容，接入 API 时需做 XSS 消毒）
 */
export function formatText(text) {
  if (!text) return text;

  const mathBlocks = [];
  let processed = text.replace(/\$([\s\S]*?)\$/g, (match) => {
    const placeholder = `@@@MATHBLOCK${mathBlocks.length}@@@`;
    mathBlocks.push(match);
    return placeholder;
  });

  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');

  processed = processed.split('\n').map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      return `<div class="flex items-start space-x-3 mb-2 ml-2">
          <span class="text-red-600 font-bold mt-0.5">•</span>
          <span class="flex-1">${trimmed.substring(1).trim()}</span>
        </div>`;
    }
    return line;
  }).join('\n');

  processed = processed.split('\n').map((line) => {
    if (line.includes('<div') || line.includes('<table') || line.includes('<tr') || line.includes('<td') || line.includes('<th')) {
      return line;
    }
    return line + '<br />';
  }).join('');

  mathBlocks.forEach((block, index) => {
    processed = processed.split(`@@@MATHBLOCK${index}@@@`).join(block);
  });

  return processed;
}
