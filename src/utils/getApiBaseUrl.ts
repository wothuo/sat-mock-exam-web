/**
 * 获取 API 基础 URL
 * - 本地开发：支持通过 ?env=staging / ?env=prod 临时切换
 * - 生产环境（预发/线上）：锁定为构建时注入的值，禁止切换
 */
export function getApiBaseUrl(): string {
  // 生产环境（已部署）：直接使用构建时确定的地址
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 本地开发：读取 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  const env = urlParams.get('env');

  if (env === 'staging') {
    return 'http://47.110.243.237:8080'; // 预发接口
  }
  if (env === 'local') {
    return 'http://localhost:8080'; // 本地接口
  }

  // 默认回退到 .env.development 中的值
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
}

// 可选：在控制台打印当前环境（仅开发）
if (!import.meta.env.PROD) {
  console.info(`[API] 当前请求环境: ${getApiBaseUrl()}`);
}