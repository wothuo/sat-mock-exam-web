import React from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, Col, Row, Space } from 'antd';

import { DatabaseOutlined, LineChartOutlined, RocketOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';

import Features from './Features';
import Hero from './Hero';
import Stats from './Stats';

function Home() {
  const advantages = [
    {
      title: '真实考试环境',
      desc: '完全还原真实考试流程，提供最接近实战的练习体验，消除考场紧张感。',
      icon: <TrophyOutlined />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: '智能评分系统',
      desc: 'AI驱动的智能评分，精准分析强弱项，提供个性化提分建议与学习路径。',
      icon: <StarOutlined />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: '海量题库资源',
      desc: '涵盖历年真题、官方样题，持续更新，题型全面，支持 KaTeX 公式渲染。',
      icon: <DatabaseOutlined />,
      color: 'from-green-500 to-teal-600'
    },
    {
      title: '多维度学习追踪',
      desc: '全方位记录学习数据，可视化展示进步轨迹，让每一分进步都清晰可见。',
      icon: <LineChartOutlined />,
      color: 'from-red-500 to-orange-600'
    }
  ];

  return (
    <div className="overflow-hidden">
      <Hero />
      
      <Features />

      {/* 核心优势板块 */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">为什么选择 ReachTop</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们不仅提供题目，更提供一套科学、高效的备考方法论
            </p>
          </div>
          
          <Row gutter={[24, 24]}>
            {advantages.map((advantage, index) => (
              <Col xs={24} md={12} key={index}>
                <Card hoverable className="h-full rounded-3xl border-0 shadow-sm">
                  <Space align="start" size="large">
                    <div className={`w-14 h-14 bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <div className="text-white text-2xl">
                        {advantage.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{advantage.desc}</p>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <Stats />

      {/* 底部 CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">准备好开启高分之旅了吗？</h2>
              <p className="text-xl md:text-2xl mb-12 text-red-100 max-w-2xl mx-auto">
                加入 100,000+ 学员，使用最专业的工具，让备考变得简单高效。
              </p>
              <Space size="large" className="flex-wrap justify-center">
                <Link to="/login">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<RocketOutlined />}
                    className="h-14 px-10 bg-white text-red-600 hover:bg-gray-100 border-0 shadow-xl font-black text-lg rounded-2xl"
                  >
                    立即登录
                  </Button>
                </Link>
                <Link to="/mock-exam">
                  <Button 
                    size="large" 
                    className="h-14 px-10 bg-red-700/30 text-white hover:bg-red-700/50 border-white/30 shadow-lg font-bold text-lg rounded-2xl backdrop-blur-sm"
                  >
                    先去体验模考
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

