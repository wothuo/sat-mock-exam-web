# 环境配置快速指南

## 功能说明

✅ **本地开发**：可以切换调用本地/预发/线上接口  
✅ **预发部署**：自动使用预发接口  
✅ **生产部署**：自动使用生产接口  

## 快速使用

### 本地开发

**使用本地接口（默认）**：
```bash
npm run dev
# API基础地址: http://localhost:8080
# 接口示例: http://localhost:8080/user-account/login
```

**切换为预发接口**：
```bash
REACT_APP_API_BASE_URL=https://staging-api.example.com npm run dev
```

**切换为生产接口**：
```bash
REACT_APP_API_BASE_URL=https://api.example.com npm run dev
```

### 部署到预发服务器

**构建预发版本**：
```bash
NODE_ENV=production REACT_APP_DEPLOY_ENV=staging npm run build
```

**配置预发API地址**（编辑 `.env.staging`）：
```bash
REACT_APP_STAGING_API_URL=https://your-staging-api.com
```

### 部署到生产服务器

**构建生产版本**：
```bash
NODE_ENV=production npm run build
```

**配置生产API地址**（编辑 `.env.production`）：
```bash
REACT_APP_PRODUCTION_API_URL=https://your-production-api.com
```

## 配置文件

- `.env.development` - 本地开发配置
- `.env.staging` - 预发环境配置
- `.env.production` - 生产环境配置

详细说明请查看 `ENV_GUIDE.md`

