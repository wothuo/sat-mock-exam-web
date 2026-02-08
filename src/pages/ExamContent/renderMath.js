/**
 * 在指定容器内渲染 LaTeX 公式。优先使用 npm 包，不可用时回退到 CDN 挂载的 window.renderMathInElement
 */
let renderFn = null;

async function getRenderFn() {
  if (renderFn) return renderFn;
  try {
    const m = await import('katex/dist/contrib/auto-render.mjs');
    renderFn = m.default;
    return renderFn;
  } catch (_) {
    renderFn = typeof window !== 'undefined' ? window.renderMathInElement : null;
    return renderFn;
  }
}

const defaultOptions = {
  delimiters: [
    { left: '$', right: '$', display: false },
    { left: '$$', right: '$$', display: true }
  ],
  throwOnError: false,
  strict: false
};

/**
 * 对页面内 .selectable-text, .math-content 渲染公式（异步，支持 npm 与 CDN 回退）
 * @param {Object} options - { delimiters, throwOnError, strict }
 */
export function renderMathInContainers(options = {}) {
  const opts = { ...defaultOptions, ...options };
  getRenderFn().then((fn) => {
    const containers = document.querySelectorAll('.selectable-text, .math-content');
    if (!fn) {
      containers.forEach((c) => { c.style.visibility = 'visible'; });
      return;
    }
    containers.forEach((container) => {
      try {
        fn(container, opts);
        container.style.visibility = 'visible';
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        container.style.visibility = 'visible';
      }
    });
  });
}
