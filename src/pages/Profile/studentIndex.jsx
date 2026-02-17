import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
  Card, Row, Col, Avatar, Button, Progress, Tag, Tooltip, List, Statistic, Empty, Divider, Badge, Timeline, Checkbox, Segmented, Modal, Input, Select, DatePicker, Form, Table
} from 'antd';

import {
  UserOutlined, TrophyOutlined, BookOutlined,
  FireOutlined, StarOutlined, EditOutlined, SettingOutlined,
  CheckCircleOutlined, RocketOutlined, LogoutOutlined,
  DashboardOutlined, BarChartOutlined, GiftOutlined,
  ThunderboltOutlined, RiseOutlined, ClockCircleOutlined,
  RightOutlined, BellOutlined, SafetyCertificateOutlined,
  ScheduleOutlined, HistoryOutlined, AimOutlined,
  CrownOutlined, EnvironmentOutlined, CoffeeOutlined,
  FallOutlined, CalendarOutlined, LineChartOutlined, BulbOutlined,
  DownloadOutlined, TeamOutlined
} from '@ant-design/icons';

// -----------------------------------------------------------------------------
// 高级雷达图组件 (SVG实现 - 红色主题版 #DC2626)
// -----------------------------------------------------------------------------
const AbilityRadar = ({ scores }) => {
  const size = 200;
  const center = size / 2;
  const radius = 65;

  const points = [
    { label: '阅读', value: scores.reading, angle: -90, color: '#DC2626' }, // 主红
    { label: '语法', value: scores.grammar, angle: 30, color: '#EA580C' }, // 橙色搭配
    { label: '数学', value: scores.math, angle: 150, color: '#BE185D' }, // 粉红搭配
  ];

  const getCoord = (r, angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const polyPoints = points.map(p => {
    const { x, y } = getCoord((p.value / 100) * radius, p.angle);
    return `${x},${y}`;
  }).join(' ');

  return (
      <div className="profile-container">

        <div className="relative flex flex-col items-center justify-center py-2">
          <svg width={size} height={size} className="overflow-visible">
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(220, 38, 38, 0.3)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0.05)" />
              </linearGradient>
            </defs>
            {/* 背景圆环 */}
            {[0.33, 0.66, 1].map((scale, i) => (
                <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius * scale}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            ))}

            {/* 轴线 */}
            {points.map((p, i) => {
              const { x, y } = getCoord(radius, p.angle);
              return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#f3f4f6" strokeWidth="1" />;
            })}

            {/* 数据区域 */}
            <polygon
                points={polyPoints}
                fill="url(#radarGradient)"
                stroke="#DC2626"
                strokeWidth="1.5"
                className="drop-shadow-sm transition-all duration-1000 ease-out"
            />

            {/* 数据点 */}
            {points.map((p, i) => {
              const { x, y } = getCoord((p.value / 100) * radius, p.angle);
              return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill="white" stroke={p.color} strokeWidth="2" />
                    <foreignObject x={x - 30} y={y + (p.angle === -90 ? -28 : 8)} width="60" height="40">
                      <div className={`text-center flex flex-col items-center ${p.angle === -90 ? '-mt-1' : ''}`}>
                        <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">{p.label}</span>
                        <span className="text-sm font-bold leading-none transition-all duration-1000" style={{ color: p.color }}>{p.value}</span>
                      </div>
                    </foreignObject>
                  </g>
              );
            })}
          </svg>
        </div>


      </div>
  );
};

