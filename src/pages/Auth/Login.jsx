import React, { useState, useEffect } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Button, Form, Input, message, Alert } from 'antd';

import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';

import { login } from '../../services/auth';
import { saveAuthData, clearSessionConflict, hasSessionConflict } from '../../utils/token';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [showSessionConflictAlert, setShowSessionConflictAlert] = useState(false);


  // 登录页面加载时，自动清除任何可能存在的会话冲突标记
  // 确保每次登录尝试都是干净的状态
  // 登录页面加载时，自动清除任何可能存在的会话冲突标记
  // 确保每次登录尝试都是干净的状态
  useEffect(() => {
    // 清除可能存在的会话冲突标记
    clearSessionConflict();
    
    // 重置会话冲突警告状态
    setShowSessionConflictAlert(false);
    
    // 只有当location中有明确的会话冲突状态时才显示警告
    // 这通常发生在用户从其他页面被重定向过来的情况
    if (location.state?.sessionConflict) {
      setShowSessionConflictAlert(true);
    }
  }, [location]);

  const handleSubmit = async (values) => {
    console.log('Login values:', values);

    setIsLoading(true);
    try {
      const loginResult = await login(values);
      console.log('Login response:', loginResult);
      
      // 根据后端响应结构，登录数据可能在data字段中
      const res = loginResult.data || loginResult;
      
      // 保存认证信息
      if (res.sessionId) {
        // 提取用户信息
        const { sessionId, sessionTimeout, ...userInfo } = res;
        
        saveAuthData({
          sessionId: sessionId,
          sessionTimeout: sessionTimeout,
          ...userInfo
        });
        message.success('登录成功！');
        
        // 直接导航到主页，强制刷新页面以确保状态更新
        window.location.href = '/';
      } else {
        console.error('Login failed: No sessionId in response', res);
        message.error('登录失败：未获取到sessionID');
      }
    } catch (err) {
      console.error('Login error:', err);
      // 登录失败时只显示错误信息
      message.error(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-trophy text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">ReachTop</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-600">登录您的账户继续学习</p>
          </div>
          
          {/* 会话冲突警告 */}
          {showSessionConflictAlert && (
            <Alert
              message="会话冲突"
              description="您的账号已在其他设备登录，继续登录将使当前会话生效，其他设备上的会话将被终止。"
              type="warning"
              showIcon
              closable
              onClose={() => setShowSessionConflictAlert(false)}
              className="mb-4"
            />)}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className="space-y-2"
          >
            <Form.Item
              name="username"
              label={<span className="text-sm font-medium text-gray-700">账户</span>}
              rules={[
                { required: true, message: '请输入账户' }
              ]}
            >
              <Input
                prefix={<span className="text-gray-400" />}
                placeholder="请输入你的账户"
                className="rounded-xl"
              />
            </Form.Item>
            {/* <Form.Item
              name="email"
              label={<span className="text-sm font-medium text-gray-700">邮箱地址</span>}
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="your@email.com"
                className="rounded-xl"
              />
            </Form.Item> */}

            <Form.Item
              name="password"
              label={<span className="text-sm font-medium text-gray-700">密码</span>}
              rules={[
                { required: true, message: '请输入密码' },
                // { min: 6, message: '密码长度至少6位' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </Form.Item>

            {/* <div className="flex items-center justify-between py-2">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
                忘记密码？
              </Link>
            </div> */}

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                defaultActiveBg="black"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 border-0 shadow-lg font-medium text-base custom-login-btn"
                icon={!isLoading && <i className="fas fa-sign-in-alt mr-2"></i>}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>

            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者使用</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                icon={<GoogleOutlined />}
                className="h-12 rounded-xl flex items-center justify-center"
              >
                Google
              </Button>
              <Button
                icon={<GithubOutlined />}
                className="h-12 rounded-xl flex items-center justify-center"
              >
                GitHub
              </Button>
            </div> */}
          </Form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账户？{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500 transition-colors">
                立即注册
              </Link>
            </p>
          </div> */}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center">
            <ArrowLeftOutlined className="mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;