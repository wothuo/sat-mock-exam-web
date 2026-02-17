import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
    Card, Row, Col, Avatar, Button, Progress, Tag, Tooltip, List, Statistic, Empty, Divider, Badge, Timeline, Table, Select, Modal, Form, Input
} from 'antd';

import {
    UserOutlined, TrophyOutlined, BookOutlined,
    FireOutlined, StarOutlined, EditOutlined, SettingOutlined,
    CheckCircleOutlined, RocketOutlined, LogoutOutlined,
    DashboardOutlined, BarChartOutlined, GiftOutlined,
    ThunderboltOutlined, RiseOutlined, ClockCircleOutlined,
    RightOutlined, TeamOutlined, FileTextOutlined,
    ScheduleOutlined, HistoryOutlined, AimOutlined,
    CrownOutlined, SafetyCertificateOutlined, BellOutlined,
    PlusOutlined, LineChartOutlined, BulbOutlined
} from '@ant-design/icons';

function TeacherProfile() {
    const [activeTab, setActiveTab] = useState('overview');
    const [greeting, setGreeting] = useState('你好');

    const teacherData = {
        name: '李老师',
        role: '教师',
        level: '高级教师',
        title: 'SAT 金牌讲师',
        stats: {
            students: 156,
            classes: 8,
            questions: 450,
            examSets: 32
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好');
    }, []);

    // 侧边栏组件
    const Sidebar = () => (
        <div className="space-y-6">
            {/* 个人卡片 */}
            <Card bordered={false} className="shadow-sm rounded-2xl overflow-hidden text-center hover:shadow-md transition-shadow">
                <div className="pt-8 pb-6 px-6">
                    <div className="relative inline-block mb-4 group">
                        <div className="absolute inset-0 bg-[#DC2626] rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                        <div className="relative z-10 w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#DC2626] via-[#EF4444] to-[#B91C1C] p-[3px] shadow-xl shadow-[#DC2626]/30 group-hover:shadow-2xl group-hover:shadow-[#DC2626]/40 transition-all duration-300">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] flex items-center justify-center">
                                    <UserOutlined className="text-[#DC2626] text-[36px] group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white text-[10px] px-2.5 py-1 rounded-full border-[3px] border-white font-bold shadow-lg z-20 group-hover:scale-110 transition-transform duration-300">
                            {teacherData.level}
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mb-1">{teacherData.name}</h2>
                    <p className="text-xs text-gray-500 mb-6 bg-gray-50 inline-block px-3 py-1 rounded-full">{teacherData.title}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-gray-50 rounded-xl p-2 cursor-default hover:bg-gray-100 transition-colors">
                            <div className="text-base font-bold text-gray-800">{teacherData.stats.students}</div>
                            <div className="text-[10px] text-gray-400">学生数</div>
                        </div>
                        <div className="bg-[#FEF2F2] rounded-xl p-2 cursor-default hover:bg-[#FEE2E2] transition-colors">
                            <div className="text-base font-bold text-[#DC2626]">{teacherData.stats.classes}</div>
                            <div className="text-[10px] text-[#DC2626]/60">班级数</div>
                        </div>
                    </div>

                    <Link to="/question-bank">
                        <Button type="primary" block shape="round" size="large" icon={<PlusOutlined />} className="bg-[#DC2626] hover:bg-[#B91C1C] border-0 h-10 font-medium shadow-md shadow-[#DC2626]/20">
                            创建新题目
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* 菜单 */}
            <Card bordered={false} className="shadow-sm rounded-2xl" bodyStyle={{ padding: '8px' }}>
                {[
                    { key: 'overview', icon: <DashboardOutlined />, label: '教学概览' },
                    { key: 'students', icon: <TeamOutlined />, label: '学生管理' },
                    { key: 'classes', icon: <BookOutlined />, label: '班级管理' },
                    { key: 'questions', icon: <FileTextOutlined />, label: '题库统计' },
                ].map(item => (
                    <div
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 group ${
                            activeTab === item.key
                                ? 'bg-[#DC2626] text-white font-medium shadow-md shadow-[#DC2626]/30'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <span className={`mr-3 text-lg transition-transform group-hover:scale-110 ${activeTab === item.key ? 'text-white' : 'text-gray-400'}`}>{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                        {activeTab === item.key && <RightOutlined className="ml-auto text-[10px] opacity-60" />}
                    </div>
                ))}
                <Divider className="my-2" />
                <div className="px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">账户管理</div>
                <div
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all ${
                        activeTab === 'settings' ? 'bg-[#DC2626] text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <span className={`mr-3 text-lg ${activeTab === 'settings' ? 'text-white' : 'text-gray-400'}`}><SettingOutlined /></span>
                    <span className="text-sm">账户设置</span>
                </div>
                <div className="flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-500 hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-all">
                    <span className="mr-3 text-lg text-gray-400"><LogoutOutlined /></span>
                    <span className="text-sm">退出登录</span>
                </div>
            </Card>
        </div>
    );

    // 教学概览
    const renderOverview = () => (
        <div className="space-y-6 animate-fade-in">
            {/* 欢迎 Banner */}
            <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2 flex items-center">
                        {greeting}，{teacherData.name} <span className="text-2xl ml-2">👨‍🏫</span>
                    </h1>
                    <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                        今日有 <span className="text-white font-bold">3</span> 个班级的作业待批改，
                        <span className="text-white font-bold">12</span> 名学生提交了新的练习记录。
                        继续保持优秀的教学质量！
                    </p>
                </div>
            </div>

            {/* 核心数据 */}
            <Row gutter={[12, 12]}>
                {[
                    { title: '学生总数', value: 156, unit: '人', icon: <TeamOutlined />, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', trend: '+8 本月' },
                    { title: '班级数量', value: 8, unit: '个', icon: <BookOutlined />, color: 'text-[#EA580C]', bg: 'bg-[#FFF7ED]', trend: '+1 新增' },
                    { title: '创建题目', value: 450, unit: '道', icon: <FileTextOutlined />, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', trend: '+25 本周' },
                    { title: '创建套题', value: 32, unit: '套', icon: <TrophyOutlined />, color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', trend: '+2 本月' },
                ].map((item, i) => (
                    <Col xs={12} lg={6} key={i}>
                        <Card bordered={false} className="shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-xl cursor-default" bodyStyle={{ padding: '16px' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center text-base ${item.color}`}>
                                    {item.icon}
                                </div>
                                <Tag className="mr-0 border-0 bg-gray-50 text-gray-500 text-[10px] px-1.5 py-0">
                                    {item.trend}
                                </Tag>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-0.5 tracking-tight">
                                {item.value}<span className="text-xs text-gray-400 font-normal ml-1">{item.unit}</span>
                            </div>
                            <div className="text-xs text-gray-400">{item.title}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* 学生成绩分布 */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span className="font-bold flex items-center gap-2"><BarChartOutlined className="text-[#DC2626]"/>学生成绩分布</span>}
                        bordered={false}
                        className="shadow-sm rounded-2xl"
                    >
                        <div className="space-y-4">
                            {[
                                { range: '1400-1600分', count: 28, percent: 18, color: '#10B981' },
                                { range: '1200-1400分', count: 65, percent: 42, color: '#3B82F6' },
                                { range: '1000-1200分', count: 48, percent: 31, color: '#F59E0B' },
                                { range: '1000分以下', count: 15, percent: 9, color: '#DC2626' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="font-medium">{item.range}</span>
                                        <span className="text-gray-500">{item.count}人 ({item.percent}%)</span>
                                    </div>
                                    <Progress percent={item.percent} strokeColor={item.color} showInfo={false} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* 最近活动 */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span className="font-bold flex items-center gap-2"><HistoryOutlined className="text-[#EA580C]"/>最近活动</span>}
                        bordered={false}
                        className="shadow-sm rounded-2xl"
                    >
                        <Timeline
                            items={[
                                {
                                    color: '#DC2626',
                                    dot: <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full border-2 border-white shadow-sm"></div>,
                                    children: (
                                        <div className="pb-4">
                                            <div className="font-medium text-gray-800 text-sm">创建新套题</div>
                                            <div className="text-xs text-gray-500 mt-1">2025年1月模拟卷 · 2小时前</div>
                                        </div>
                                    ),
                                },
                                {
                                    color: '#EA580C',
                                    dot: <div className="w-2.5 h-2.5 bg-[#EA580C] rounded-full border-2 border-white shadow-sm"></div>,
                                    children: (
                                        <div className="pb-4">
                                            <div className="font-medium text-gray-800 text-sm">批改作业</div>
                                            <div className="text-xs text-gray-500 mt-1">8班模考试卷 · 昨天 16:30</div>
                                        </div>
                                    ),
                                },
                                {
                                    color: '#10B981',
                                    dot: <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-white shadow-sm"></div>,
                                    children: (
                                        <div>
                                            <div className="font-medium text-gray-800 text-sm">添加题目</div>
                                            <div className="text-xs text-gray-500 mt-1">20道数学题目 · 3天前</div>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // 学生管理
    const renderStudents = () => (
        <div className="space-y-6 animate-fade-in">
            <Card bordered={false} className="shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">学生管理</h2>
                        <p className="text-sm text-gray-500">共 {teacherData.stats.students} 名学生</p>
                    </div>
                    <div className="flex gap-2">
                        <Select defaultValue="all" style={{ width: 120 }} size="large">
                            <Select.Option value="all">全部班级</Select.Option>
                            <Select.Option value="1">1班</Select.Option>
                            <Select.Option value="2">2班</Select.Option>
                        </Select>
                        <Button type="primary" icon={<PlusOutlined />} className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 shadow-md">添加学生</Button>
                    </div>
                </div>

                <Table
                    dataSource={[
                        { key: 1, name: '张同学', class: '1班', score: 1380, questions: 450, accuracy: '78%', lastActive: '2小时前' },
                        { key: 2, name: '李同学', class: '1班', score: 1420, questions: 520, accuracy: '82%', lastActive: '1天前' },
                        { key: 3, name: '王同学', class: '2班', score: 1250, questions: 380, accuracy: '72%', lastActive: '3小时前' },
                        { key: 4, name: '赵同学', class: '2班', score: 1350, questions: 410, accuracy: '75%', lastActive: '5小时前' },
                    ]}
                    columns={[
                        { title: '姓名', dataIndex: 'name', key: 'name', render: (text) => <span className="font-bold">{text}</span> },
                        { title: '班级', dataIndex: 'class', key: 'class' },
                        { title: '最高分', dataIndex: 'score', key: 'score', render: (val) => <span className="text-[#DC2626] font-bold">{val}</span> },
                        { title: '刷题量', dataIndex: 'questions', key: 'questions', render: (val) => `${val}道` },
                        { title: '正确率', dataIndex: 'accuracy', key: 'accuracy' },
                        { title: '最近活跃', dataIndex: 'lastActive', key: 'lastActive' },
                        {
                            title: '操作',
                            key: 'action',
                            render: () => (
                                <div className="flex gap-2">
                                    <Button type="link" size="small" className="text-[#DC2626]">查看详情</Button>
                                </div>
                            )
                        },
                    ]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );

    // 班级管理
    const renderClasses = () => (
        <div className="space-y-6 animate-fade-in">
            <Card bordered={false} className="shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">班级管理</h2>
                        <p className="text-sm text-gray-500">共 {teacherData.stats.classes} 个班级</p>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 shadow-md">创建班级</Button>
                </div>

                <Row gutter={[16, 16]}>
                    {[
                        { name: '1班', students: 25, avgScore: 1320, progress: 75, color: '#DC2626' },
                        { name: '2班', students: 22, avgScore: 1280, progress: 68, color: '#EA580C' },
                        { name: '3班', students: 28, avgScore: 1350, progress: 82, color: '#10B981' },
                        { name: '4班', students: 20, avgScore: 1290, progress: 70, color: '#3B82F6' },
                    ].map((cls, i) => (
                        <Col xs={24} sm={12} lg={6} key={i}>
                            <Card bordered={false} className="hover:shadow-lg transition-all cursor-pointer" bodyStyle={{ padding: '20px' }}>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-gray-800 text-lg">{cls.name}</h3>
                                    <Tag color={cls.color} className="border-0">{cls.students}人</Tag>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">平均分</span>
                                        <span className="font-bold" style={{ color: cls.color }}>{cls.avgScore}</span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>学习进度</span>
                                            <span>{cls.progress}%</span>
                                        </div>
                                        <Progress percent={cls.progress} strokeColor={cls.color} showInfo={false} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );

    // 题库统计
    const renderQuestions = () => (
        <div className="space-y-6 animate-fade-in">
            <Card bordered={false} className="shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">题库统计</h2>
                        <p className="text-sm text-gray-500">共创建 {teacherData.stats.questions} 道题目</p>
                    </div>
                    <Link to="/question-bank">
                        <Button type="primary" icon={<PlusOutlined />} className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 shadow-md">创建题目</Button>
                    </Link>
                </div>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { subject: '阅读', count: 180, color: '#DC2626' },
                                { subject: '语法', count: 150, color: '#EA580C' },
                                { subject: '数学', count: 120, color: '#10B981' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-center">
                                    <div className="text-4xl font-bold mb-2" style={{ color: item.color }}>{item.count}</div>
                                    <div className="text-sm text-gray-600">{item.subject}题目</div>
                                </div>
                            ))}
                        </div>
                    </Col>

                    <Col span={24}>
                        <Card title={<span className="font-bold">题目使用情况</span>} bordered={false}>
                            <Table
                                dataSource={[
                                    { key: 1, title: '阅读-词汇题专项', type: '阅读', count: 25, used: 180, avgScore: 78 },
                                    { key: 2, title: '语法-标点符号', type: '语法', count: 20, used: 150, avgScore: 72 },
                                    { key: 3, title: '数学-代数基础', type: '数学', count: 30, used: 220, avgScore: 85 },
                                ]}
                                columns={[
                                    { title: '题目集', dataIndex: 'title', key: 'title', render: (text) => <span className="font-bold">{text}</span> },
                                    { title: '科目', dataIndex: 'type', key: 'type' },
                                    { title: '题目数', dataIndex: 'count', key: 'count', render: (val) => `${val}道` },
                                    { title: '使用次数', dataIndex: 'used', key: 'used', render: (val) => <span className="text-[#DC2626] font-bold">{val}</span> },
                                    { title: '平均正确率', dataIndex: 'avgScore', key: 'avgScore', render: (val) => `${val}%` },
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );

    // 账户设置
    const renderSettings = () => (
        <div className="space-y-6 animate-fade-in">
            <Card bordered={false} className="shadow-sm rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6">账户设置</h2>

                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <UserOutlined className="text-[#DC2626]"/> 个人信息
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: '用户名', value: teacherData.name, editable: true },
                                { label: '角色', value: teacherData.role, editable: false },
                                { label: '职称', value: teacherData.level, editable: false },
                                { label: '教龄', value: '5年', editable: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                                    <span className="text-gray-600 font-medium">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-bold">{item.value}</span>
                                        {item.editable && <Button type="link" size="small" className="text-[#DC2626]">修改</Button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <TeamOutlined className="text-[#DC2626]"/> 账户角色切换
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/profile">
                                <div className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-[#DC2626] hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] text-xl">
                                            <UserOutlined />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">学生账户</div>
                                            <Tag className="border-0 bg-gray-100 text-gray-500 text-xs mt-1">可切换</Tag>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">访问学习记录、练习题目、模考等功能</p>
                                    <Button block type="primary" className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] border-0 rounded-lg h-8 text-xs font-medium">
                                        切换到学生
                                    </Button>
                                </div>
                            </Link>

                            <div className="p-4 bg-white rounded-xl border-2 border-[#DC2626] shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] text-xl">
                                        <TeamOutlined />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">教师账户</div>
                                        <Tag color="green" className="border-0 text-xs mt-1">当前角色</Tag>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">管理学生、创建题目、批改作业等功能</p>
                                <Button block disabled className="bg-gray-100 text-gray-400 border-0 rounded-lg h-8 text-xs">
                                    当前使用中
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <SafetyCertificateOutlined className="text-[#DC2626]"/> 安全设置
                        </h3>
                        <div className="space-y-3">
                            {[
                                { title: '修改密码', desc: '定期更换密码保护账户安全', icon: <SettingOutlined /> },
                                { title: '绑定邮箱', desc: '用于找回密码和接收通知', icon: <BellOutlined /> },
                                { title: '隐私设置', desc: '管理个人信息的可见范围', icon: <SafetyCertificateOutlined /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{item.title}</div>
                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                        </div>
                                    </div>
                                    <RightOutlined className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12 pt-6 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Row gutter={24}>
                    <Col xs={24} md={7} lg={6}>
                        <Sidebar />
                    </Col>
                    <Col xs={24} md={17} lg={18}>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'students' && renderStudents()}
                        {activeTab === 'classes' && renderClasses()}
                        {activeTab === 'questions' && renderQuestions()}
                        {activeTab === 'settings' && renderSettings()}
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default TeacherProfile;