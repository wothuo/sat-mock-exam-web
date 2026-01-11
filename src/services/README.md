# API服务使用指南

## 快速开始

### 1. 使用现有服务

```javascript
import { login, getCurrentUser } from '@/services/auth';
import { fetchTrainingQuestions } from '@/services/training';

// 在组件中使用
const handleLogin = async () => {
  try {
    const result = await login({ email, password });
    // 处理结果
  } catch (error) {
    // 错误已自动处理
  }
};
```

### 2. 创建新的服务模块

在`src/services/`目录下创建新的服务文件，例如`exam.js`:

```javascript
import { get, post } from '@/utils/request';

/**
 * 获取考试列表
 */
export const getExamList = async (params) => {
  const response = await get('/exam/list', params);
  return response.data;
};

/**
 * 创建考试
 */
export const createExam = async (data) => {
  const response = await post('/exam/create', data);
  return response.data;
};
```

然后在`src/services/index.js`中导出：

```javascript
export * from './exam';
```

### 3. Token管理

登录成功后保存token：

```javascript
import { login } from '@/services/auth';
import { saveAuthData } from '@/utils/token';

const handleLogin = async (credentials) => {
  const result = await login(credentials);
  saveAuthData({
    token: result.token,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn
  });
};
```

## 服务模块列表

- `auth.js` - 认证相关API
- `training.js` - 专项训练相关API

## 更多文档

详细使用文档请参考：
- [请求Service完整文档](../utils/README.md)
- [架构设计文档](../../SERVICE_ARCHITECTURE.md)
- [使用示例](../utils/request.example.js)

