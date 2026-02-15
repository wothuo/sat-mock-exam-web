import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Row, Space, Statistic } from 'antd';

import {
    BookOutlined,
    CheckCircleOutlined,
    DatabaseOutlined,
    EditOutlined,
    EyeOutlined,
    LineChartOutlined,
    RocketOutlined,
    SmileOutlined,
    StarOutlined,
    TrophyOutlined,
    UserOutlined
} from '@ant-design/icons';

function SystemOverview() {
  const [activeModule, setActiveModule] = useState(null);

  const systemModules = [
    {
      id: 'mock-exam',
      title: '套题模考系统',
      icon: <TrophyOutlined />,
      color: 'from-blue-500 to-cyan-600',
      description: '完整的模拟考试环境，支持计时/不计时模式',
      features: [
        '真实考试环境模拟',
        '智能计时系统',
        '自动评分与分析',
        '历年真题题库',
        '官方样题支持'
      ],
      stats: {
        questions: '2000+',
        users: '50000+',
        satisfaction: '95%'
      }
    },
    {
      id: 'special-training',
      title: '专项训练系统',
      icon: <RocketOutlined />,
      color: 'from-purple-500 to-pink-600',
      description: '针对性技能提升，支持多维度筛选练习',
      features: [
        '7大技能类型训练',
        '多维度题目筛选',
        '难度等级分类',
        '错题智能推荐',
        '个性化练习计划'
      ],
      stats: {
        skills: '7种',
        exercises: '5000+',
        accuracy: '85%'
      }
    },
    {
      id: 'question-bank',
      title: '题库管理系统',
      icon: <DatabaseOutlined />,
      color: 'from-green-500 to-teal-600',
      description: '强大的题目编辑与管理功能',
      features: [
        '可视化题目编辑器',
        '数学公式支持(KaTeX)',
        '图片/表格题型',
        '多种题型支持',
        '实时预览功能'
      ],
      stats: {
        types: '6种',
        formulas: '支持',
        preview: '实时'
      }
    },
    {
      id: 'exam-content',
      title: '考试答题系统',
      icon: <EditOutlined />,
      color: 'from-red-500 to-orange-600',
      description: '完善的答题与标注功能',
      features: [
        '文本高亮标注',
        '笔记备注功能',
        '答题进度追踪',
        '标记复习功能',
        '多色高亮支持'
      ],
      stats: {
        highlights: '4色',
        notes: '无限',
        review: '支持'
      }
    },
    {
      id: 'record',
      title: '学习记录系统',
      icon: <LineChartOutlined />,
      color: 'from-indigo-500 to-purple-600',
      description: '全面的学习数据统计与分析',
      features: [
        '模考记录管理',
        '专项练习统计',
        '笔记记录查看',
        '成绩趋势分析',
        '多维度数据展示'
      ],
      stats: {
        records: '完整',
        analysis: '智能',
        export: '支持'
      }
    },
    {
      id: 'courses',
      title: '课程学习系统',
      icon: <BookOutlined />,
      color: 'from-yellow-500 to-orange-600',
      description: '丰富的在线课程资源',
      features: [
        '名师精品课程',
        '分类课程体系',
        '学习进度追踪',
        '课程评价系统',
        '免费/付费课程'
      ],
      stats: {
        courses: '500+',
        teachers: '50+',
        students: '50000+'
      }
    }
  ];

  const technicalFeatures = [
    {
      title: '前端技术栈',
      items: [
        { name: 'React 18', desc: '现代化UI框架' },
        { name: 'React Router', desc: '路由管理' },
        { name: 'Tailwind CSS', desc: '原子化CSS' },
        { name: 'KaTeX', desc: '数学公式渲染' }
      ]
    },
    {
      title: '核心功能',
      items: [
        { name: '响应式设计', desc: '多端适配' },
        { name: '实时渲染', desc: '公式即时显示' },
        { name: '数据持久化', desc: '本地存储' },
        { name: '智能评分', desc: 'AI辅助分析' }
      ]
    },
    {
      title: '用户体验',
      items: [
        { name: '流畅交互', desc: '动画过渡' },
        { name: '直观界面', desc: '易用性强' },
        { name: '快速响应', desc: '性能优化' },
        { name: '无障碍访问', desc: 'A11y支持' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <i className="fas fa-sitemap text-2xl md:text-3xl text-white"></i>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            ReachTop 系统功能总览
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            专业的考试备考平台 · 六大核心模块 · 全方位学习支持
          </p>
        </div>

        {/* 系统架构图 */}
        <div className="mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              <i className="fas fa-project-diagram mr-3 text-red-600"></i>
              系统架构总览
            </h2>
            
            {/* 核心模块展示 */}
            <Row gutter={[16, 16]} className="mb-12">
              {systemModules.map((module) => (
                <Col xs={24} sm={12} lg={8} key={module.id}>
                  <Card
                    hoverable
                    className="h-full"
                    onMouseEnter={() => setActiveModule(module.id)}
                    onMouseLeave={() => setActiveModule(null)}
                    styles={{
                      body: { padding: '24px' }
                    }}
                  >
                    {/* 图标 */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-2xl text-white">
                        {module.icon}
                      </div>
                    </div>
                    
                    {/* 标题 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    
                    {/* 描述 */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    
                    {/* 统计数据 */}
                    <Row gutter={8} className="mb-4">
                      {Object.entries(module.stats).map(([key, value]) => (
                        <Col span={8} key={key}>
                          <Card size="small" className="text-center">
                            <Statistic 
                              value={value} 
                              valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
                            />
                            <div className="text-xs text-gray-500 mt-1">{key}</div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    
                    {/* 功能列表 - 悬停显示 */}
                    {activeModule === module.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">核心功能：</h4>
                        <Space direction="vertical" size="small" className="w-full">
                          {module.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <CheckCircleOutlined className="text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </Space>
                      </div>
                    )}
                    
                    {/* 查看详情按钮 */}
                    <Link to={`/${module.id}`}>
                      <Button 
                        type="primary" 
                        block 
                        className={`mt-4 bg-gradient-to-r ${module.color}`}
                        icon={<EyeOutlined />}
                      >
                        查看详情
                      </Button>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 连接线装饰 */}
            <div className="relative h-24 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-6 py-2 rounded-full border-2 border-gray-300 shadow-lg">
                  <i className="fas fa-arrow-down text-gray-400 text-xl"></i>
                </div>
              </div>
            </div>

            {/* 技术特性 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicalFeatures.map((section, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-star text-white text-sm"></i>
                    </div>
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 数据统计面板 */}
        <Row gutter={[24, 24]} className="mb-16">
          {[
            { icon: <UserOutlined />, label: '注册用户', value: 100000, suffix: '+', color: 'from-blue-500 to-cyan-600' },
            { icon: <CheckCircleOutlined />, label: '模考次数', value: 50000, suffix: '+', color: 'from-green-500 to-teal-600' },
            { icon: <BookOutlined />, label: '题库数量', value: 10000, suffix: '+', color: 'from-purple-500 to-pink-600' },
            { icon: <SmileOutlined />, label: '用户满意度', value: 95, suffix: '%', color: 'from-yellow-500 to-orange-600' }
          ].map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <Card className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <div className="text-2xl text-white">
                    {stat.icon}
                  </div>
                </div>
                <Statistic 
                  value={stat.value} 
                  suffix={stat.suffix}
                  valueStyle={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}
                />
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 系统优势 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            <i className="fas fa-trophy mr-3 text-yellow-500"></i>
            系统核心优势
          </h2>
          
          <Row gutter={[24, 24]}>
            {[
              {
                title: '真实考试环境',
                desc: '完全还原真实考试流程，提供最接近实战的练习体验',
                icon: <TrophyOutlined />,
                color: 'from-blue-500 to-cyan-600'
              },
              {
                title: '智能评分系统',
                desc: 'AI驱动的智能评分，精准分析强弱项，提供个性化建议',
                icon: <StarOutlined />,
                color: 'from-purple-500 to-pink-600'
              },
              {
                title: '海量题库资源',
                desc: '涵盖历年真题、官方样题，持续更新，题型全面',
                icon: <DatabaseOutlined />,
                color: 'from-green-500 to-teal-600'
              },
              {
                title: '多维度学习追踪',
                desc: '全方位记录学习数据，可视化展示进步轨迹',
                icon: <LineChartOutlined />,
                color: 'from-red-500 to-orange-600'
              }
            ].map((advantage, index) => (
              <Col xs={24} md={12} key={index}>
                <Card hoverable className="h-full">
                  <Space align="start" size="middle">
                    <div className={`w-12 h-12 bg-gradient-to-br ${advantage.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <div className="text-white text-xl">
                        {advantage.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{advantage.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{advantage.desc}</p>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 底部CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">开始你的备考之旅</h2>
            <p className="text-xl mb-8 text-red-100">
              加入 100,000+ 学员，一起高效备考，轻松提分
            </p>
            <Space size="large" className="flex-wrap justify-center">
              <Link to="/mock-exam">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<RocketOutlined />}
                  className="h-12 px-8 bg-white text-red-600 hover:bg-gray-100 border-0 shadow-lg font-bold"
                >
                  立即开始模考
                </Button>
              </Link>
              <Link to="/special-training">
                <Button 
                  size="large" 
                  icon={<TrophyOutlined />}
                  className="h-12 px-8 bg-red-700 text-white hover:bg-red-800 border-0 shadow-lg font-bold"
                >
                  专项训练
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemOverview;

