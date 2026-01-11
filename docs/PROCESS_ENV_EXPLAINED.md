# process.env 详解（小白友好版）

## 什么是 process？

**process** 是 Node.js 环境中的一个全局对象，它包含了当前 Node.js 进程的信息。

### 简单理解
- **Node.js 环境**：运行在服务器端的 JavaScript 环境（比如运行 `npm run dev` 时）
- **浏览器环境**：运行在浏览器中的 JavaScript 环境（用户打开网页时）

**关键点**：`process` 对象**只在 Node.js 环境中存在**，浏览器中不存在！

## 什么是 env？

**env** 是 "environment"（环境）的缩写，指的是**环境变量**。

### 环境变量是什么？

环境变量是一些配置信息，可以在不修改代码的情况下改变程序的行为。

**生活中的例子**：
- 就像你家的"总开关"，可以控制所有电器
- 改变环境变量，就像改变总开关的设置，影响整个程序

## process.env 是什么？

**process.env** 是一个对象，包含了所有的环境变量。

### 示例

```javascript
// 在 Node.js 环境中（比如 webpack.config.js）
console.log(process.env.NODE_ENV);
// 输出：'development' 或 'production'

console.log(process.env.REACT_APP_API_BASE_URL);
// 输出：'http://localhost:8080' 或 undefined
```

## 在前端开发中的使用场景

### 1. 区分开发环境和生产环境

```javascript
// 开发环境：本地调试
if (process.env.NODE_ENV === 'development') {
  console.log('这是开发环境');
  API_URL = 'http://localhost:8080';
}

// 生产环境：线上部署
if (process.env.NODE_ENV === 'production') {
  console.log('这是生产环境');
  API_URL = 'https://api.example.com';
}
```

### 2. 配置不同的 API 地址

```javascript
// 通过环境变量切换 API 地址
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 本地开发：使用本地接口
// 预发环境：使用预发接口
// 生产环境：使用生产接口
```

### 3. 存储敏感信息（不推荐在前端）

```javascript
// ⚠️ 注意：前端代码会被用户看到，不要存储密码等敏感信息
const API_KEY = process.env.REACT_APP_API_KEY;
```

## 为什么会出现 "process is not defined" 错误？

### 问题原因

1. **浏览器中没有 process 对象**
   - 浏览器是客户端环境
   - `process` 是 Node.js（服务器端）才有的对象
   - 直接在前端代码中使用 `process.env` 会报错

2. **代码执行流程**
   ```
   编写代码 → Webpack 打包 → 浏览器运行
   (有process)  (替换变量)   (没有process)
   ```

### 解决方案：Webpack DefinePlugin

**Webpack** 是一个打包工具，它可以在打包时（构建时）将代码中的 `process.env.XXX` 替换为实际值。

#### 工作原理

**构建前（源代码）**：
```javascript
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
```

**构建后（浏览器代码）**：
```javascript
// Webpack 已经将 process.env.REACT_APP_API_BASE_URL 替换为实际值
const API_URL = 'http://localhost:8080' || 'http://localhost:8080';
```

**关键点**：构建时替换，运行时已经是普通字符串了！

## 实际例子

### 例子1：环境变量文件

**`.env.development`**：
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
```

**代码中**：
```javascript
// 构建时，Webpack 会读取 .env.development
// 然后将 process.env.REACT_APP_API_BASE_URL 替换为 'http://localhost:8080'
const API_URL = process.env.REACT_APP_API_BASE_URL;
// 浏览器中实际运行的是：
// const API_URL = 'http://localhost:8080';
```

### 例子2：不同环境不同配置

**开发环境**：
```bash
# .env.development
REACT_APP_API_BASE_URL=http://localhost:8080
```

**生产环境**：
```bash
# .env.production
REACT_APP_API_BASE_URL=https://api.example.com
```

**代码中**（同一份代码）：
```javascript
// 开发环境构建：API_URL = 'http://localhost:8080'
// 生产环境构建：API_URL = 'https://api.example.com'
const API_URL = process.env.REACT_APP_API_BASE_URL;
```

## 常见问题

### Q1: 为什么我的代码在浏览器中报错 "process is not defined"？

**A**: 因为 Webpack 没有正确配置 `DefinePlugin`，导致 `process.env` 没有被替换。

**解决方法**：在 `webpack.config.js` 中配置 `DefinePlugin`。

### Q2: 环境变量什么时候生效？

**A**: 
- **构建时**：Webpack 读取环境变量并替换代码
- **运行时**：浏览器中已经是替换后的值

### Q3: 如何查看环境变量的值？

**A**: 
- **构建时**：在 `webpack.config.js` 中 `console.log(process.env.XXX)`
- **运行时**：在浏览器控制台查看（已经被替换为实际值）

### Q4: 环境变量命名有什么要求？

**A**: 
- 必须以 `REACT_APP_` 开头（React 项目）
- 或者根据项目框架的要求（如 `VITE_` 用于 Vite）

## 总结

1. **process.env** = Node.js 环境中的环境变量对象
2. **浏览器中没有 process**，所以需要 Webpack 在构建时替换
3. **环境变量**用于在不同环境（开发/预发/生产）使用不同配置
4. **DefinePlugin** 是 Webpack 的插件，负责将 `process.env.XXX` 替换为实际值

## 类比理解

**process.env 就像是一个"配置中心"**：

```
开发环境配置中心（.env.development）
├── API地址: http://localhost:8080
├── 调试模式: 开启
└── 日志级别: debug

生产环境配置中心（.env.production）
├── API地址: https://api.example.com
├── 调试模式: 关闭
└── 日志级别: error
```

代码从"配置中心"读取配置，Webpack 在打包时将这些配置"写入"到代码中，浏览器运行时直接使用这些值。

