import React, { useEffect } from 'react';

import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Courses from './pages/Courses';
import Encyclopedia from './pages/Encyclopedia';
import ExamContent from './pages/ExamContent';
import ExamSetManagement from './pages/ExamSetManagement';
import ExamSetEntry from './pages/ExamSetEntry';
import Home from './pages/Home';
import MockExam from './pages/Exam';
import PracticeRecord from './pages/Records';
import Profile from './pages/Profile/studentIndex';
import TeacherProfile from './pages/Profile/teacherIndex';
// import QuestionBank from './pages/QuestionBank';
import SpecialTraining from './pages/Practice';
import SystemOverview from './pages/SystemOverview';
import TimeModeScreen from './pages/ExamContent/components/screens/TimeModeScreen';
import { getRouteNavigateEventName } from './utils/router';
import { getToken, isTokenExpired, startSessionHeartbeat, addSessionConflictListener, clearSessionConflict, isSessionValid } from './utils/token';
import { message } from 'antd';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 监听路由导航事件，用于在非React组件中进行路由跳转
    const handleRouteNavigate = (event) => {
      const { path, replace = false } = event.detail;
      if (path) {
        if (replace) {
          navigate(path, { replace: true });
        } else {
          navigate(path);
        }
      }
    };

    const eventName = getRouteNavigateEventName();
    window.addEventListener(eventName, handleRouteNavigate);

    // 启动会话心跳机制
    const stopHeartbeat = startSessionHeartbeat(30000); // 每30秒检查一次

    // 添加会话冲突监听器
    const handleSessionConflict = () => {
      // 只有当当前路径不是登录页面时，才处理会话冲突
      const currentPath = window.location.pathname;
      // @ts-ignore
      if (currentPath !== '/login' && !currentPath.endsWith('/login')) {
        message.error('您的账号已在其他设备登录，将被强制退出');
        navigate('/login', { state: { sessionConflict: true } });
      }
    };
    addSessionConflictListener(handleSessionConflict);
    
    // 清除可能存在的会话冲突标记
    clearSessionConflict();

    return () => {
      window.removeEventListener(eventName, handleRouteNavigate);
      stopHeartbeat(); // 清理心跳
      // 移除监听器（注：实际实现需要添加移除方法）
    };
  }, [navigate]);

  // 处理会话冲突的路由重定向
  useEffect(() => {
    if (location.state?.sessionConflict) {
      clearSessionConflict();
    }
  }, [location]);

  // 检查是否需要认证
  const requiresAuth = (path) => {
    // 登录和注册页面不需要认证
    const publicPaths = ['/login', '/register'];
    return publicPaths.indexOf(path) === -1;
  };

  // 受保护的路由组件
  const ProtectedRoute = ({ children }) => {
    const isSessionValidResult = isSessionValid();
    const hasToken = !!getToken();
    
    // 如果会话无效，重定向到登录页面
    if (!isSessionValidResult) {
      // 只有当有token但会话无效时，才表示会话冲突
      // 没有token时只是未登录，不是会话冲突
      const sessionConflict = hasToken && !isSessionValidResult;
      return <Navigate to="/login" replace state={{ from: location, sessionConflict }} />;
    }
    
    return children;
  };

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exam/:examId" element={<ProtectedRoute children={undefined}><ExamContent /></ProtectedRoute>} />
        <Route path="/practicing" element={<ProtectedRoute children={undefined}><ExamContent /></ProtectedRoute>} />
        <Route path="/time-mode" element={<ProtectedRoute children={undefined}><TimeModeScreen timeMode="timed" setTimeMode={() => {}} /></ProtectedRoute>} />

        {/* 公开的主页路由 */}
        <Route path="/" element={<Layout children={undefined}><Home /></Layout>} />

        {/* 受保护的其他功能路由 */}
        <Route path="/*" element={
          <ProtectedRoute children={undefined}>
            <Layout children={undefined}>
              <Routes>
                <Route path="/practice" element={<SpecialTraining />} />
                <Route path="/exam" element={<MockExam />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/encyclopedia" element={<Encyclopedia />} />
                <Route path="/record" element={<ProtectedRoute children={undefined}><PracticeRecord /></ProtectedRoute>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/t-profile" element={<TeacherProfile />} />
                <Route path="/system-overview" element={<SystemOverview />} />
                <Route path="/management" element={<ExamSetManagement />} />
                <Route path="/exam-set-entry" element={<ExamSetEntry />} />
                <Route path="/exam-set-entry/:id" element={<ExamSetEntry />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>

  );
}

function App() {
  return <AppContent />;
}

export default App;