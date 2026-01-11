import React, { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';

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

function AppContent() {
  const navigate = useNavigate();

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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/exam/:examId" element={<ExamContent />} />
      <Route path="/*" element={
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
      } />
    </Routes>
  );
}

function App() {
  return <AppContent />;
}

export default App;
