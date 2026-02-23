import React from 'react';

import { Link } from 'react-router-dom';

import { Button, Carousel, Space } from 'antd';

import { RocketOutlined } from '@ant-design/icons';

function Hero() {
  const slides = [
    {
      title: "ReachTop 专业考试平台",
      subtitle: "全方位备考解决方案 · 真实模考环境 · 智能数据分析",
      description: "助你精准定位弱项，高效突破目标分数",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2000",
      icon: <RocketOutlined />,
      primaryBtn: { text: "立即开始模考", link: "/exam" },
      secondaryBtn: { text: "专项技能训练", link: "/practice" }
    },
    // {
    //   title: "AI 驱动的智能分析系统",
    //   subtitle: "深度挖掘答题数据 · 精准画像学习进度",
    //   description: "每一道错题都是进步的阶梯，让提分变得有迹可循",
    //   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
    //   icon: <LineChartOutlined />,
    //   primaryBtn: { text: "查看学习记录", link: "/record" },
    //   secondaryBtn: { text: "了解评分标准", link: "/encyclopedia" }
    // },
    // {
    //   title: "权威题库 实时更新",
    //   subtitle: "历年真题精选 · 官方样题同步 · 专家深度解析",
    //   description: "涵盖 SAT/雅思/托福等主流考试，确保练习内容始终前沿",
    //   image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=2000",
    //   icon: <SafetyCertificateOutlined />,
    //   primaryBtn: { text: "进入题库管理", link: "/management" },
    //   secondaryBtn: { text: "浏览课程讲座", link: "/courses" }
    // }
  ];

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      <Carousel 
        autoplay 
        effect="fade" 
        autoplaySpeed={3500}
        speed={1000}
        // dots={{ className: 'custom-dots' }}
        dots={false}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[500px] md:h-[650px]">
            {/* 背景图片与遮罩 */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-110 animate-slow-zoom"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
            </div>

            {/* 内容区域 */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-3 mb-6 animate-fade-in-up">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                    <span className="text-white text-xl">{slide.icon}</span>
                  </div>
                  <span className="text-red-500 font-bold tracking-widest uppercase text-sm">ReachTop Premium</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up delay-100">
                  {slide.title.includes('ReachTop') ? (
                    <>ReachTop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">专业考试平台AUTO129</span></>
                  ) : slide.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium animate-fade-in-up delay-200">
                  {slide.subtitle}
                </p>
                
                <p className="text-lg text-gray-400 mb-10 animate-fade-in-up delay-300">
                  {slide.description}
                </p>

                <Space size="large" className="flex-wrap animate-fade-in-up delay-400">
                  <Link to={slide.primaryBtn.link}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<RocketOutlined />}
                      className="h-14 px-10 rounded-2xl bg-red-600 hover:bg-red-700 border-0 shadow-xl shadow-red-600/20 font-bold text-lg transition-all hover:scale-105"
                    >
                      {slide.primaryBtn.text}
                    </Button>
                  </Link>
                  <Link to={slide.secondaryBtn.link}>
                    <Button
                      size="large"
                      className="h-14 px-10 rounded-2xl font-bold text-lg border-2 border-white/20 text-white hover:border-red-500 hover:text-red-500 bg-white/5 backdrop-blur-md transition-all hover:scale-105"
                    >
                      {slide.secondaryBtn.text}
                    </Button>
                  </Link>
                </Space>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 12s linear infinite alternate;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .custom-dots {
          bottom: 40px !important;
          justify-content: flex-start !important;
          max-width: 1280px;
          margin: 0 auto !important;
          padding: 0 32px !important;
        }
        .custom-dots li button {
          width: 30px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: rgba(255, 255, 255, 0.3) !important;
        }
        .custom-dots li.ant-carousel-active button {
          background: #ef4444 !important;
          width: 50px !important;
        }
      `}</style>
    </section>
  );
}

export default Hero;