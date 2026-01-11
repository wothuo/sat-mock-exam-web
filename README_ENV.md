1. 本地开发（默认预发）
npm run dev
# 访问 http://localhost:3000


2. 本地切换到线上接口
http://localhost:3000?env=prod

3. 构建预发版本（部署到预发服务器）
npm run build:staging
# 输出到 dist/，部署后自动请求 https://staging-api.example.com

4. 构建线上版本（部署到生产服务器）
npm run build
# 输出到 dist/，部署后自动请求 https://api.example.com


🔒 安全说明
生产环境（PROD=true）时，getApiBaseUrl() 不会读取 URL 参数，因此无法被用户篡改。
所有 API 地址由构建时 .env.* 文件决定，安全可靠。
本地切换仅用于开发调试，不影响线上行为。