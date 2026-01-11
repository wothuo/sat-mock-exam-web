/**
 * 环境配置
 * 自动根据部署环境选择对应的API地址
 * 本地开发时可通过环境变量切换
 * 
 * 注意：每个接口有自己的完整路径，例如：
 * - /user-account/login
 * - /sat-question/add
 * - /exam-pool/add
 */

// 环境配置
const envConfig = {
  // 本地开发环境（默认）
  development: {
    // 本地开发默认使用本地接口
    // 可通过 REACT_APP_API_BASE_URL 环境变量切换为预发或线上
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  },
  
  // 预发环境（部署到预发服务器时）
  staging: {
    // 预发环境API地址，通过环境变量配置
    API_BASE_URL: process.env.REACT_APP_STAGING_API_URL || 'https://staging-api.example.com',
  },
  
  // 生产环境（部署到线上服务器时）
  production: {
    // 生产环境API地址，通过环境变量配置
    API_BASE_URL: process.env.REACT_APP_PRODUCTION_API_URL || 'https://api.example.com',
  },
};

/**
 * 获取当前环境
 * 优先级：REACT_APP_ENV > NODE_ENV > development
 */
const getCurrentEnv = () => {
  // 1. 优先使用 REACT_APP_ENV（用于本地开发切换环境）
  if (process.env.REACT_APP_ENV) {
    return process.env.REACT_APP_ENV;
  }
  
  // 2. 根据 NODE_ENV 判断（部署时自动识别）
  if (process.env.NODE_ENV === 'production') {
    // 生产环境，进一步判断是预发还是线上
    // 通过 REACT_APP_DEPLOY_ENV 区分（staging/production）
    return process.env.REACT_APP_DEPLOY_ENV || 'production';
  }
  
  // 3. 默认开发环境
  return 'development';
};

// 获取当前环境配置
const currentEnv = getCurrentEnv();
const config = envConfig[currentEnv] || envConfig.development;

// API基础URL（不包含路径，每个接口需要写完整路径）
export const API_BASE_URL = config.API_BASE_URL;

// 导出环境信息
export const ENV = currentEnv;
export const ENV_CONFIG = config;

// 环境判断工具函数
export const isDevelopment = () => currentEnv === 'development';
export const isStaging = () => currentEnv === 'staging';
export const isProduction = () => currentEnv === 'production';

// 开发环境下的日志
if (isDevelopment()) {
  console.log('🔧 当前环境:', currentEnv);
  console.log('🔧 API地址:', API_BASE_URL);
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('⚠️  使用自定义API地址:', process.env.REACT_APP_API_BASE_URL);
  }
}

