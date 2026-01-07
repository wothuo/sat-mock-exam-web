import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

import { BookOutlined, CheckCircleOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';

function Stats() {
  const stats = [
    { icon: <UserOutlined />, label: '注册用户', value: 100000, suffix: '+', color: 'from-blue-500 to-cyan-600' },
    { icon: <CheckCircleOutlined />, label: '模考次数', value: 50000, suffix: '+', color: 'from-green-500 to-teal-600' },
    { icon: <BookOutlined />, label: '题库数量', value: 10000, suffix: '+', color: 'from-purple-500 to-pink-600' },
    { icon: <SmileOutlined />, label: '用户满意度', value: 95, suffix: '%', color: 'from-yellow-500 to-orange-600' }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">用数据见证成长</h2>
          <p className="text-lg text-gray-600">ReachTop 已成为数万考生的首选备考平台</p>
        </div>
        
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <Card className="text-center rounded-3xl border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <div className="text-2xl text-white">
                    {stat.icon}
                  </div>
                </div>
                <Statistic 
                  value={stat.value} 
                  suffix={stat.suffix}
                  valueStyle={{ fontSize: '36px', fontWeight: '900', color: '#111827' }}
                />
                <div className="text-base font-medium text-gray-500 mt-2">{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

export default Stats;