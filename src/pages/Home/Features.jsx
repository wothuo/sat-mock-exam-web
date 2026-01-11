import React from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Row, Tag } from 'antd';

import {
    BookOutlined,
    DatabaseOutlined,
    EditOutlined,
    LineChartOutlined,
    RightOutlined,
    RocketOutlined,
    TrophyOutlined
} from '@ant-design/icons';

function Features() {
  const systemModules = [
    {
      id: 'mock-exam',
      title: '套题模考系统',
      icon: <TrophyOutlined />,
      color: 'from-blue-500 to-cyan-600',
      description: '完整的模拟考试环境，支持计时/不计时模式，自动评分与深度分析。',
      tag: '核心模块'
    },
    {
      id: 'special-training',
      title: '专项训练系统',
      icon: <RocketOutlined />,
      color: 'from-purple-500 to-pink-600',
      description: '针对性技能提升，支持多维度筛选练习，智能推荐薄弱环节。',
      tag: '提分必备'
    },
    {
      id: 'question-bank',
      title: '题库管理系统',
      icon: <DatabaseOutlined />,
      color: 'from-green-500 to-teal-600',
      description: '强大的题目编辑与管理功能，支持 KaTeX 数学公式与多媒体题型。',
      tag: '教研工具'
    },
    {
      id: 'exam-content',
      title: '考试答题系统',
      icon: <EditOutlined />,
      color: 'from-red-500 to-orange-600',
      description: '完善的答题与标注功能，支持多色高亮、笔记备注与进度追踪。',
      tag: '沉浸体验'
    },
    {
      id: 'practice-record',
      title: '学习记录系统',
      icon: <LineChartOutlined />,
      color: 'from-indigo-500 to-purple-600',
      description: '全面的学习数据统计，可视化展示进步轨迹，智能分析强弱项。',
      tag: '数据驱动'
    },
    {
      id: 'courses',
      title: '课程学习系统',
      icon: <BookOutlined />,
      color: 'from-yellow-500 to-orange-600',
      description: '丰富的在线课程资源，名师精品讲座，系统化知识点覆盖。',
      tag: '名师指导'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">六大核心系统</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            全方位覆盖备考全流程，从入库、练习到模考、分析，提供一站式专业支持
          </p>
        </div>
        
        <Row gutter={[24, 24]}>
          {systemModules.map((module) => (
            <Col xs={24} sm={12} lg={8} key={module.id}>
              <Card
                hoverable
                className="group h-full border-gray-100 rounded-3xl overflow-hidden"
                styles={{
                  body: { padding: '32px' }
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-2xl text-white">
                      {module.icon}
                    </div>
                  </div>
                  <Tag color="blue" className="m-0 rounded-full px-3 border-0 bg-blue-50 text-blue-600 font-medium">
                    {module.tag}
                  </Tag>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {module.title}
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  {module.description}
                </p>
                
                <Link to={`/${module.id}`}>
                  <Button 
                    type="link" 
                    className="p-0 h-auto text-red-600 font-bold flex items-center group-hover:translate-x-2 transition-transform"
                  >
                    进入系统 <RightOutlined className="ml-2 text-xs" />
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

export default Features;