import React, { useState } from 'react';

import { Button, Card, Col, Rate, Row, Tag } from 'antd';

import { ClockCircleOutlined, PlayCircleOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';

function Courses() {
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '听力', '阅读', '写作', '口语', '语法', '词汇'];

  const courses = [
    {
      id: 1,
      title: '雅思阅读高分技巧',
      instructor: '张老师',
      duration: '2小时30分钟',
      students: 1250,
      rating: 4.9,
      price: '免费',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
      category: '阅读',
      level: '中级'
    },
    {
      id: 2,
      title: '雅思写作Task2论证技巧',
      instructor: '李老师',
      duration: '3小时15分钟',
      students: 980,
      rating: 4.8,
      price: '¥199',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
      category: '写作',
      level: '高级'
    },
    {
      id: 3,
      title: '雅思听力场景词汇精讲',
      instructor: '王老师',
      duration: '1小时45分钟',
      students: 1580,
      rating: 4.7,
      price: '免费',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
      category: '听力',
      level: '初级'
    },
    {
      id: 4,
      title: '雅思口语Part2话题拓展',
      instructor: '刘老师',
      duration: '2小时10分钟',
      students: 750,
      rating: 4.9,
      price: '¥299',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      category: '口语',
      level: '中级'
    },
    {
      id: 5,
      title: '雅思语法基础强化',
      instructor: '陈老师',
      duration: '4小时20分钟',
      students: 2100,
      rating: 4.6,
      price: '¥149',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
      category: '语法',
      level: '初级'
    },
    {
      id: 6,
      title: '雅思核心词汇记忆法',
      instructor: '赵老师',
      duration: '1小时30分钟',
      students: 1890,
      rating: 4.8,
      price: '免费',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      category: '词汇',
      level: '初级'
    }
  ];

  const filteredCourses = activeCategory === '全部' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {/* 分类筛选 */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 推荐课程 */}
        <Card className="mb-12 bg-gradient-to-r from-red-600 to-red-800 border-0">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold mb-2">本周推荐课程</h2>
              <p className="text-red-100 mb-4">雅思7分突破班 - 全科精讲</p>
              <div className="flex items-center space-x-4 text-sm mb-4">
                <span><UserOutlined className="mr-1" />名师授课</span>
                <span><ClockCircleOutlined className="mr-1" />20小时</span>
                <span><StarOutlined className="mr-1" />限时优惠</span>
              </div>
              <Button size="large" className="bg-white text-red-600 hover:bg-gray-50 border-0 font-medium">
                立即报名
              </Button>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop"
                alt="推荐课程"
                className="rounded-lg"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 课程列表 */}
      <Row gutter={[24, 24]}>
        {filteredCourses.map((course) => (
          <Col xs={24} md={12} lg={8} key={course.id}>
            <Card
              hoverable
              cover={
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Tag color={
                      course.level === '初级' ? 'success' :
                      course.level === '中级' ? 'warning' : 'error'
                    }>
                      {course.level}
                    </Tag>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Tag color={course.price === '免费' ? 'red' : 'default'}>
                      {course.price}
                    </Tag>
                  </div>
                </div>
              }
            >
              <Card.Meta
                title={<h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>}
                description={<p className="text-sm text-gray-600">讲师：{course.instructor}</p>}
              />
              
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 mb-4">
                <span><ClockCircleOutlined className="mr-1" />{course.duration}</span>
                <span><UserOutlined className="mr-1" />{course.students}人学习</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Rate disabled defaultValue={course.rating} className="text-sm" />
                  <span className="ml-2 text-sm text-gray-600">{course.rating}</span>
                </div>
                <Button type="primary" size="small" className="bg-red-600 hover:bg-red-700 border-0">
                  {course.price === '免费' ? '免费学习' : '立即购买'}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 学习统计 */}
      <Row gutter={[32, 32]} className="mt-16">
        <Col xs={24} md={8}>
          <Card className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayCircleOutlined className="text-2xl text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">精品课程</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chalkboard-teacher text-2xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">资深讲师</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-2xl text-purple-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
            <p className="text-gray-600">学员</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Courses;

