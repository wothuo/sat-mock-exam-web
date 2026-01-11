# 环境配置使用指南

## 概述

项目支持三种环境：
- **开发环境（development）**: 本地开发，默认使用 `http://localhost:8080`
- **预发环境（staging）**: 部署到预发服务器，使用预发API
- **生产环境（production）**: 部署到线上服务器，使用生产API

## 功能说明

### 1. 本地开发环境

**默认行为**：使用本地接口 `http://localhost:8080/user-account`

**切换为预发接口**：
```bash
# 方法1：通过环境变量（推荐）
REACT_APP_API_BASE_URL=https://staging-api.example.com npm run dev

# 方法2：修改 .env.development 文件
# 取消注释并填写：REACT_APP_API_BASE_URL=https://staging-api.example.com
```

**切换为生产接口**：
```bash
# 方法1：通过环境变量（推荐）
REACT_APP_API_BASE_URL=https://api.example.com npm run dev

# 方法2：修改 .env.development 文件
# 取消注释并填写：REACT_APP_API_BASE_URL=https://api.example.com
```

### 2. 预发环境部署

**部署到预发服务器时**，系统会自动：
1. 读取 `.env.staging` 配置
2. 使用预发API基础地址：`${REACT_APP_STAGING_API_URL}`
3. 接口需要写完整路径，例如：`/user-account/login`、`/sat-question/add`

**配置方式**：
编辑 `.env.staging` 文件：
```bash
REACT_APP_STAGING_API_URL=https://your-staging-api.com
REACT_APP_DEPLOY_ENV=staging
```

**构建命令**：
```bash
NODE_ENV=production REACT_APP_DEPLOY_ENV=staging npm run build
```

### 3. 生产环境部署

**部署到线上服务器时**，系统会自动：
1. 读取 `.env.production` 配置
2. 使用生产API基础地址：`${REACT_APP_PRODUCTION_API_URL}`
3. 接口需要写完整路径，例如：`/user-account/login`、`/sat-question/add`

**配置方式**：
编辑 `.env.production` 文件：
```bash
REACT_APP_PRODUCTION_API_URL=https://your-production-api.com
REACT_APP_DEPLOY_ENV=production
```

**构建命令**：
```bash
NODE_ENV=production npm run build
```

## 配置文件说明

### .env.development（本地开发）

```bash
# 默认使用本地接口，如需切换取消注释：
# REACT_APP_API_BASE_URL=https://staging-api.example.com
```

### .env.staging（预发环境）

```bash
REACT_APP_STAGING_API_URL=https://staging-api.example.com
REACT_APP_DEPLOY_ENV=staging
```

### .env.production（生产环境）

```bash
REACT_APP_PRODUCTION_API_URL=https://api.example.com
REACT_APP_DEPLOY_ENV=production
```

## 环境判断逻辑

系统按以下优先级判断环境：

1. **REACT_APP_ENV** - 手动指定环境（用于本地开发切换）
2. **NODE_ENV + REACT_APP_DEPLOY_ENV** - 部署时自动判断
   - `NODE_ENV=production` + `REACT_APP_DEPLOY_ENV=staging` → 预发环境
   - `NODE_ENV=production` + `REACT_APP_DEPLOY_ENV=production` → 生产环境
3. **默认** - 开发环境

## 使用示例

### 本地开发 - 使用本地接口

```bash
npm run dev
# API基础地址: http://localhost:8080
# 接口示例: http://localhost:8080/user-account/login
```

### 本地开发 - 使用预发接口

```bash
REACT_APP_API_BASE_URL=https://staging-api.example.com npm run dev
# API基础地址: https://staging-api.example.com
# 接口示例: https://staging-api.example.com/user-account/login
```

### 本地开发 - 使用生产接口

```bash
REACT_APP_API_BASE_URL=https://api.example.com npm run dev
# API基础地址: https://api.example.com
# 接口示例: https://api.example.com/user-account/login
```

### 构建预发版本

```bash
NODE_ENV=production REACT_APP_DEPLOY_ENV=staging npm run build
# 自动使用 .env.staging 中的配置
```

### 构建生产版本

```bash
NODE_ENV=production npm run build
# 自动使用 .env.production 中的配置
```

## 验证配置

启动开发服务器后，打开浏览器控制台，会看到：

```
🔧 当前环境: development
🔧 API地址: http://localhost:8080
```

如果使用了自定义API地址，会显示：

```
🔧 当前环境: development
🔧 API地址: https://staging-api.example.com
⚠️  使用自定义API地址: https://staging-api.example.com
```

## 更新API地址

### 更新预发环境地址

编辑 `.env.staging`：
```bash
REACT_APP_STAGING_API_URL=https://new-staging-api.com
```

### 更新生产环境地址

编辑 `.env.production`：
```bash
REACT_APP_PRODUCTION_API_URL=https://new-production-api.com
```

## 注意事项

1. **不要提交 .env 文件到 Git**
   - `.env.*` 文件应添加到 `.gitignore`
   - 可以提交 `.env.example` 作为模板

2. **环境变量命名**
   - 必须以 `REACT_APP_` 开头才能在代码中访问
   - Webpack会自动注入这些变量

3. **接口路径**
   - 每个接口有自己的完整路径，需要写完整路径
   - 例如：
     - `/user-account/login` → `http://localhost:8080/user-account/login`
     - `/sat-question/add` → `http://localhost:8080/sat-question/add`
     - `/exam-pool/add` → `http://localhost:8080/exam-pool/add`

4. **CORS问题**
   - 本地访问预发/生产接口时，确保后端配置了CORS
   - 或使用webpack proxy代理

5. **部署时环境变量**
   - 确保部署服务器上已配置对应的环境变量
   - 或在CI/CD流程中设置环境变量

## CI/CD 配置示例

### GitHub Actions

```yaml
# 预发环境
- name: Build staging
  run: |
    NODE_ENV=production REACT_APP_DEPLOY_ENV=staging npm run build
  env:
    REACT_APP_STAGING_API_URL: ${{ secrets.STAGING_API_URL }}

# 生产环境
- name: Build production
  run: |
    NODE_ENV=production npm run build
  env:
    REACT_APP_PRODUCTION_API_URL: ${{ secrets.PRODUCTION_API_URL }}
```

### Docker

```dockerfile
# 预发环境
ARG DEPLOY_ENV=staging
ENV REACT_APP_DEPLOY_ENV=$DEPLOY_ENV
ENV REACT_APP_STAGING_API_URL=https://staging-api.example.com

# 生产环境
ARG DEPLOY_ENV=production
ENV REACT_APP_DEPLOY_ENV=$DEPLOY_ENV
ENV REACT_APP_PRODUCTION_API_URL=https://api.example.com
```

