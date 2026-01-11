# 项目请求Service架构设计文档

## 项目分析

### 项目概况
- **项目名称**: IELTS模拟考试系统 (edu-front-pc)
- **技术栈**: React 18 + React Router 6 + Ant Design 5 + Tailwind CSS
- **构建工具**: Webpack 5
- **项目类型**: 教育类前端应用

### 项目结构
```
src/
├── components/          # 公共组件
│   ├── common/         # 通用组件
│   └── Layout/         # 布局组件
├── pages/              # 页面组件
│   ├── Auth/          # 认证相关
│   ├── Courses/       # 课程
│   ├── ExamContent/   # 考试内容
│   ├── SpecialTraining/ # 专项训练
│   └── ...            # 其他页面
├── styles/            # 样式文件
└── utils/             # 工具函数（新增）
└── services/          # API服务（新增）
```

### 现有问题
1. ❌ **缺少统一的请求封装** - 使用原生fetch，代码重复
2. ❌ **没有token管理机制** - 认证信息管理分散
3. ❌ **错误处理不统一** - 每个API调用都需要单独处理错误
4. ❌ **缺少请求拦截器** - 无法统一添加请求头、处理响应等
5. ❌ **API调用分散** - 各页面直接调用fetch，难以维护

## 设计方案

### 设计原则
1. **轻量级** - 基于原生fetch，无额外依赖
2. **易用性** - API简洁，学习成本低
3. **可扩展** - 支持拦截器、自定义配置
4. **类型友好** - 完整的JSDoc注释
5. **适合小团队** - 简单直接，快速上手

### 架构设计

```
┌─────────────────────────────────────────┐
│          React Components              │
│  (Pages, Components)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Services Layer                 │
│  (auth.js, training.js, ...)            │
│  - 按业务模块组织                        │
│  - 统一的API接口定义                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       Request Service (request.js)      │
│  - 统一请求方法 (get, post, put, del)   │
│  - 请求/响应拦截器                       │
│  - 错误处理                              │
│  - Token自动管理                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       Token Manager (token.js)          │
│  - Token存储和获取                       │
│  - Token过期检查                         │
│  - 认证信息管理                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Native Fetch API               │
└─────────────────────────────────────────┘
```

### 核心文件说明

#### 1. `src/utils/request.js` - 核心请求Service
**功能**:
- 统一的HTTP请求封装
- 请求/响应拦截器支持
- 自动token管理
- 统一错误处理
- 请求超时控制

**主要方法**:
- `get(url, params, config)` - GET请求
- `post(url, data, config)` - POST请求
- `put(url, data, config)` - PUT请求
- `del(url, config)` - DELETE请求
- `addRequestInterceptor(interceptor)` - 添加请求拦截器
- `addResponseInterceptor(interceptor)` - 添加响应拦截器

#### 2. `src/utils/token.js` - Token管理工具
**功能**:
- Token的存储和获取
- Token过期检查
- 认证信息统一管理

**主要方法**:
- `getToken()` - 获取访问token
- `setToken(token)` - 设置token
- `saveAuthData(authData)` - 保存完整认证信息
- `clearToken()` - 清除所有token
- `isTokenExpired()` - 检查token是否过期

#### 3. `src/services/` - API服务模块
**组织方式**:
- 按业务模块划分（auth.js, training.js等）
- 每个模块导出相关的API方法
- 统一从index.js导出

**优势**:
- 代码组织清晰
- 易于维护和扩展
- 便于团队协作

### 使用流程

#### 1. 基础使用
```javascript
// 在service文件中定义API
import { post, get } from '@/utils/request';

export const login = async (credentials) => {
  const response = await post('/auth/login', credentials, {
    needAuth: false
  });
  return response.data;
};

// 在组件中使用
import { login } from '@/services/auth';

const handleLogin = async () => {
  try {
    const result = await login({ email, password });
    // 处理结果
  } catch (error) {
    // 错误已自动处理
  }
};
```

#### 2. Token管理
```javascript
import { saveAuthData } from '@/utils/token';

// 登录成功后
const result = await login(credentials);
saveAuthData({
  token: result.token,
  refreshToken: result.refreshToken,
  expiresIn: result.expiresIn
});
```

#### 3. 拦截器配置
```javascript
import { addRequestInterceptor, addResponseInterceptor } from '@/utils/request';

// 添加请求拦截器
addRequestInterceptor((config) => {
  config.headers['X-Request-ID'] = generateRequestId();
  return config;
});

// 添加响应拦截器
addResponseInterceptor((response) => {
  // 统一处理响应
  return response;
});
```

## 实施步骤

### ✅ 已完成
1. ✅ 创建核心请求service (`src/utils/request.js`)
2. ✅ 创建token管理工具 (`src/utils/token.js`)
3. ✅ 创建API服务模块 (`src/services/`)
4. ✅ 创建使用文档和示例
5. ✅ 更新现有API调用（向后兼容）

### 📋 待实施（可选）
1. 在登录页面集成新的service
2. 在其他页面逐步迁移到新的service
3. 根据实际需求添加更多拦截器
4. 添加请求重试机制（如需要）
5. 添加请求缓存（如需要）

## 优势分析

### 1. 开发效率提升
- **统一API调用方式** - 减少重复代码
- **自动错误处理** - 减少错误处理代码
- **自动token管理** - 无需手动添加token

### 2. 代码质量提升
- **代码组织清晰** - 按模块组织API
- **易于维护** - 统一修改点
- **类型提示** - JSDoc注释提供类型提示

### 3. 团队协作
- **统一规范** - 团队使用统一的API调用方式
- **易于上手** - 简单直观的API设计
- **文档完善** - 详细的使用文档和示例

### 4. 扩展性
- **拦截器机制** - 灵活扩展功能
- **配置化** - 支持各种自定义配置
- **轻量级** - 不引入额外依赖

## 迁移建议

### 渐进式迁移
1. **新功能** - 直接使用新的service
2. **旧功能** - 逐步迁移，保持向后兼容
3. **关键功能** - 优先迁移登录、认证等核心功能

### 迁移步骤
1. 在`src/services/`中创建对应的服务文件
2. 将API调用迁移到service文件
3. 在组件中引入service方法
4. 测试验证功能正常
5. 删除旧的API调用代码

## 最佳实践

### 1. Service组织
- 按业务模块划分service文件
- 每个service文件只包含相关API
- 统一从`services/index.js`导出

### 2. 错误处理
- 使用默认错误处理（自动显示提示）
- 特殊场景使用`showError: false`手动处理
- 在拦截器中统一处理常见错误

### 3. Token管理
- 登录成功后立即保存token
- 登出时清除token
- 利用自动过期检查机制

### 4. 拦截器使用
- 在应用启动时配置全局拦截器
- 避免在拦截器中做复杂业务逻辑
- 保持拦截器的简洁和可测试性

## 总结

这个请求service方案专为小型创业团队设计，具有以下特点：

1. **轻量级** - 无额外依赖，基于原生fetch
2. **易用性** - API简洁，学习成本低
3. **可扩展** - 支持拦截器、自定义配置
4. **类型友好** - 完整的JSDoc注释
5. **文档完善** - 详细的使用文档和示例

适合快速迭代、资源有限的小型团队使用。

