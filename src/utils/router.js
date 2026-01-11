/**
 * 路由导航工具
 * 用于在非React组件中（如utils）进行路由跳转
 * 通过事件机制与React Router集成
 */

// 路由导航事件名称
const ROUTE_NAVIGATE_EVENT = 'route:navigate';

/**
 * 导航到指定路径
 * @param {string} path - 目标路径
 * @param {Object} options - 导航选项
 * @param {boolean} options.replace - 是否替换当前历史记录
 */
export const navigate = (path, options = {}) => {
  // 触发自定义事件，由App组件监听并执行导航
  window.dispatchEvent(new CustomEvent(ROUTE_NAVIGATE_EVENT, {
    detail: { path, ...options }
  }));
};

/**
 * 获取路由导航事件名称（供App组件使用）
 */
export const getRouteNavigateEventName = () => ROUTE_NAVIGATE_EVENT;

