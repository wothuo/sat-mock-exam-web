import React, { useState, useEffect } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Drawer, message } from 'antd';

import { MenuOutlined } from '@ant-design/icons';

import { logout } from '../../services/auth';
import { getToken, clearToken } from '../../utils/token';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  
  const navItems = [
    { path: '/', label: '首页' },
    // { path: '/system-overview', label: '系统总览' },
    { path: '/mock-exam', label: '套题模考' },
    { path: '/special-training', label: '专项训练' },
    { path: '/record', label: '练习记录' },
    // { path: '/courses', label: '课程讲座' },
    // { path: '/encyclopedia', label: '考试百科' },
    // { path: '/question-bank', label: '题库管理' },
    { path: '/exam-set-management', label: '套题管理' },
  ];
  
  // 监听登录状态变化
  useEffect(() => {
    // 简单的登录状态检查函数
    const checkLoginStatus = () => {
      setIsLoggedIn(!!getToken());
    };
    
    // 监听路由变化，更新登录状态
    const handleLocationChange = () => {
      checkLoginStatus();
    };
    
    // 初始检查
    checkLoginStatus();
    
    // 监听路由变化
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);
  
  // 退出登录
  const handleLogout = async () => {
    try {
      await logout();
      clearToken();
      setIsLoggedIn(false);
      message.success('退出登录成功');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // 即使API调用失败，也清除本地token
      clearToken();
      setIsLoggedIn(false);
      message.success('退出登录成功');
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-trophy text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">ReachTop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link text-sm ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              type="primary"
              icon={<MenuOutlined />}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700 shadow-sm"
              onClick={() => setMobileMenuVisible(true)}
            />
            
            {/* 登录状态下显示 */}
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                  <i className="fas fa-user-circle text-lg"></i>
                  <span className="hidden sm:inline">个人中心</span>
                </Link>
                <Button
                  type="text"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="btn-primary text-sm hidden sm:inline-block">退出</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-red-600 transition-colors">
                  <span className="btn-primary text-sm hidden sm:inline-block">登录</span>
                </Link>
                <Link to="/register" className="btn-primary text-sm hidden sm:inline-block">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-bars text-white text-xs"></i>
            </div>
            <span className="font-bold">导航菜单</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="responsive-drawer"
      >
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-between ${
                location.pathname === item.path 
                  ? 'bg-red-50 text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuVisible(false)}
            >
              <span>{item.label}</span>
              {location.pathname === item.path && <i className="fas fa-chevron-right text-xs"></i>}
            </Link>
          ))}
          <div className="pt-6 mt-4 border-t border-gray-100 px-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform border-0 cursor-pointer"
              >
                退出登录
              </button>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="flex items-center justify-center w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  立即注册
                </Link>
                <Link 
                  to="/login" 
                  className="block w-full mt-3 py-3 text-gray-500 text-center font-medium hover:text-red-600"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  已有账号？去登录
                </Link>
              </>
            )}
          </div>
        </nav>
      </Drawer>
    </header>
  );
}

export default Header;