// -----------------------------------------------------------------------------
// 简约热力图组件 (红色主题)
// -----------------------------------------------------------------------------
const HeatMap = () => {
  // 模拟数据
  const data = Array.from({ length: 70 }, () => Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0);

  return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap content-start gap-[3px]">
          {data.map((level, i) => (
              <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${
                      level === 0 ? 'bg-gray-100' :
                          level === 1 ? 'bg-[#FEE2E2]' :
                              level === 2 ? 'bg-[#FCA5A5]' :
                                  level === 3 ? 'bg-[#DC2626]' : 'bg-[#991B1B]'
                  }`}
              />
          ))}
        </div>
      </div>
  );
};

function Profile() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true); // 控制遮挡层显示
  const [activeTab, setActiveTab] = useState('overview');
  const [greeting, setGreeting] = useState('你好');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const userData = {
    name: 'XX同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: '学生',
    level: 'Lv.5',
    title: '进击的学霸',
    stats: {
      days: 45,
      streak: 12,
      score: 1350,
      target: 1500,
      rank: 128
    }
  };

  const subjectScores = { reading: 82, grammar: 75, math: 92 };

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
                {userData.level}
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-1">{userData.name}</h2>
            <p className="text-xs text-gray-500 mb-6 bg-gray-50 inline-block px-3 py-1 rounded-full">{userData.title}</p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-gray-50 rounded-xl p-2 cursor-default hover:bg-gray-100 transition-colors">
                <div className="text-base font-bold text-gray-800">{userData.stats.days}</div>
                <div className="text-[10px] text-gray-400">天数</div>
              </div>
              <div className="bg-[#FEF2F2] rounded-xl p-2 cursor-default hover:bg-[#FEE2E2] transition-colors">
                <div className="text-base font-bold text-[#DC2626]">{userData.stats.streak}</div>
                <div className="text-[10px] text-[#DC2626]/60">连续</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-2 cursor-default hover:bg-gray-100 transition-colors">
                <div className="text-base font-bold text-gray-800">{userData.stats.rank}</div>
                <div className="text-[10px] text-gray-400">排名</div>
              </div>
            </div>

            <Link to="/mock-exam">
              <Button type="primary" block shape="round" size="large" icon={<RocketOutlined />} className="bg-[#DC2626] hover:bg-[#B91C1C] border-0 h-10 font-medium shadow-md shadow-[#DC2626]/20">
                开始今日学习
              </Button>
            </Link>
          </div>
        </Card>

        {/* 菜单 */}
        <Card bordered={false} className="shadow-sm rounded-2xl" bodyStyle={{ padding: '8px' }}>
          {[
            { key: 'overview', icon: <DashboardOutlined />, label: '仪表盘' },
            { key: 'analysis', icon: <BarChartOutlined />, label: '深度分析' },
            { key: 'plan', icon: <ScheduleOutlined />, label: '学习计划' },
            { key: 'achievements', icon: <GiftOutlined />, label: '成就中心' },
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
          <div
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'preferences' ? 'bg-[#DC2626] text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <span className={`mr-3 text-lg ${activeTab === 'preferences' ? 'text-white' : 'text-gray-400'}`}><BellOutlined /></span>
            <span className="text-sm">偏好设置</span>
          </div>
          <div className="flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-500 hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-all">
            <span className="mr-3 text-lg text-gray-400"><LogoutOutlined /></span>
            <span className="text-sm">退出登录</span>
          </div>
        </Card>

        {/* 升级 Pro 会员 */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-2xl p-4 text-white shadow-md relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="font-bold text-sm mb-1">升级 Pro 会员</div>
            <div className="text-xs text-white/80 mb-3">解锁所有真题解析和 AI 助教</div>
            <Button size="small" className="bg-white text-[#DC2626] border-0 h-7 text-xs font-bold rounded-lg hover:bg-gray-50">立即查看</Button>
          </div>
        </div>
      </div>
  );

  // 深度分析内容
  const renderAnalysis = () => (
      <div className="space-y-6 animate-fade-in">
        {/* 顶部概览卡片 */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '总学习时长', value: '520', unit: 'h', icon: <ClockCircleOutlined />, color: '#DC2626', bg: 'from-[#FEF2F2] to-[#FEE2E2]', trend: '+12h 本周' },
            { label: '刷题总量', value: '1250', unit: '道', icon: <EditOutlined />, color: '#EA580C', bg: 'from-[#FFF7ED] to-[#FFEDD5]', trend: '+45 本周' },
            { label: '平均正确率', value: '78.5', unit: '%', icon: <AimOutlined />, color: '#10B981', bg: 'from-[#ECFDF5] to-[#D1FAE5]', trend: '+2.3% 提升' },
            { label: '模考次数', value: '23', unit: '次', icon: <TrophyOutlined />, color: '#3B82F6', bg: 'from-[#EFF6FF] to-[#DBEAFE]', trend: '+3 本月' },
          ].map((item, i) => (
              <Card key={i} bordered={false} className={`shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-gradient-to-br ${item.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`} style={{ color: item.color, backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    {item.icon}
                  </div>
                  <Tag className="border-0 bg-white/80 text-gray-600 text-[10px]">{item.trend}</Tag>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1 tracking-tight">
                  {item.value}<span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                </div>
                <div className="text-xs text-gray-600 font-medium">{item.label}</div>
              </Card>
          ))}
        </div>

        {/* 学习趋势图表 */}
        <Card bordered={false} className="shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <LineChartOutlined className="text-[#DC2626]"/> 学习趋势分析
              </h3>
              <p className="text-xs text-gray-500">近30天学习数据统计</p>
            </div>
            <Segmented options={['本周', '本月', '本季度', '全年']} defaultValue="本月" />
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day}</div>
                  <div className={`h-32 rounded-xl flex flex-col justify-end p-2 transition-all hover:shadow-md cursor-pointer ${
                      i === 5 || i === 6 ? 'bg-gray-100' : 'bg-gradient-to-t from-[#DC2626] to-[#FCA5A5]'
                  }`} style={{ height: `${[80, 95, 70, 85, 90, 40, 50][i]}%` }}>
                    <div className={`text-xs font-bold ${i === 5 || i === 6 ? 'text-gray-400' : 'text-white'}`}>
                      {[2.5, 3.2, 2.1, 2.8, 3.0, 1.2, 1.5][i]}h
                    </div>
                  </div>
                </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {[
              { label: '日均学习', value: '2.3h', change: '+0.5h', up: true },
              { label: '最长连续', value: '12天', change: '当前记录', up: true },
              { label: '本周完成', value: '85%', change: '目标达成', up: true },
            ].map((stat, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className={`text-xs ${stat.up ? 'text-green-600' : 'text-gray-500'}`}>
                    {stat.up && <RiseOutlined className="mr-1" />}
                    {stat.change}
                  </div>
                </div>
            ))}
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {/* 科目能力分析 */}
          <Col xs={24} lg={12}>
            <Card
                title={
                  <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <BarChartOutlined className="text-[#DC2626]"/>
                  科目能力雷达
                </span>
                    <Button type="text" size="small" className="text-gray-400 hover:text-[#DC2626]" onClick={() => setReportModalVisible(true)}>
                      查看详情 <RightOutlined className="text-xs" />
                    </Button>
                  </div>
                }
                bordered={false}
                className="shadow-sm rounded-2xl h-full"
            >
              <AbilityRadar scores={subjectScores} />
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: '阅读', score: 82, color: '#DC2626' },
                  { label: '语法', score: 75, color: '#EA580C' },
                  { label: '数学', score: 92, color: '#10B981' },
                ].map((item, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold" style={{ color: item.color }}>{item.score}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* 错题分析 */}
          <Col xs={24} lg={12}>
            <Card
                title={
                  <span className="font-bold flex items-center gap-2">
                <ThunderboltOutlined className="text-[#EA580C]"/>
                错题分布分析
              </span>
                }
                bordered={false}
                className="shadow-sm rounded-2xl h-full"
            >
              <div className="space-y-4">
                {[
                  { subject: '阅读', count: 45, total: 450, types: ['词汇题', '主旨题', '细节题'], color: '#DC2626' },
                  { subject: '语法', count: 68, total: 380, types: ['标点符号', '句子结构', '修饰语'], color: '#EA580C' },
                  { subject: '数学', count: 23, total: 420, types: ['代数', '几何', '数据分析'], color: '#10B981' },
                ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="font-bold text-gray-800">{item.subject}</span>
                          <span className="text-xs text-gray-500 ml-2">{item.count}道错题 / {item.total}道总题</span>
                        </div>
                        <Tag color={item.color} className="border-0 font-bold">{Math.round((item.count / item.total) * 100)}%</Tag>
                      </div>
                      <Progress percent={Math.round((item.count / item.total) * 100)} strokeColor={item.color} showInfo={false} className="mb-2" />
                      <div className="flex gap-2">
                        {item.types.map((type, j) => (
                            <Tag key={j} className="text-xs border-0 bg-white text-gray-600">{type}</Tag>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* 学习效率分析 */}
          <Col xs={24} lg={12}>
            <Card
                title={
                  <span className="font-bold flex items-center gap-2">
                <RocketOutlined className="text-[#3B82F6]"/>
                学习效率分析
              </span>
                }
                bordered={false}
                className="shadow-sm rounded-2xl"
            >
              <div className="space-y-4">
                {[
                  { label: '平均答题速度', value: '1.2', unit: 'min/题', status: 'good', desc: '快于平均水平 15%' },
                  { label: '首次正确率', value: '76', unit: '%', status: 'normal', desc: '接近目标水平' },
                  { label: '复习巩固率', value: '85', unit: '%', status: 'good', desc: '错题复习效果良好' },
                  { label: '知识点掌握', value: '68', unit: '%', status: 'warning', desc: '部分知识点需加强' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 mb-1">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${
                            item.status === 'good' ? 'text-green-600' :
                                item.status === 'warning' ? 'text-orange-600' :
                                    'text-gray-800'
                        }`}>
                          {item.value}<span className="text-xs font-normal text-gray-500 ml-0.5">{item.unit}</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* AI 智能建议 */}
          <Col xs={24} lg={12}>
            <Card
                title={
                  <span className="font-bold flex items-center gap-2">
                <BulbOutlined className="text-[#F59E0B]"/>
                AI 智能建议
              </span>
                }
                bordered={false}
                className="shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="space-y-3">
                {[
                  {
                    priority: 'high',
                    icon: <FireOutlined />,
                    title: '语法专项突破',
                    desc: '标点符号错误率达 45%，建议每日完成 10 道专项练习',
                    action: '开始练习'
                  },
                  {
                    priority: 'medium',
                    icon: <RocketOutlined />,
                    title: '数学冲刺满分',
                    desc: '当前 92 分，距离满分仅差 8 分，建议挑战 Hard 难度题目',
                    action: '查看题目'
                  },
                  {
                    priority: 'low',
                    icon: <CheckCircleOutlined />,
                    title: '阅读速度提升',
                    desc: '平均阅读速度 1.5min/题，建议进行限时训练提高效率',
                    action: '开始训练'
                  },
                ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm hover:shadow-md transition-all ${
                        item.priority === 'high' ? 'border-red-500' :
                            item.priority === 'medium' ? 'border-orange-500' :
                                'border-blue-500'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl mt-0.5 ${
                            item.priority === 'high' ? 'text-red-500' :
                                item.priority === 'medium' ? 'text-orange-500' :
                                    'text-blue-500'
                        }`}>{item.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 mb-1 flex items-center justify-between">
                            <span>{item.title}</span>
                            <Tag className={`border-0 text-xs ${
                                item.priority === 'high' ? 'bg-red-100 text-red-600' :
                                    item.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                            }`}>
                              {item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级'}
                            </Tag>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 leading-relaxed">{item.desc}</p>
                          <Button size="small" type="link" className="text-[#DC2626] p-0 h-auto font-medium">
                            {item.action} <RightOutlined className="text-xs ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
  );

  // 学习计划内容
  const renderPlan = () => (
      <div className="space-y-6 animate-fade-in">
        <Card bordered={false} className="shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">我的学习计划</h2>
              <p className="text-sm text-gray-500">制定科学的学习计划，高效备考</p>
            </div>
            <Button type="primary" icon={<RocketOutlined />} className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 shadow-md" onClick={() => setGoalModalVisible(true)}>创建新计划</Button>
          </div>

          <Row gutter={[16, 16]}>
            {[
              { title: '冲刺1500分计划', progress: 65, days: 30, tasks: 12, completed: 8, color: '#DC2626', status: '进行中' },
              { title: '数学满分突破', progress: 80, days: 15, tasks: 8, completed: 6, color: '#EA580C', status: '进行中' },
              { title: '阅读速度提升', progress: 45, days: 20, tasks: 10, completed: 4, color: '#3B82F6', status: '进行中' },
            ].map((plan, i) => (
                <Col xs={24} lg={8} key={i}>
                  <Card bordered={false} className="hover:shadow-lg transition-all cursor-pointer h-full" bodyStyle={{ padding: '20px' }}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-800 text-base">{plan.title}</h3>
                      <Tag color={plan.color} className="border-0">{plan.status}</Tag>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>完成进度</span>
                        <span className="font-bold" style={{ color: plan.color }}>{plan.progress}%</span>
                      </div>
                      <Progress percent={plan.progress} strokeColor={plan.color} showInfo={false} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-800">{plan.days}</div>
                        <div className="text-xs text-gray-500">剩余天数</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-800">{plan.completed}/{plan.tasks}</div>
                        <div className="text-xs text-gray-500">任务完成</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold" style={{ color: plan.color }}>{Math.round(plan.completed / plan.tasks * 100)}%</div>
                        <div className="text-xs text-gray-500">达成率</div>
                      </div>
                    </div>
                  </Card>
                </Col>
            ))}
          </Row>
        </Card>
      </div>
  );

  // 成就中心内容
  const renderAchievements = () => (
      <div className="space-y-6 animate-fade-in">
        <Card bordered={false} className="shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">成就中心</h2>
              <p className="text-sm text-gray-500">已解锁 12 个成就，超越 85% 的用户</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" style={{ width: 120 }} size="large">
                <Select.Option value="all">全部成就</Select.Option>
                <Select.Option value="unlocked">已解锁</Select.Option>
                <Select.Option value="locked">未解锁</Select.Option>
              </Select>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            {[
              { name: '初出茅庐', desc: '完成首次模考', icon: <TrophyOutlined />, color: '#DC2626', unlocked: true, date: '2024-01-15' },
              { name: '勤奋学习', desc: '连续学习7天', icon: <FireOutlined />, color: '#EA580C', unlocked: true, date: '2024-01-20' },
              { name: '百题达人', desc: '完成100道题目', icon: <CheckCircleOutlined />, color: '#10B981', unlocked: true, date: '2024-01-25' },
              { name: '高分突破', desc: '模考达到1400分', icon: <RocketOutlined />, color: '#3B82F6', unlocked: false },
              { name: '学习之星', desc: '连续学习30天', icon: <StarOutlined />, color: '#F59E0B', unlocked: false },
              { name: '全能选手', desc: '���科均分85+', icon: <CrownOutlined />, color: '#8B5CF6', unlocked: false },
            ].map((achievement, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <Card
                      bordered={false}
                      className={`hover:shadow-lg transition-all cursor-pointer h-full ${achievement.unlocked ? '' : 'opacity-60'}`}
                      bodyStyle={{ padding: '24px' }}
                  >
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${
                          achievement.unlocked
                              ? 'bg-gradient-to-br from-[#FFF7ED] to-[#FEF2F2] border-2 border-[#FED7AA]'
                              : 'bg-gray-100 border-2 border-gray-200'
                      }`} style={achievement.unlocked ? { color: achievement.color } : {}}>
                        {achievement.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{achievement.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{achievement.desc}</p>
                      {achievement.unlocked ? (
                          <Tag color="green" className="border-0">✓ 已解锁 · {achievement.date}</Tag>
                      ) : (
                          <Tag className="border-0 bg-gray-100 text-gray-500">🔒 未解锁</Tag>
                      )}
                    </div>
                  </Card>
                </Col>
            ))}
          </Row>
        </Card>
      </div>
  );

  // 账户管理内容
  const renderSettings = () => (
      <div className="space-y-6 animate-fade-in">
        <Card bordered={false} className="shadow-sm rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">账户管理</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserOutlined className="text-[#DC2626]"/> 个人信息
              </h3>
              <div className="space-y-4">
                {[
                  { label: '用户名', value: userData.name, editable: true },
                  { label: '角色', value: userData.role, editable: false },
                  { label: '等级', value: userData.level, editable: false },
                  { label: '加入时间', value: '2024-01-15', editable: false },
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

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TeamOutlined className="text-[#DC2626]"/> 账户角色切换
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border-2 border-[#DC2626] shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] text-xl">
                      <UserOutlined />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">学生账户</div>
                      <Tag color="green" className="border-0 text-xs mt-1">当前角色</Tag>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">访问学习记录、练习题目、模考等功能</p>
                  <Button block disabled className="bg-gray-100 text-gray-400 border-0 rounded-lg h-8 text-xs">
                    当前使用中
                  </Button>
                </div>

                <Link to="/t-profile">
                  <div className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-[#DC2626] hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] text-xl">
                        <TeamOutlined />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">教师账户</div>
                        <Tag className="border-0 bg-gray-100 text-gray-500 text-xs mt-1">可切换</Tag>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">管理学生、创建题目、批改作业等功能</p>
                    <Button block type="primary" className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] border-0 rounded-lg h-8 text-xs font-medium">
                      切换到教师
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
  );

  // 偏好设置内容
  const renderPreferences = () => (
      <div className="space-y-6 animate-fade-in">
        <Card bordered={false} className="shadow-sm rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">偏好设置</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BellOutlined className="text-[#DC2626]"/> 通知设置
              </h3>
              <div className="space-y-4">
                {[
                  { label: '学习提醒', desc: '每日学习计划提醒', checked: true },
                  { label: '成就通知', desc: '解锁新成就时通知', checked: true },
                  { label: '系统消息', desc: '接收系统更新和公告', checked: false },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl">
                      <div>
                        <div className="font-bold text-gray-800 text-sm mb-1">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <Checkbox defaultChecked={item.checked} />
                    </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SettingOutlined className="text-[#DC2626]"/> 学习偏好
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl">
                  <div className="font-bold text-gray-800 text-sm mb-3">默认练习模式</div>
                  <Segmented
                      options={['随时查看', '做完再看', '考试模式']}
                      block
                      size="large"
                  />
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <div className="font-bold text-gray-800 text-sm mb-3">题目难度偏好</div>
                  <Segmented
                      options={['随机', 'Easy', 'Medium', 'Hard']}
                      block
                      size="large"
                  />
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <div className="font-bold text-gray-800 text-sm mb-3">每日学习目标</div>
                  <Select defaultValue="10" style={{ width: '100%' }} size="large">
                    <Select.Option value="5">5 道题</Select.Option>
                    <Select.Option value="10">10 道题</Select.Option>
                    <Select.Option value="20">20 道题</Select.Option>
                    <Select.Option value="50">50 道题</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
  );

  // 概览内容
  const renderDashboard = () => (
      <div className="space-y-6 animate-fade-in">
        {/* 顶部欢迎 Banner */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                {greeting}，{userData.name} <span className="text-2xl ml-2 animate-bounce-slow">👋</span>
              </h1>
              <div className="flex items-start gap-2 text-white/80 text-sm leading-relaxed max-w-lg">
                <CoffeeOutlined className="mt-1 text-yellow-300" />
                <p>
                  你的目标分数为 <span className="text-white font-bold">{userData.stats.target}</span>。
                  今日重点推荐：<span className="text-yellow-300 font-medium border-b border-yellow-300/30 cursor-pointer hover:border-yellow-300 transition-colors">数学二次函数专项训练</span>，这有助于你巩固优势学科。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-inner">
              <div className="text-center">
                <div className="text-xs text-white/70 mb-1">当前预估</div>
                <div className="text-2xl font-bold text-white tracking-tight">{userData.stats.score}</div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xs text-white/70 mb-1">目标达成</div>
                <div className="text-2xl font-bold text-yellow-300 tracking-tight">90%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心指标 */}
        <Row gutter={[12, 12]}>
          {[
            { title: '刷题总量', value: 1250, unit: '道', icon: <EditOutlined />, color: 'text-[#EA580C]', bg: 'bg-[#FFF7ED]', trend: '+45 本周', trendUp: true },
            { title: '模考均分', value: 1350, unit: '分', icon: <TrophyOutlined />, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', trend: '+15 提升', trendUp: true },
            { title: '正确率', value: 78.5, unit: '%', icon: <AimOutlined />, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]', trend: '+2.3% 波动', trendUp: true },
            { title: '学习时长', value: 156, unit: 'h', icon: <ClockCircleOutlined />, color: 'text-[#BE185D]', bg: 'bg-[#FCE7F3]', trend: '+12h 累计', trendUp: true },
          ].map((item, i) => (
              <Col xs={12} lg={6} key={i}>
                <Card bordered={false} className="shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-xl cursor-default" bodyStyle={{ padding: '16px' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center text-base ${item.color}`}>
                      {item.icon}
                    </div>
                    <Tag className={`mr-0 border-0 ${item.trendUp ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-gray-50 text-gray-500'} text-[10px] px-1.5 py-0`}>
                      {item.trendUp ? <RiseOutlined /> : <FallOutlined />} {item.trend}
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

        <Row gutter={24}>
          {/* 左侧：主要内容 */}
          <Col xs={24} lg={16} className="space-y-6">
            {/* 能力分析 */}
            <Card
                title={<div className="flex items-center gap-2"><BarChartOutlined className="text-[#DC2626]"/> <span className="font-bold text-gray-800">学习状态分析</span></div>}
                bordered={false}
                className="shadow-sm rounded-2xl"
                extra={<Button type="text" size="small" className="text-gray-400 hover:text-[#DC2626] font-medium" onClick={() => setReportModalVisible(true)}>查看完整报告 <RightOutlined className="text-xs" /></Button>}
            >
              <Row gutter={24} align="middle">
                <Col span={24} md={10} className="flex justify-center border-b md:border-b-0 md:border-r border-gray-50 pb-6 md:pb-0 md:pr-6">
                  <AbilityRadar scores={subjectScores} />
                </Col>
                <Col span={24} md={14}>
                  <div className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-2">
                    <div className="p-4 bg-[#FFF7ED]/50 rounded-xl border border-[#FFEDD5]/50 hover:bg-[#FFF7ED] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ThunderboltOutlined className="text-[#EA580C]"/>
                          <span className="font-bold text-gray-800">优势学科：数学 (92分)</span>
                        </div>
                        <Tag color="orange" bordered={false}>Top 5%</Tag>
                      </div>
                      <p className="text-xs text-gray-500 mb-0 leading-relaxed">
                        你的代数和几何基础非常扎实，解题速度快。建议继续保持，并尝试挑战 <span className="font-bold text-[#EA580C] cursor-pointer underline">Hard 模式</span> 题目以冲击满分。
                      </p>
                    </div>
                    <div className="p-4 bg-[#FEF2F2]/50 rounded-xl border border-[#FECACA]/50 hover:bg-[#FEF2F2] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AimOutlined className="text-[#DC2626]"/>
                          <span className="font-bold text-gray-800">提升空间：语法 (75分)</span>
                        </div>
                        <Tag color="red" bordered={false} className="bg-[#DC2626] text-white">待提升</Tag>
                      </div>
                      <p className="text-xs text-gray-500 mb-0 leading-relaxed">
                        标点符号和修饰语部分错误率较高，主要集中在长难句分析。建议进行 <span className="font-bold text-[#DC2626] cursor-pointer underline">语法专项突击</span>，预计可提分 30+。
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 学习动态 */}
            <Card
                title={<div className="flex items-center gap-2"><HistoryOutlined className="text-[#DC2626]"/> <span className="font-bold text-gray-800">最近学习动态</span></div>}
                bordered={false}
                className="shadow-sm rounded-2xl"
            >
              <div className="px-2">
                <Timeline
                    items={[
                      {
                        color: '#DC2626',
                        dot: <div className="w-3 h-3 bg-[#DC2626] rounded-full border-2 border-white shadow-sm"></div>,
                        children: (
                            <div className="pb-6 group cursor-pointer">
                              <div className="font-bold text-gray-800 text-sm flex items-center justify-between">
                                <span>完成模考：2024北美卷</span>
                                <span className="text-xs font-normal text-gray-400 group-hover:text-[#DC2626] transition-colors">2小时前</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Tag className="rounded-md px-2 border-0 bg-[#FEF2F2] text-[#DC2626] font-medium">1350分</Tag>
                                <Tag className="rounded-md px-2 border-0 bg-gray-50 text-gray-500">耗时 180min</Tag>
                                <Tag className="rounded-md px-2 border-0 bg-[#DCFCE7] text-[#16A34A]">正确率 75%</Tag>
                              </div>
                            </div>
                        ),
                      },
                      {
                        color: '#EA580C',
                        dot: <div className="w-3 h-3 bg-[#EA580C] rounded-full border-2 border-white shadow-sm"></div>,
                        children: (
                            <div className="pb-6 group cursor-pointer">
                              <div className="font-bold text-gray-800 text-sm flex items-center justify-between">
                                <span>专项练习：代数基础</span>
                                <span className="text-xs font-normal text-gray-400 group-hover:text-[#DC2626] transition-colors">昨天 14:30</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                <CheckCircleOutlined className="text-[#16A34A]"/> 10道题全对 · 获得"数学小能手"徽章
                              </div>
                            </div>
                        ),
                      },
                      {
                        color: '#BE185D',
                        dot: <div className="w-3 h-3 bg-[#BE185D] rounded-full border-2 border-white shadow-sm"></div>,
                        children: (
                            <div className="pb-1 group cursor-pointer">
                              <div className="font-bold text-gray-800 text-sm flex items-center justify-between">
                                <span>系统成就：坚持不懈 <span className="text-lg ml-1">🔥</span></span>
                                <span className="text-xs font-normal text-gray-400 group-hover:text-[#DC2626] transition-colors">3天前</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                连续打卡12天，超过 85% 的用户
                              </div>
                            </div>
                        ),
                      },
                    ]}
                />
                <Button block type="dashed" className="text-gray-400 hover:text-[#DC2626] hover:border-[#DC2626] rounded-xl" size="small" onClick={() => setHistoryModalVisible(true)}>查看更多历史</Button>
              </div>
            </Card>
          </Col>

          {/* 右侧：辅助信息 */}
          <Col xs={24} lg={8} className="space-y-6">
            {/* 今日待办 */}
            <Card
                title={
                  <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <AimOutlined className="text-[#DC2626]"/>
                  今日目标
                </span>
                    <span className="text-xs text-gray-400 font-normal bg-gray-100 px-2 py-0.5 rounded-full">1/3 完成</span>
                  </div>
                }
                bordered={false}
                className="shadow-sm rounded-2xl"
                bodyStyle={{ padding: '0 16px 16px' }}
            >
              <div className="space-y-3 mt-4">
                {[
                  { title: '数学二次函数专项 (0/10)', done: false, tag: '高优', color: '#DC2626', bgColor: '#FEF2F2' },
                  { title: '复习昨日错题 (5道)', done: false, tag: '日常', color: '#EA580C', bgColor: '#FFF7ED' },
                  { title: '阅读模考解析', done: true, tag: '已完成', color: '#999', bgColor: '#F5F5F5' },
                ].map((task, i) => (
                    <div key={i} className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer group ${task.done ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:border-[#DC2626]/30 hover:shadow-sm'}`}>
                      <Checkbox checked={task.done} className="mr-3" />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</div>
                      </div>
                      {!task.done && <Tag color={task.color} style={{color: task.color, background: task.bgColor}} bordered={false} className="mr-0 text-[10px] rounded-md px-1.5">{task.tag}</Tag>}
                    </div>
                ))}
              </div>
              <Button block type="dashed" size="small" className="mt-4 text-xs text-gray-400 hover:text-[#DC2626] hover:border-[#DC2626] rounded-lg" icon={<RocketOutlined />} onClick={() => setGoalModalVisible(true)}>
                添加新目标
              </Button>
            </Card>

            {/* 活跃度 */}
            <Card title={<span className="font-bold text-gray-800 flex items-center gap-2"><FireOutlined className="text-[#EA580C]"/>活跃度</span>} bordered={false} className="shadow-sm rounded-2xl">
              <HeatMap />
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
                <div className="text-gray-500">本月累计 <span className="font-bold text-gray-800">42h</span></div>
                <div className="text-gray-500">超跃 <span className="font-bold text-[#DC2626]">84%</span> 同学</div>
              </div>
            </Card>

            {/* 徽章墙 */}
            <Card title={<span className="font-bold text-gray-800 flex items-center gap-2"><TrophyOutlined className="text-[#F59E0B]"/>最新徽章</span>} bordered={false} className="shadow-sm rounded-2xl">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: <TrophyOutlined />, color: '#DC2626', bgFrom: '#FEF2F2', bgTo: '#FEE2E2', name: '冠军' },
                  { icon: <FireOutlined />, color: '#EA580C', bgFrom: '#FFF7ED', bgTo: '#FFEDD5', name: '火焰' },
                  { icon: <StarOutlined />, color: '#F59E0B', bgFrom: '#FFFBEB', bgTo: '#FEF3C7', name: '星辰' },
                  { icon: <BookOutlined />, color: '#10B981', bgFrom: '#ECFDF5', bgTo: '#D1FAE5', name: '学者' },
                  { icon: <RocketOutlined />, color: '#3B82F6', bgFrom: '#EFF6FF', bgTo: '#DBEAFE', name: '火箭' },
                  { icon: <ThunderboltOutlined />, color: '#8B5CF6', bgFrom: '#F5F3FF', bgTo: '#EDE9FE', name: '闪电' },
                  { icon: <SafetyCertificateOutlined />, color: '#EC4899', bgFrom: '#FDF2F8', bgTo: '#FCE7F3', name: '认证' },
                  { icon: <CrownOutlined />, color: '#F97316', bgFrom: '#FFF7ED', bgTo: '#FFEDD5', name: '王冠' },
                ].map((item, i) => (
                    <Tooltip title={i < 4 ? `${item.name} · 已解锁` : `${item.name} · 未解锁`} key={i}>
                      <div className={`aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer relative group ${
                          i < 4
                              ? 'hover:-translate-y-2 hover:shadow-xl'
                              : 'grayscale opacity-40 hover:opacity-60'
                      }`}>
                        {i < 4 ? (
                            <>
                              <div className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${item.bgFrom}, ${item.bgTo})` }}></div>
                              <div className="absolute inset-[2px] rounded-2xl border-2 opacity-50 group-hover:opacity-70 transition-opacity duration-300" style={{ borderColor: item.color }}></div>
                              <div className="relative z-10 w-full h-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300" style={{ color: item.color }}>
                                {item.icon}
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-full border-2 border-white shadow-md flex items-center justify-center z-20">
                                <CheckCircleOutlined className="text-white text-[8px]" />
                              </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-gray-100 text-2xl text-gray-300">
                              {item.icon}
                            </div>
                        )}
                      </div>
                    </Tooltip>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
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
              {activeTab === 'overview' && renderDashboard()}
              {activeTab === 'analysis' && renderAnalysis()}
              {activeTab === 'plan' && renderPlan()}
              {activeTab === 'achievements' && renderAchievements()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'preferences' && renderPreferences()}
              {activeTab === 'upgrade' && (
                  <Card bordered={false} className="shadow-sm rounded-2xl min-h-[600px]">
                    <div className="text-center py-20">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center">
                        <CrownOutlined className="text-white text-6xl" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">升级 Pro 会员</h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">解锁所有真题解析、AI 智能助教、个性化学习计划等高级功能</p>
                      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        {['无限题目练习', 'AI 智能分析', '专属学习计划', '优先客服支持', '历年真题解析', '学习数据导出'].map((feature, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 font-medium">
                              <CheckCircleOutlined className="text-[#DC2626] mr-2" />
                              {feature}
                            </div>
                        ))}
                      </div>
                      <Button type="primary" size="large" className="bg-[#DC2626] border-0 h-12 px-12 rounded-full shadow-lg text-lg font-bold">
                        立即升级 Pro
                      </Button>
                    </div>
                  </Card>
              )}
            </Col>
          </Row>
        </div>

        {/* 完整报告弹窗 */}
        <Modal
            title={
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center shadow-md">
                  <BarChartOutlined className="text-white text-lg"/>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">完整学习报告</div>
                  <div className="text-xs text-gray-400">Comprehensive Learning Report</div>
                </div>
              </div>
            }
            open={reportModalVisible}
            onCancel={() => setReportModalVisible(false)}
            width={920}
            footer={[
              <Button key="export" icon={<DownloadOutlined />} className="text-[#DC2626] border-[#DC2626] hover:bg-[#FEF2F2] rounded-lg h-9 px-5 font-medium">导出报告</Button>,
              <Button key="close" type="primary" className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 font-medium shadow-md hover:bg-[#B91C1C]" onClick={() => setReportModalVisible(false)}>关闭</Button>
            ]}
            className="report-modal"
        >
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '总学习天数', value: '45', unit: '天', icon: <CalendarOutlined />, color: '#DC2626', bg: 'from-[#FEF2F2] to-[#FEE2E2]' },
                { label: '连续打卡', value: '12', unit: '天', icon: <FireOutlined />, color: '#EA580C', bg: 'from-[#FFF7ED] to-[#FFEDD5]' },
                { label: '全站排名', value: 'Top 15', unit: '%', icon: <TrophyOutlined />, color: '#F59E0B', bg: 'from-[#FFFBEB] to-[#FEF3C7]' },
              ].map((item, i) => (
                  <div key={i} className={`bg-gradient-to-br ${item.bg} rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/50`}>
                    <div className="text-3xl mb-3 transform hover:scale-110 transition-transform" style={{ color: item.color }}>{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
                      {item.value}<span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                  </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center">
                  <LineChartOutlined className="text-white text-sm"/>
                </div>
                各科目详细分析
              </h4>
              <Table
                  size="middle"
                  pagination={false}
                  className="custom-table"
                  dataSource={[
                    { key: 1, subject: '阅读', score: 82, questions: 450, accuracy: '76%', time: '52h', trend: '+5' },
                    { key: 2, subject: '语法', score: 75, questions: 380, accuracy: '72%', time: '38h', trend: '+3' },
                    { key: 3, subject: '数学', score: 92, questions: 420, accuracy: '88%', time: '66h', trend: '+8' },
                  ]}
                  columns={[
                    {
                      title: '科目',
                      dataIndex: 'subject',
                      key: 'subject',
                      render: (text) => <span className="font-bold text-gray-800">{text}</span>
                    },
                    {
                      title: '当前分数',
                      dataIndex: 'score',
                      key: 'score',
                      render: (val) => <span className="text-[#DC2626] font-bold text-lg">{val}</span>
                    },
                    {
                      title: '刷题量',
                      dataIndex: 'questions',
                      key: 'questions',
                      render: (val) => <span className="text-gray-600">{val}<span className="text-xs text-gray-400 ml-0.5">道</span></span>
                    },
                    {
                      title: '正确率',
                      dataIndex: 'accuracy',
                      key: 'accuracy',
                      render: (val) => <span className="font-medium text-gray-700">{val}</span>
                    },
                    {
                      title: '学习时长',
                      dataIndex: 'time',
                      key: 'time',
                      render: (val) => <span className="text-gray-600">{val}</span>
                    },
                    {
                      title: '近期提升',
                      dataIndex: 'trend',
                      key: 'trend',
                      render: (val) => <Tag color="green" className="rounded-md px-2 border-0 font-medium">+{val}分</Tag>
                    },
                  ]}
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <BulbOutlined className="text-white text-sm"/>
                </div>
                AI 智能建议
              </h4>
              <div className="space-y-3">
                {[
                  { type: 'success', icon: <CheckCircleOutlined />, text: '数学能力优秀，建议挑战 Hard 难度题目冲击满分', color: 'green' },
                  { type: 'warning', icon: <ThunderboltOutlined />, text: '语法部分需加强，推荐每日完成 10 道语法专项练习', color: 'orange' },
                  { type: 'info', icon: <RocketOutlined />, text: '阅读速度有待提升，建议进行限时训练提高效率', color: 'blue' },
                ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm hover:shadow-md transition-all ${
                        item.color === 'green' ? 'border-green-500' :
                            item.color === 'orange' ? 'border-orange-500' :
                                'border-blue-500'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`text-xl mt-0.5 ${
                            item.color === 'green' ? 'text-green-500' :
                                item.color === 'orange' ? 'text-orange-500' :
                                    'text-blue-500'
                        }`}>{item.icon}</div>
                        <p className="text-sm text-gray-700 mb-0 leading-relaxed flex-1">{item.text}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* 历史记录弹窗 */}
        <Modal
            title={
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#DC2626] flex items-center justify-center shadow-md">
                  <HistoryOutlined className="text-white text-lg"/>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">学习历史记录</div>
                  <div className="text-xs text-gray-400">Learning History Timeline</div>
                </div>
              </div>
            }
            open={historyModalVisible}
            onCancel={() => setHistoryModalVisible(false)}
            width={850}
            footer={[
              <Button key="close" type="primary" className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 font-medium shadow-md hover:bg-[#B91C1C]" onClick={() => setHistoryModalVisible(false)}>关闭</Button>
            ]}
            className="history-modal"
        >
          <div className="py-2">
            <div className="mb-5 flex gap-3 bg-gray-50 p-3 rounded-xl">
              <Select defaultValue="all" style={{ width: 140 }} size="large" className="custom-select">
                <Select.Option value="all">📚 全部类型</Select.Option>
                <Select.Option value="mock">🏆 模考</Select.Option>
                <Select.Option value="practice">✏️ 专项练习</Select.Option>
              </Select>
              <Select defaultValue="week" style={{ width: 140 }} size="large" className="custom-select">
                <Select.Option value="week">📅 最近一周</Select.Option>
                <Select.Option value="month">📆 最近一月</Select.Option>
                <Select.Option value="all">🗓️ 全部时间</Select.Option>
              </Select>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <Timeline
                  items={[
                    ...Array.from({ length: 15 }, (_, i) => ({
                      color: i % 3 === 0 ? '#DC2626' : i % 3 === 1 ? '#EA580C' : '#BE185D',
                      dot: (
                          <div className={`w-3 h-3 rounded-full border-[3px] border-white shadow-lg`}
                               style={{
                                 backgroundColor: i % 3 === 0 ? '#DC2626' : i % 3 === 1 ? '#EA580C' : '#BE185D',
                                 boxShadow: `0 0 0 3px ${i % 3 === 0 ? '#FEF2F2' : i % 3 === 1 ? '#FFF7ED' : '#FCE7F3'}`
                               }}>
                          </div>
                      ),
                      children: (
                          <div className="pb-5 group cursor-pointer">
                            <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#DC2626]/30 hover:shadow-md transition-all">
                              <div className="font-bold text-gray-800 text-sm flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            {i % 3 === 0 ? <TrophyOutlined className="text-[#DC2626]"/> : i % 3 === 1 ? <EditOutlined className="text-[#EA580C]"/> : <StarOutlined className="text-[#BE185D]"/>}
                            {i % 3 === 0 ? '完成模考' : i % 3 === 1 ? '专项练习' : '系统成就'}: {i % 3 === 0 ? '2024北美卷' : i % 3 === 1 ? '代数基础' : '坚持不懈'}
                          </span>
                                <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{i + 1}天前</span>
                              </div>
                              {i % 3 === 0 && (
                                  <div className="flex items-center gap-2">
                                    <Tag className="rounded-lg px-3 py-1 border-0 bg-[#FEF2F2] text-[#DC2626] text-xs font-bold">🎯 1350分</Tag>
                                    <Tag className="rounded-lg px-3 py-1 border-0 bg-gray-50 text-gray-500 text-xs">⏱️ 180min</Tag>
                                    <Tag className="rounded-lg px-3 py-1 border-0 bg-[#DCFCE7] text-[#16A34A] text-xs">✓ 75%</Tag>
                                  </div>
                              )}
                              {i % 3 === 1 && (
                                  <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <CheckCircleOutlined className="text-[#16A34A]"/> 10道题全对 · 获得"数学小能手"徽章
                                  </div>
                              )}
                            </div>
                          </div>
                      ),
                    }))
                  ]}
              />
            </div>
          </div>
        </Modal>

        {/* 添加目标弹窗 */}
        <Modal
            title={
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center shadow-md">
                  <RocketOutlined className="text-white text-lg"/>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">添加新目标</div>
                  <div className="text-xs text-gray-400">Create New Learning Goal</div>
                </div>
              </div>
            }
            open={goalModalVisible}
            onCancel={() => setGoalModalVisible(false)}
            width={650}
            footer={[
              <Button key="cancel" onClick={() => setGoalModalVisible(false)} className="rounded-lg h-9 px-5 font-medium">取消</Button>,
              <Button key="submit" type="primary" icon={<CheckCircleOutlined />} className="bg-[#DC2626] border-0 rounded-lg h-9 px-5 font-medium shadow-md hover:bg-[#B91C1C]" onClick={() => { setGoalModalVisible(false); }}>创建目标</Button>
            ]}
            className="goal-modal"
        >
          <Form layout="vertical" className="py-2">
            <Form.Item label={<span className="font-bold text-gray-700">目标名称</span>} required>
              <Input
                  placeholder="例如：完成30套模考"
                  size="large"
                  prefix={<AimOutlined className="text-gray-400"/>}
                  className="rounded-lg"
              />
            </Form.Item>
            <Form.Item label={<span className="font-bold text-gray-700">目标类型</span>} required>
              <Select placeholder="选择目标类型" size="large" className="custom-select">
                <Select.Option value="mock">🏆 模考练习</Select.Option>
                <Select.Option value="practice">✏️ 专项训练</Select.Option>
                <Select.Option value="score">🎯 分数目标</Select.Option>
                <Select.Option value="time">⏱️ 学习时长</Select.Option>
                <Select.Option value="accuracy">✓ 正确率</Select.Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={<span className="font-bold text-gray-700">目标数值</span>} required>
                  <Input
                      placeholder="例如：30"
                      size="large"
                      type="number"
                      prefix={<ThunderboltOutlined className="text-gray-400"/>}
                      className="rounded-lg"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="font-bold text-gray-700">截止日期</span>} required>
                  <DatePicker
                      placeholder="选择日期"
                      size="large"
                      style={{ width: '100%' }}
                      className="rounded-lg"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={<span className="font-bold text-gray-700">优先级</span>}>
              <Segmented
                  options={[
                    {
                      label: (
                          <span className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" />
                      低
                    </span>
                      ),
                      value: 'low'
                    },
                    {
                      label: (
                          <span className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-orange-500" />
                      中
                    </span>
                      ),
                      value: 'medium'
                    },
                    {
                      label: (
                          <span className="flex items-center gap-2">
                      <FireOutlined className="text-red-500" />
                      高
                    </span>
                      ),
                      value: 'high'
                    },
                  ]}
                  block
                  size="large"
                  className="custom-segmented"
              />
            </Form.Item>
            <Form.Item label={<span className="font-bold text-gray-700">备注说明</span>}>
              <Input.TextArea
                  placeholder="添加目标的详细说明..."
                  rows={4}
                  className="rounded-lg"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* 补充样式 */}
        <style>{`
        .ant-timeline-item-tail { border-left-color: #e5e7eb; }
        .ant-card { transition: all 0.3s; }
        .ant-tag { border: none; }
        .ant-progress-bg { border-radius: 100px !important; }
        .ant-checkbox-checked .ant-checkbox-inner { background-color: #DC2626; border-color: #DC2626; }
        .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner { border-color: #DC2626; }

        /* Modal 样式优化 */
        .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 20px 24px;
          background: linear-gradient(to bottom, #ffffff, #fafafa);
        }
        .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
          padding: 16px 24px;
          background: #fafafa;
        }
        .ant-modal-body {
          padding: 24px;
        }
        .ant-modal-close {
          top: 20px;
          right: 20px;
        }
        .ant-modal-close-x {
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .ant-modal-close-x:hover {
          background: #FEF2F2;
          color: #DC2626;
        }

        /* Table 样式优化 */
        .custom-table .ant-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }
        .custom-table .ant-table-thead > tr > th {
          background: white;
          font-weight: 700;
          color: #374151;
          border-bottom: 2px solid #f3f4f6;
          padding: 14px 16px;
        }
        .custom-table .ant-table-tbody > tr > td {
          padding: 14px 16px;
          border-bottom: 1px solid #f9fafb;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #fafafa;
        }

        /* Select 样式优化 */
        .custom-select .ant-select-selector {
          border-radius: 10px !important;
          border: 2px solid #e5e7eb !important;
          font-weight: 500;
        }
        .custom-select:hover .ant-select-selector {
          border-color: #DC2626 !important;
        }
        .custom-select.ant-select-focused .ant-select-selector {
          border-color: #DC2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }

        /* Segmented 样式优化 */
        .custom-segmented.ant-segmented {
          background: #f3f4f6;
          padding: 4px;
          border-radius: 10px;
        }
        .custom-segmented .ant-segmented-item {
          border-radius: 8px;
          font-weight: 600;
        }
        .custom-segmented .ant-segmented-item-selected {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* Input 样式优化 */
        .ant-input, .ant-input-number, .ant-picker {
          border-radius: 10px;
          border: 2px solid #e5e7eb;
        }
        .ant-input:hover, .ant-input-number:hover, .ant-picker:hover {
          border-color: #DC2626;
        }
        .ant-input:focus, .ant-input-number:focus, .ant-picker:focus,
        .ant-input-focused, .ant-input-number-focused, .ant-picker-focused {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        /* Scrollbar 样式优化 */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #DC2626;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B91C1C;
        }
      `}</style>

        {/* 添加遮挡层 */}
        {isOverlayVisible && (
            <div className="content-overlay">
              <div className="overlay-content">
                <div className="overlay-icon">
                  {/* 晚安月亮睡眠图标 */}
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#b91c1c" />
                      </linearGradient>
                    </defs>
                    {/* 月亮主体 */}
                    <path
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        fill="url(#moonGradient)"
                        stroke="#b91c1c"
                        strokeWidth="1.5"
                    />
                    {/* 星星点缀 */}
                    <circle cx="6" cy="8" r="0.8" fill="white" opacity="0.8"/>
                    <circle cx="10" cy="6" r="0.6" fill="white" opacity="0.6"/>
                    <circle cx="18" cy="7" r="0.7" fill="white" opacity="0.7"/>
                    <circle cx="8" cy="14" r="0.9" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div className="overlay-text">
                  <h3 className="text-xl font-bold text-red-600 mb-2">功能暂未开放</h3>
                  <p className="text-gray-600">敬请期待后续更新</p>
                </div>
              </div>
            </div>
        )}
    </div>
  );
}

export default Profile;