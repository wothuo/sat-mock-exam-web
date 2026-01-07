import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

function App() {
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

export default App;
