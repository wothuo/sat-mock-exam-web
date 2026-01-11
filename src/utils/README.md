# 请求Service使用文档

## 概述

这是一个专为小型创业团队设计的轻量级HTTP请求封装方案，基于原生`fetch`实现，无需额外依赖。

## 核心特性

- ✅ **统一请求/响应拦截器** - 支持全局请求和响应处理
- ✅ **自动Token管理** - 自动添加token，过期自动跳转登录
- ✅ **统一错误处理** - 自动处理HTTP错误和业务错误
- ✅ **请求超时控制** - 支持自定义超时时间
- ✅ **请求取消** - 支持AbortController取消请求
- ✅ **TypeScript友好** - 完整的JSDoc类型注释

## 快速开始

### 1. 基础使用

```javascript
import { get, post, put, del } from '@/utils/request';

// GET请求
const data = await get('/users', { page: 1, pageSize: 10});

// POST请求
const result = await post('/users', { name: 'John', email: 'john@example.com' });

// PUT请求
const updated = await put('/users/1', { name: 'Jane' });

// DELETE请求
await del('/users/1');
```

### 2. 使用Service模块（推荐）

```javascript
// 在 services/ 目录下创建对应的服务文件
import { login, getCurrentUser } from '@/services/auth';
import { fetchTrainingQuestions } from '@/services/training';

// 在组件中使用
const handleLogin = async () => {
  try {
    const result = await login({ email, password });
    // 处理登录结果
  } catch (error) {
    // 错误已自动处理，这里可以做额外处理
  }
};
```

### 3. 高级配置

```javascript
import { post } from '@/utils/request';

// 自定义配置
const result = await post('/api/data', 
  { key: 'value' },
  {
    needAuth: false,      // 不需要认证
    showError: false,     // 不显示错误提示
    timeout: 60000,       // 60秒超时
    headers: {            // 自定义请求头
      'X-Custom-Header': 'value'
    }
  }
);
```

## Token管理

### 保存认证信息

```javascript
import { saveAuthData } from '@/utils/token';

// 登录成功后保存token
const loginResult = await login(credentials);
saveAuthData({
  token: loginResult.token,
  refreshToken: loginResult.refreshToken,
  expiresIn: loginResult.expiresIn // 秒数
});
```

### 手动管理Token

```javascript
import { getToken, setToken, clearToken } from '@/utils/token';

// 获取token
const token = getToken();

// 设置token
setToken('your-token');

// 清除token（登出时使用）
clearToken();
```

## 拦截器使用

### 请求拦截器

```javascript
import { addRequestInterceptor } from '@/utils/request';

// 添加请求拦截器（例如：添加时间戳）
addRequestInterceptor((config) => {
  config.headers = {
    ...config.headers,
    'X-Request-Time': Date.now().toString()
  };
  return config;
});
```

### 响应拦截器

```javascript
import { addResponseInterceptor } from '@/utils/request';

// 添加响应拦截器（例如：统一处理数据格式）
addResponseInterceptor((response) => {
  // 可以在这里统一处理响应数据
  if (response.data && Array.isArray(response.data)) {
    // 处理数组数据
  }
  return response;
});
```

## 错误处理

### 自动错误处理

默认情况下，所有错误都会自动显示错误提示。如果不想显示，可以设置`showError: false`：

```javascript
try {
  const result = await post('/api/data', data, { showError: false });
} catch (error) {
  // 手动处理错误
  console.error('自定义错误处理:', error);
  // error.message - 错误消息
  // error.code - 错误码（如果有）
  // error.data - 错误数据（如果有）
}
```

### 错误类型

- **网络错误**: 请求失败、超时等
- **HTTP错误**: 401未授权、403禁止、404未找到、500服务器错误等
- **业务错误**: 后端返回的code !== 0的错误

## 环境配置

在项目根目录创建`.env`文件：

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

如果不设置，默认使用`/api`作为基础路径。

## 最佳实践

### 1. 按模块组织Service

```
src/
  services/
    auth.js          # 认证相关
    training.js      # 训练相关
    exam.js          # 考试相关
    question.js      # 题目相关
    index.js         # 统一导出
```

### 2. 统一错误处理

在拦截器中统一处理常见错误：

```javascript
addResponseInterceptor((response) => {
  // 统一处理业务错误
  if (response.code === 1001) {
    // 特定错误码的处理
  }
  return response;
});
```

### 3. 请求loading管理

虽然service不直接管理loading，但可以配合Ant Design的message使用：

```javascript
import { message } from 'antd';

const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await get('/api/data');
    message.success('获取成功');
  } catch (error) {
    // 错误已自动处理
  } finally {
    setLoading(false);
  }
};
```

### 4. 请求取消

虽然service支持AbortController，但通常不需要手动取消。如果需要，可以这样：

```javascript
// 在组件卸载时取消请求
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal });
  
  return () => {
    controller.abort();
  };
}, []);
```

## 迁移指南

### 从原生fetch迁移

**之前：**
```javascript
const response = await fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
const result = await response.json();
```

**之后：**
```javascript
import { post } from '@/utils/request';
const result = await post('/api/data', data);
```

### 从axios迁移

**之前：**
```javascript
import axios from 'axios';
const response = await axios.post('/api/data', data);
```

**之后：**
```javascript
import { post } from '@/utils/request';
const response = await post('/api/data', data);
// 注意：response直接是业务数据，不是axios的response对象
```

## 常见问题

### Q: 如何上传文件？

A: 使用FormData：

```javascript
import { post } from '@/utils/request';

const formData = new FormData();
formData.append('file', file);

const result = await post('/api/upload', formData, {
  headers: {
    // 不要设置Content-Type，让浏览器自动设置
  }
});
```

### Q: 如何处理文件下载？

A: 使用blob响应：

```javascript
// 需要修改request.js支持blob，或者直接使用fetch
const response = await fetch('/api/download', {
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
});
const blob = await response.blob();
// 处理blob
```

### Q: 如何实现token自动刷新？

A: 在响应拦截器中处理：

```javascript
import { refreshToken, saveAuthData } from '@/services/auth';
import { getToken } from '@/utils/token';

addResponseInterceptor(async (response) => {
  // 如果token过期，自动刷新
  if (response.code === 401 && getToken()) {
    try {
      const newToken = await refreshToken();
      saveAuthData(newToken);
      // 重新发送原请求（需要实现请求重试机制）
    } catch (error) {
      // 刷新失败，跳转登录
    }
  }
  return response;
});
```

## 扩展建议

对于更复杂的需求，可以考虑：

1. **请求重试机制** - 网络错误时自动重试
2. **请求缓存** - 缓存GET请求结果
3. **请求队列** - 控制并发请求数量
4. **请求日志** - 开发环境记录所有请求
5. **Mock数据** - 开发环境使用Mock数据

这些功能可以根据实际需求逐步添加，保持方案的轻量级特性。

