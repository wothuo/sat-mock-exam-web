# 导入顺序规范指南

## 什么是"统一导入顺序"？

**统一导入顺序**是指在所有文件中，按照相同的规则组织`import`语句的顺序。这样可以：
- 提高代码可读性
- 便于快速定位导入
- 保持团队代码风格一致
- 减少代码审查时的困惑

## 当前项目中的不一致示例

### 示例1: 从同一模块导入的顺序不一致

**auth.js** (第4行):
```javascript
import { post, get } from '../utils/request';
// post在前
```

**training.js** (第4行):
```javascript
import { get, post } from '../utils/request';
// get在前
```

**request.js** (第15行):
```javascript
import { clearToken, getToken, isTokenExpired } from './token';
// 按字母顺序
```

### 示例2: 导入类型的分组不一致

有些文件先导入React，有些先导入第三方库，顺序不统一。

## 推荐的导入顺序规范

### 标准顺序（推荐）

```javascript
// 1. 第三方库（node_modules）
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// 2. 项目内部工具/工具函数（@/utils 或相对路径到utils）
import { get, post } from '@/utils/request';
import { getToken } from '@/utils/token';
import { navigate } from '@/utils/router';

// 3. 项目内部服务（@/services）
import { login } from '@/services/auth';
import { fetchTrainingQuestions } from '@/services/training';

// 4. 项目内部组件（相对路径）
import Layout from './components/Layout';
import Header from './Header';

// 5. 项目内部常量/类型（相对路径）
import { TRAINING_SUBJECTS } from './constants';

// 6. 样式文件（最后）
import './styles.css';
```

### 同一组内的排序规则

**按字母顺序排序**（推荐）：
```javascript
// ✅ 正确：按字母顺序
import { clearToken, getToken, isTokenExpired } from './token';
import { get, post } from '../utils/request';

// ❌ 错误：顺序混乱
import { getToken, clearToken, isTokenExpired } from './token';
import { post, get } from '../utils/request';
```

## 实际应用示例

### 修复前 vs 修复后

#### 修复前（不一致）

**auth.js**:
```javascript
import { post, get } from '../utils/request';
```

**training.js**:
```javascript
import { get, post } from '../utils/request';
```

#### 修复后（统一）

**auth.js**:
```javascript
import { get, post } from '../utils/request';
```

**training.js**:
```javascript
import { get, post } from '../utils/request';
```

## 为什么这很重要？

### 1. 可读性
统一的顺序让团队成员能快速找到需要的导入。

### 2. 代码审查
审查时不需要关注顺序差异，专注于逻辑。

### 3. 工具支持
许多IDE和工具（如ESLint）可以自动排序导入。

### 4. Git Diff
统一的顺序减少不必要的diff，让变更更清晰。

## 自动化工具

### ESLint插件 ✅ 已配置

项目已配置`eslint-plugin-import`自动检查和修复导入顺序。

**配置文件**: `eslint.config.js`

**使用方法**:
```bash
# 检查导入顺序
npm run lint

# 自动修复导入顺序
npm run lint:fix
```

**配置特性**:
- ✅ 按组分类（第三方库 → 项目内部 → 相对路径）
- ✅ 组之间自动添加空行
- ✅ 同一组内按字母顺序排序
- ✅ 支持路径别名（@/）
- ✅ React相关库优先排序

### VS Code扩展（可选）

- **ESLint**: 自动检查（推荐安装）
- **Sort Imports**: 自动排序导入（可选）

## 总结

统一导入顺序是一个**代码风格规范**，虽然不影响功能，但能显著提升代码质量和团队协作效率。

**建议**：
- 新代码遵循统一规范
- 逐步修复现有代码（不强制，可在重构时进行）
- 使用工具自动检查和修复

