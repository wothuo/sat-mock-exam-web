import React, { useEffect } from 'react';

import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Courses from './pages/Courses';
import Encyclopedia from './pages/Encyclopedia';
import ExamContent from './pages/ExamContent';
import ExamSetManagement from './pages/ExamSetManagement';
import ExamSetEntry from './pages/ExamSetManagement/ExamSetEntry';
import Home from './pages/Home';
import MockExam from './pages/MockExam';
import PracticeRecord from './pages/PracticeRecord';
import Profile from './pages/Profile';
import QuestionBank from './pages/QuestionBank';
import SpecialTraining from './pages/SpecialTraining';
import SystemOverview from './pages/SystemOverview';
import { getRouteNavigateEventName } from './utils/router';
import { getToken, isTokenExpired } from './utils/token';

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

    return () => {
      window.removeEventListener(eventName, handleRouteNavigate);
    };
  }, [navigate]);

  // 检查是否需要认证
  const requiresAuth = (path) => {
    // 登录和注册页面不需要认证
    const publicPaths = ['/login', '/register'];
    return !publicPaths.includes(path);
  };

  // 受保护的路由组件
  const ProtectedRoute = ({ children }) => {
    const token = getToken();
    const isExpired = isTokenExpired();
    
    // 如果没有token或者token过期，重定向到登录页面
    if (!token || isExpired) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/exam/:examId" element={<ProtectedRoute><ExamContent /></ProtectedRoute>} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/special-training" element={<SpecialTraining />} />
              <Route path="/mock-exam" element={<MockExam />} />
                  <Route path="/practice-record" element={<PracticeRecord />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/encyclopedia" element={<Encyclopedia />} />
                  <Route path="/profile" element={<Profile />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/system-overview" element={<SystemOverview />} />
              <Route path="/exam-set-management" element={<ExamSetManagement />} />
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