import React, { useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { message } from 'antd';

import { answerOfSection } from '../../../../services/exam';
import { startPractice } from '../../../../services/training';

function TimeModeScreen({ timeMode: timeModeProp, setTimeMode }) {
  // 独立路由 /time-mode 传入的 setTimeMode 为空函数，需用内部 state 才能使选择生效
  const [selectedTimeMode, setSelectedTimeMode] = useState(timeModeProp ?? 'timed');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // 从路由状态中获取配置参数
  const { source = 'exam', config = {} } = location.state || {};

  const handleStart = async () => {
    setLoading(true);
    console.log('开始处理，来源:', source, '配置:', config, '时间模式:', selectedTimeMode);
    try {
      let questions;
      
      if (source === 'exam') {
        // 模考模式：调用answerOfSection获取题目
        console.log('调用answerOfSection，sectionId:', config.sectionId);
        questions = await answerOfSection(config.sectionId);
        console.log('获取到题目:', questions);
        
        // 导航到考试内容页面，传递必要的参数
        navigate(`/exam/${config.sectionId}`, {
          state: {
            sectionId: config.sectionId,
            examTitle: config.examTitle,
            sectionName: config.sectionName,
            examDuration: config.examDuration,
            totalQuestions: config.totalQuestions,
            questions: questions,
            timeMode: selectedTimeMode
          }
        });
      } else if (source === 'practice') {
        // 训练模式：调用startPractice获取题目
        const practiceParams = {
          questionCategory: config.questionCategory,
          questionSubCategory: config.questionSubCategory,
          difficulty: config.difficulty,
          source: config.source,
          records: config.records,
          size: config.size
        };
        
        console.log('调用startPractice，参数:', practiceParams);
        questions = await startPractice(practiceParams);
        console.log('获取到题目:', questions);
        
        // 导航到练习页面，传递题目数据
        navigate('/practicing', { state: { questions, timeMode: selectedTimeMode } });
      }
    } catch (error) {
      console.error('获取题目失败:', error);
      message.error('获取题目失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 根据来源显示不同的标题和描述
  const getTitle = () => {
    if (source === 'exam') {
      return {
        title: 'Select Exam Timing',
        subtitle: 'Choose your preferred timing option'
      };
    } else if (source === 'practice') {
      return {
        title: 'Select Practice Timing',
        subtitle: 'Choose your preferred timing option'
      };
    }
    return {
      title: 'Choose Time Mode',
      subtitle: 'Select your preferred timing option'
    };
  };

  const { title, subtitle } = getTitle();

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            {/* 标题区域 */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {subtitle}
              </p>
            </div>

            {/* 时间模式选择 */}
            <div className="mb-6 sm:mb-8">
              {/*<label className="block text-sm font-semibold text-gray-800 mb-3">*/}
              {/*  Timing <span className="text-red-500">*</span>*/}
              {/*</label>*/}

              <div className="relative">
                <select
                    value={selectedTimeMode}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedTimeMode(v);
                      setTimeMode?.(v);
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200"
                >
                  <option value="timed">Timed</option>
                  <option value="untimed">Untimed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400" />
                </div>
              </div>
            </div>

            {/* 模式说明 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-info text-xs text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Timed:</span> Practice with time limits to simulate real exam conditions
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">
                    <span className="font-semibold text-gray-900">Untimed:</span> Practice at your own pace without time pressure
                  </p>
                </div>
              </div>
            </div>

            {/* 开始按钮 */}
            <div className="text-center">
              <button
                  type="button"
                  onClick={handleStart}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 w-full sm:w-auto min-w-[140px]"
              >
                {loading ? 'Loading...' : (source === 'exam' ? 'Start Exam' : 'Start Practice')}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default TimeModeScreen;