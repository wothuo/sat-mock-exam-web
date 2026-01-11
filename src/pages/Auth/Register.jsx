import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Button, Checkbox, Form, Input, message } from 'antd';

import { ArrowLeftOutlined, GithubOutlined, GoogleOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      message.success('注册成功！');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-trophy text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">ReachTop</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">创建账户</h2>
            <p className="text-gray-600">开始您的学习之旅</p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className="space-y-2"
          >
            <Form.Item
              name="name"
              label={<span className="text-sm font-medium text-gray-700">姓名</span>}
              rules={[
                { required: true, message: '请输入姓名' },
                { min: 2, message: '姓名至少2个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="张三"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
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
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-sm font-medium text-gray-700">密码</span>}
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少6位' },
                {
                  pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: '密码必须包含大小写字母和数字'
                }
              ]}
              extra={<span className="text-xs text-gray-500">密码必须包含大小写字母和数字，至少6位</span>}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-sm font-medium text-gray-700">确认密码</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码输入不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款和隐私政策')),
                },
              ]}
            >
              <Checkbox>
                我同意{' '}
                <Link to="/terms" className="font-medium text-red-600 hover:text-red-500">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" className="font-medium text-red-600 hover:text-red-500">
                  隐私政策
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg font-medium text-base"
                icon={!isLoading && <i className="fas fa-user-plus mr-2"></i>}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </Form.Item>

            <div className="relative my-6">
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
            </div>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500 transition-colors">
                立即登录
              </Link>
            </p>
          </div>
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

export default Register;

