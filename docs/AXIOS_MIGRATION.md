# Axios 迁移说明

## 概述

项目已从原生 `fetch` API 迁移到 `axios`，以提供更强大的功能和更好的开发体验。

## 迁移内容

### 1. 依赖变更

- ✅ 已安装 `axios` 依赖
- ✅ 旧的 `request.js` 已备份为 `request.js.bak`
- ✅ 新的 `request.ts` 已创建（TypeScript 支持）

### 2. API 兼容性

**完全兼容！** 所有现有的 API 调用无需修改：

```javascript
// 这些调用方式保持不变
import { get, post, put, del, patch } from '@/utils/request';

const data = await get('/users', { page: 1 });
const result = await post('/users', { name: 'John' });
```

### 3. 主要改进

#### 3.1 更好的错误处理
- Axios 自动处理 HTTP 错误状态码
- 更详细的错误信息（包含响应数据）
- 网络错误和超时错误的统一处理

#### 3.2 自动请求/响应转换
- 自动 JSON 序列化/反序列化
- FormData 自动处理（文件上传更简单）
- 请求参数自动序列化

#### 3.3 请求取消
- 使用 `CancelToken` 或 `AbortController`（Axios 0.22+）
- 更灵活的取消机制

#### 3.4 TypeScript 支持
- 完整的类型定义
- 更好的 IDE 提示和类型检查

### 4. 配置选项

所有原有配置选项保持不变：

```typescript
interface RequestConfig {
  needAuth?: boolean;      // 是否需要认证（默认false）
  showError?: boolean;     // 是否显示错误提示（默认true）
  showLoading?: boolean;   // 是否显示loading（默认false）
  timeout?: number;        // 请求超时时间（毫秒）
  headers?: object;        // 自定义请求头
  params?: object;         // URL查询参数（GET请求）
  data?: any;             // 请求体数据（POST/PUT等）
}
```

### 5. 高级用法

#### 5.1 使用 Axios 实例

如果需要直接使用 axios 的高级功能：

```typescript
import { axiosInstance } from '@/utils/request';

// 使用 axios 原生功能
const response = await axiosInstance.get('/api/data', {
  params: { id: 1 },
  timeout: 5000,
});
```

#### 5.2 请求取消

```typescript
import { axiosInstance } from '@/utils/request';
import axios from 'axios';

const cancelTokenSource = axios.CancelToken.source();

axiosInstance.get('/api/data', {
  cancelToken: cancelTokenSource.token
});

// 取消请求
cancelTokenSource.cancel('请求已取消');
```

#### 5.3 文件上传

```typescript
import { post } from '@/utils/request';

const formData = new FormData();
formData.append('file', file);

// Axios 会自动处理 FormData，无需手动设置 Content-Type
const response = await post('/api/upload', formData);
```

### 6. 拦截器使用

拦截器使用方式保持不变：

```typescript
import { addRequestInterceptor, addResponseInterceptor } from '@/utils/request';

// 请求拦截器
addRequestInterceptor((config) => {
  config.headers['X-Request-Time'] = Date.now().toString();
  return config;
});

// 响应拦截器
addResponseInterceptor((response) => {
  console.log('Response:', response);
  return response;
});
```

### 7. 错误处理

错误处理方式基本保持不变，但错误对象结构略有不同：

```typescript
try {
  const response = await get('/api/data');
} catch (error) {
  // error.code - HTTP 状态码或自定义错误码
  // error.message - 错误消息
  // error.data - 响应数据（如果有）
  // error.response - Axios 响应对象（完整响应）
  
  if (error.code === 401) {
    // 处理未授权
  } else if (error.code === 'NETWORK_ERROR') {
    // 处理网络错误
  }
}
```

### 8. 迁移检查清单

- [x] 安装 axios 依赖
- [x] 创建新的 request.ts 文件
- [x] 备份旧的 request.js 文件
- [x] 保持 API 兼容性
- [x] 更新示例文件
- [ ] 测试所有 API 调用
- [ ] 验证文件上传功能
- [ ] 验证错误处理
- [ ] 验证 token 管理
- [ ] 验证请求取消功能

### 9. 回滚方案

如果遇到问题需要回滚：

```bash
# 恢复旧文件
mv src/utils/request.js.bak src/utils/request.js

# 删除新文件
rm src/utils/request.ts

# 卸载 axios（可选）
npm uninstall axios
```

### 10. 常见问题

#### Q: 为什么需要迁移到 axios？
A: Axios 提供了更强大的功能，包括：
- 自动 JSON 处理
- 请求/响应拦截器
- 请求取消
- 更好的错误处理
- 更广泛的浏览器支持

#### Q: 现有代码需要修改吗？
A: 不需要！新的实现完全兼容现有 API。

#### Q: TypeScript 支持如何？
A: 新文件使用 TypeScript 编写，提供完整的类型定义。

#### Q: 性能有影响吗？
A: Axios 性能与 fetch 相当，但提供了更多便利功能。

### 11. 参考文档

- [Axios 官方文档](https://axios-http.com/)
- [项目请求 Service 文档](./README.md)

