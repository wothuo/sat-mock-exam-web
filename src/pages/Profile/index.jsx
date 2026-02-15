import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Avatar, Button, Card, Col, Progress, Row, Space, Statistic, Tabs, Tag } from 'antd';

import {
  BookOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  FireOutlined,
  LineChartOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';

function ProfileContent() {
  const [userRole, setUserRole] = useState('student'); // 'student' | 'teacher'
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟用户数据
  const userData = {
    name: '张同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: userRole === 'student' ? '学生' : '教师',
    level: userRole === 'student' ? 'Level 5' : '高级教师',
    joinDate: '2024-01-15',
    totalStudyDays: 45,
    continuousStudyDays: 12,
    totalScore: 1350,
    targetScore: 1500,
    completedExams: 23,
    totalQuestions: 1250,
    correctRate: 78,
    studyTime: 156 // 小时
  };

  // 教师专属数据
  const teacherData = {
    totalStudents: 156,
    totalClasses: 8,
    totalQuestions: 450,
    totalExamSets: 32,
    avgStudentScore: 1280,
    teachingYears: 5
  };

  // 学生最近学习记录
  const recentStudyRecords = [
    { id: 1, type: '套题模考', title: '2025年12月北美第4套', score: 1380, date: '2024-01-20', duration: '70分钟' },
    { id: 2, type: '专项训练', title: '数学-二次函数专项', score: 85, date: '2024-01-19', duration: '35分钟' },
    { id: 3, type: '套题模考', title: '2025年12月北美第3套', score: 1320, date: '2024-01-18', duration: '65分钟' }
  ];

  // 教师最近活动
  const teacherRecentActivities = [
    { id: 1, type: '创建题目', title: '添加了20道数学题目', date: '2024-01-20' },
    { id: 2, type: '创建套题', title: '创建了"2025年1月模拟卷"', date: '2024-01-19' },
    { id: 3, type: '批改作业', title: '批改了8班的模考试卷', date: '2024-01-18' }
  ];

  // 学习目标
  const studyGoals = [
    { id: 1, title: '完成30套模考', current: 23, target: 30, color: 'blue' },
    { id: 2, title: '数学专项突破', current: 78, target: 90, color: 'green' },
    { id: 3, title: '连续学习30天', current: 12, target: 30, color: 'orange' }
  ];

  // 成就徽章
  const achievements = [
    { id: 1, name: '初出茅庐', icon: '🎯', unlocked: true, desc: '完成首次模考' },
    { id: 2, name: '勤奋学习', icon: '📚', unlocked: true, desc: '连续学习7天' },
    { id: 3, name: '百题达人', icon: '💯', unlocked: true, desc: '完成100道题目' },
    { id: 4, name: '高分突破', icon: '🏆', unlocked: false, desc: '模考达到1400分' },
    { id: 5, name: '学习之星', icon: '⭐', unlocked: false, desc: '连续学习30天' },
    { id: 6, name: '全能选手', icon: '🎓', unlocked: false, desc: '各科均分85+' }
  ];

  // 教师成就
  const teacherAchievements = [
    { id: 1, name: '优秀教师', icon: '👨‍🏫', unlocked: true, desc: '学生平均分1200+' },
    { id: 2, name: '题库贡献者', icon: '📝', unlocked: true, desc: '创建100+题目' },
    { id: 3, name: '金牌导师', icon: '🥇', unlocked: false, desc: '培养10名1400+学生' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 核心数据卡片 */}
      <Row gutter={[16, 16]}>
        {userRole === 'student' ? (
          <>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="总学习天数"
                  value={userData.totalStudyDays}
                  suffix="天"
                  prefix={<CalendarOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="连续学习"
                  value={userData.continuousStudyDays}
                  suffix="天"
                  prefix={<FireOutlined className="text-red-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="完成模考"
                  value={userData.completedExams}
                  suffix="套"
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="正确率"
                  value={userData.correctRate}
                  suffix="%"
                  prefix={<TrophyOutlined className="text-yellow-500" />}
                />
              </Card>
            </Col>
          </>
        ) : (
          <>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="学生总数"
                  value={teacherData.totalStudents}
                  suffix="人"
                  prefix={<TeamOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="班级数量"
                  value={teacherData.totalClasses}
                  suffix="个"
                  prefix={<BookOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="创建题目"
                  value={teacherData.totalQuestions}
                  suffix="道"
                  prefix={<FileTextOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="创建套题"
                  value={teacherData.totalExamSets}
                  suffix="套"
                  prefix={<TrophyOutlined className="text-yellow-500" />}
                />
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* 学习进度 / 教学概览 */}
      {userRole === 'student' ? (
        <Card title={<span className="font-bold">学习进度</span>}>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">目标分数进度</span>
                <span className="font-bold text-red-600">{userData.totalScore} / {userData.targetScore}</span>
              </div>
              <Progress 
                percent={Math.round((userData.totalScore / userData.targetScore) * 100)} 
                strokeColor="#ef4444"
                status="active"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">题目完成度</span>
                <span className="font-bold text-blue-600">{userData.totalQuestions} 题</span>
              </div>
              <Progress 
                percent={userData.correctRate} 
                strokeColor="#3b82f6"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">学习时长</span>
                <span className="font-bold text-green-600">{userData.studyTime} 小时</span>
              </div>
              <Progress 
                percent={Math.min((userData.studyTime / 200) * 100, 100)} 
                strokeColor="#10b981"
              />
            </div>
          </div>
        </Card>
      ) : (
        <Card title={<span className="font-bold">教学概览</span>}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{teacherData.avgStudentScore}</div>
                <div className="text-sm text-gray-600 mt-1">学生平均分</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{teacherData.teachingYears}</div>
                <div className="text-sm text-gray-600 mt-1">教学年限</div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 最近活动 */}
      <Card title={<span className="font-bold">{userRole === 'student' ? '最近学习记录' : '最近活动'}</span>}>
        <div className="space-y-4">
          {(userRole === 'student' ? recentStudyRecords : teacherRecentActivities).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Tag color="blue">{record.type}</Tag>
                  <span className="font-medium text-gray-900">{record.title}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {record.date}
                  {record.duration && ` · ${record.duration}`}
                </div>
              </div>
              {record.score && (
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-red-600">{record.score}</div>
                  <div className="text-xs text-gray-500">分数</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/record">
            <Button type="link">查看全部记录 →</Button>
          </Link>
        </div>
      </Card>
    </div>
  );

  const renderStudyRecords = () => (
    <div className="space-y-6">
      <Card title={<span className="font-bold">{userRole === 'student' ? '最近学习记录' : '最近活动'}</span>}>
        <div className="space-y-4">
          {(userRole === 'student' ? recentStudyRecords : teacherRecentActivities).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Tag color="blue">{record.type}</Tag>
                  <span className="font-medium text-gray-900">{record.title}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {record.date}
                  {record.duration && ` · ${record.duration}`}
                </div>
              </div>
              {record.score && (
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-red-600">{record.score}</div>
                  <div className="text-xs text-gray-500">分数</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/record">
            <Button type="link">查看全部记录 →</Button>
          </Link>
        </div>
      </Card>

      {userRole === 'student' && renderGoals()}
    </div>
  );

  const renderGoals = () => (
    <Card title={<span className="font-bold">学习目标</span>}>
      <div className="space-y-6">
        {studyGoals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-900">{goal.title}</span>
              <span className="text-sm text-gray-600">{goal.current} / {goal.target}</span>
            </div>
            <Progress 
              percent={Math.round((goal.current / goal.target) * 100)} 
              strokeColor={goal.color === 'blue' ? '#3b82f6' : goal.color === 'green' ? '#10b981' : '#f59e0b'}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button type="primary" className="bg-red-600">设置新目标</Button>
      </div>
    </Card>
  );

  const renderAchievements = () => (
    <Card title="成就徽章" className="shadow-sm">
      <Row gutter={[24, 24]}>
        {(userRole === 'student' ? achievements : teacherAchievements).map(achievement => (
          <Col xs={12} sm={8} md={4} key={achievement.id} className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100 grayscale'}`}>
              {achievement.icon}
            </div>
            <div className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>{achievement.name}</div>
            <div className="text-xs text-gray-400 mt-1">{achievement.desc}</div>
          </Col>
        ))}
      </Row>
    </Card>
  );

  return (
    <>
      {/* 顶部个人信息卡片 */}
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <Avatar size={100} src={userData.avatar} icon={<UserOutlined />} />
            <Tag color="gold" className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full border-none shadow-sm">
              {userData.level}
            </Tag>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
              <h1 className="text-2xl font-bold m-0">{userData.name}</h1>
              <Tag color={userRole === 'student' ? 'blue' : 'green'}>{userData.role}</Tag>
            </div>
            <p className="text-gray-500 mb-4">加入时间：{userData.joinDate}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button type="primary" icon={<EditOutlined />}>编辑资料</Button>
              <Button icon={<SettingOutlined />}>账号设置</Button>
              <Button 
                type="dashed" 
                icon={userRole === 'student' ? <TeamOutlined /> : <UserOutlined />}
                onClick={() => setUserRole(userRole === 'student' ? 'teacher' : 'student')}
              >
                切换角色 (演示)
              </Button>
            </div>
          </div>

          <div className="flex gap-8 text-center px-6 py-2 border-l border-gray-100">
            <div>
              <div className="text-2xl font-bold text-blue-600">{userRole === 'student' ? userData.totalStudyDays : teacherData.teachingYears}</div>
              <div className="text-gray-500 text-sm">{userRole === 'student' ? '学习天数' : '教龄(年)'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{userRole === 'student' ? userData.totalScore : teacherData.totalStudents}</div>
              <div className="text-gray-500 text-sm">{userRole === 'student' ? '最高分' : '学生数'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{userRole === 'student' ? userData.completedExams : teacherData.totalClasses}</div>
              <div className="text-gray-500 text-sm">{userRole === 'student' ? '模考次数' : '班级数'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 主要内容区 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        type="card"
        className="bg-white p-4 rounded-lg shadow-sm"
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <LineChartOutlined />
                总览
              </span>
            ),
            children: renderOverview(),
          },
          {
            key: 'study-records',
            label: (
              <span>
                <ClockCircleOutlined />
                {userRole === 'student' ? '学习记录' : '教学动态'}
              </span>
            ),
            children: renderStudyRecords(),
          },
          {
            key: 'achievements',
            label: (
              <span>
                <TrophyOutlined />
                {userRole === 'student' ? '成就' : '荣誉'}
              </span>
            ),
            children: renderAchievements(),
          },
          {
            key: 'collection',
            label: (
              <span>
                <BookOutlined />
                {userRole === 'student' ? '错题本' : '题库'}
              </span>
            ),
            children: <div className="p-8 text-center text-gray-500">功能开发中...</div>,
          },
        ]}
      />
    </>
  );
}

// 封装后的 Profile 页面，包含遮罩层
function Profile() {
  return (
    <div className="relative">
      {/* 模糊遮罩层 */}
      <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center rounded-lg">
        <div className="bg-white/80 p-8 rounded-full shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-600">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">功能暂未开放</h2>
        <p className="text-gray-600">该功能正在开发中，敬请期待下一期更新</p>
      </div>

      {/* 原有内容，将被遮罩覆盖 */}
      <div className="space-y-6 pointer-events-none select-none opacity-50" aria-hidden="true">
        <ProfileContent />
      </div>
    </div>
  );
}

export default Profile;
