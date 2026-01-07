import { CalendarOutlined, ClockCircleOutlined, EyeOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Space, Tag } from 'antd';
import React, { useState } from 'react';

const { Search } = Input;

function Encyclopedia() {
  const [activeCategory, setActiveCategory] = useState('考试介绍');

  const categories = [
    '考试介绍',
    '报名指南',
    '考试流程',
    '评分标准',
    '备考攻略',
    '常见问题'
  ];

  const articles = {
    '考试介绍': [
      {
        id: 1,
        title: '雅思考试全面介绍',
        summary: '了解雅思考试的基本信息、考试形式和适用范围',
        readTime: '5分钟',
        views: 12500,
        date: '2024-01-15'
      },
      {
        id: 2,
        title: '雅思A类与G类的区别',
        summary: '详细对比学术类和培训类雅思考试的差异',
        readTime: '3分钟',
        views: 8900,
        date: '2024-01-14'
      },
      {
        id: 3,
        title: '雅思考试四个部分详解',
        summary: '听力、阅读、写作、口语四个部分的考试内容和要求',
        readTime: '8分钟',
        views: 15600,
        date: '2024-01-13'
      }
    ],
    '报名指南': [
      {
        id: 4,
        title: '雅思考试报名流程详解',
        summary: '从注册账号到完成缴费的完整报名步骤',
        readTime: '6分钟',
        views: 9800,
        date: '2024-01-12'
      },
      {
        id: 5,
        title: '雅思考试费用说明',
        summary: '考试费用、转考费、退考费等相关费用介绍',
        readTime: '4分钟',
        views: 7200,
        date: '2024-01-11'
      }
    ],
    '考试流程': [
      {
        id: 6,
        title: '雅思考试当天流程',
        summary: '考试当天的时间安排和注意事项',
        readTime: '7分钟',
        views: 11300,
        date: '2024-01-10'
      },
      {
        id: 7,
        title: '雅思口语考试流程',
        summary: '口语考试的三个部分和评分要点',
        readTime: '5分钟',
        views: 13400,
        date: '2024-01-09'
      }
    ],
    '评分标准': [
      {
        id: 8,
        title: '雅思评分标准详解',
        summary: '9分制评分系统和各分数段的能力描述',
        readTime: '10分钟',
        views: 18700,
        date: '2024-01-08'
      },
      {
        id: 9,
        title: '雅思写作评分标准',
        summary: '写作任务的四个评分维度详细说明',
        readTime: '8分钟',
        views: 14200,
        date: '2024-01-07'
      }
    ],
    '备考攻略': [
      {
        id: 10,
        title: '雅思备考时间规划',
        summary: '不同基础学员的备考时间安排建议',
        readTime: '12分钟',
        views: 22100,
        date: '2024-01-06'
      },
      {
        id: 11,
        title: '雅思高分备考策略',
        summary: '7分以上高分学员的备考经验分享',
        readTime: '15分钟',
        views: 19800,
        date: '2024-01-05'
      }
    ],
    '常见问题': [
      {
        id: 12,
        title: '雅思考试常见问题解答',
        summary: '考生最关心的问题集中解答',
        readTime: '6分钟',
        views: 16500,
        date: '2024-01-04'
      },
      {
        id: 13,
        title: '雅思成绩复议指南',
        summary: '成绩复议的条件、流程和注意事项',
        readTime: '4分钟',
        views: 8700,
        date: '2024-01-03'
      }
    ]
  };

  const hotTopics = [
    '雅思7分备考计划',
    '雅思口语话题预测',
    '雅思写作模板',
    '雅思听力技巧',
    '雅思阅读方法'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-8">
          <Search
            placeholder="搜索你想了解的雅思知识..."
            size="large"
            prefix={<SearchOutlined />}
            className="rounded-lg"
          />
        </div>

        {/* 热门话题 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">热门话题</h2>
          <Space size="middle" wrap>
            {hotTopics.map((topic, index) => (
              <Tag
                key={index}
                color="red"
                className="px-4 py-2 text-sm cursor-pointer"
              >
                {topic}
              </Tag>
            ))}
          </Space>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* 侧边栏分类 */}
        <div className="lg:col-span-1">
          {/* 移动端：横向滚动标签 */}
          <div className="flex lg:hidden overflow-x-auto pb-4 mb-4 space-x-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors text-sm ${
                  activeCategory === category
                    ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                    : 'text-gray-600 bg-white border border-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 桌面端：垂直导航卡片 */}
          <Card className="hidden lg:block sticky top-24">
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-500 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* 主要内容区 */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeCategory}</h2>
            <p className="text-gray-600">
              {activeCategory === '考试介绍' && '了解雅思考试的基本信息和考试形式'}
              {activeCategory === '报名指南' && '详细的雅思考试报名流程和注意事项'}
              {activeCategory === '考试流程' && '雅思考试当天的完整流程介绍'}
              {activeCategory === '评分标准' && '雅思考试的评分体系和标准说明'}
              {activeCategory === '备考攻略' && '高效的雅思备考方法和策略'}
              {activeCategory === '常见问题' && '考生最关心的问题集中解答'}
            </p>
          </div>

              {/* 文章列表 */}
              <div className="space-y-6">
                {articles[activeCategory]?.map((article) => (
                  <Card key={article.id} hoverable>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{article.summary}</p>
                        <Space size="large" className="text-sm text-gray-500">
                          <span><ClockCircleOutlined className="mr-1" />{article.readTime}</span>
                          <span><EyeOutlined className="mr-1" />{article.views.toLocaleString()}次阅读</span>
                          <span><CalendarOutlined className="mr-1" />{article.date}</span>
                        </Space>
                      </div>
                      <div className="ml-6">
                        <RightOutlined className="text-gray-400" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

          {/* 相关推荐 */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">相关推荐</h3>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card hoverable>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-book text-red-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">雅思官方指南</h4>
                      <p className="text-sm text-gray-600">权威的考试指导材料</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card hoverable>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-video text-green-500"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">备考视频课程</h4>
                      <p className="text-sm text-gray-600">名师在线指导课程</p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Encyclopedia;

