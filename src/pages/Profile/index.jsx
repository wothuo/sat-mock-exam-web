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
import { Avatar, Button, Card, Col, Progress, Row, Space, Statistic, Tabs, Tag } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Profile() {
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
          <Link to="/practice-record">
            <Button type="link">查看全部记录 →</Button>
          </Link>
        </div>
      </Card>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
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
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <Card title={<span className="font-bold">成就徽章</span>}>
        <Row gutter={[16, 16]}>
          {(userRole === 'student' ? achievements : teacherAchievements).map((achievement) => (
            <Col xs={12} sm={8} md={6} key={achievement.id}>
              <div className={`text-center p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}>
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{achievement.name}</div>
                <div className="text-xs text-gray-600">{achievement.desc}</div>
                {achievement.unlocked && (
                  <Tag color="gold" className="mt-2">已解锁</Tag>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card title={<span className="font-bold">个人信息</span>}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">用户名</span>
            <span className="font-medium">{userData.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">角色</span>
            <Tag color={userRole === 'student' ? 'blue' : 'green'}>{userData.role}</Tag>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">等级</span>
            <span className="font-medium">{userData.level}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">加入时间</span>
            <span className="font-medium">{userData.joinDate}</span>
          </div>
        </div>
        <div className="mt-6">
          <Button type="primary" icon={<EditOutlined />} block className="bg-red-600">
            编辑个人信息
          </Button>
        </div>
      </Card>

      <Card title={<span className="font-bold">账号设置</span>}>
        <div className="space-y-3">
          <Button block className="text-left">修改密码</Button>
          <Button block className="text-left">通知设置</Button>
          <Button block className="text-left">隐私设置</Button>
          <Button block className="text-left">学习偏好</Button>
        </div>
      </Card>

      {/* 角色切换（仅用于演示） */}
      <Card title={<span className="font-bold">角色切换（演示）</span>}>
        <Space>
          <Button 
            type={userRole === 'student' ? 'primary' : 'default'}
            onClick={() => setUserRole('student')}
          >
            学生视角
          </Button>
          <Button 
            type={userRole === 'teacher' ? 'primary' : 'default'}
            onClick={() => setUserRole('teacher')}
          >
            教师视角
          </Button>
        </Space>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <LineChartOutlined />
          概览
        </span>
      ),
      children: renderOverview()
    },
    ...(userRole === 'student' ? [{
      key: 'goals',
      label: (
        <span>
          <BulbOutlined />
          学习目标
        </span>
      ),
      children: renderGoals()
    }] : []),
    {
      key: 'achievements',
      label: (
        <span>
          <TrophyOutlined />
          成就
        </span>
      ),
      children: renderAchievements()
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          设置
        </span>
      ),
      children: renderSettings()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar size={120} src={userData.avatar} icon={<UserOutlined />} />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                <Tag color={userRole === 'student' ? 'blue' : 'green'} className="text-sm">
                  {userData.role}
                </Tag>
                <Tag color="gold" className="text-sm">
                  {userData.level}
                </Tag>
              </div>
              <p className="text-gray-600 mb-4">
                {userRole === 'student' 
                  ? `已学习 ${userData.totalStudyDays} 天 · 完成 ${userData.completedExams} 套模考 · 正确率 ${userData.correctRate}%`
                  : `教学 ${teacherData.teachingYears} 年 · ${teacherData.totalStudents} 名学生 · ${teacherData.totalClasses} 个班级`
                }
              </p>
              <Space>
                <Link to="/mock-exam">
                  <Button type="primary" icon={<TrophyOutlined />} className="bg-red-600">
                    {userRole === 'student' ? '开始模考' : '创建套题'}
                  </Button>
                </Link>
                <Link to={userRole === 'student' ? '/special-training' : '/question-bank'}>
                  <Button icon={<BookOutlined />}>
                    {userRole === 'student' ? '专项训练' : '题库管理'}
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        </Card>

        {/* 标签页内容 */}
        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </Card>
      </div>
    </div>
  );
}

export default Profile;
