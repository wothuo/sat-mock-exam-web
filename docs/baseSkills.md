一、代码规范检查清单
✅ 必须遵循
使用函数组件和 Hooks，避免类组件
API 调用必须有错误处理
Form 表单必须有验证规则
Table 组件必须设置 rowKey
异步操作必须有 loading 状态
使用 TypeScript 或 PropTypes 进行类型检查
组件必须有适当的 key 属性
避免在 render 中创建函数

✅ 推荐实践
使用 antd 的 message/notification 而非 alert
使用 ConfigProvider 进行全局配置
表单使用 Form.useForm() 而非 ref
使用自定义 Hooks 封装复用逻辑
API 模块化管理
使用环境变量管理配置
组件拆分，单一职责
使用 CSS Modules 或 styled-components