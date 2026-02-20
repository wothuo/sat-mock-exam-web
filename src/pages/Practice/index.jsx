import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { startPractice } from '../../services/training.js';

import { 
  TRAINING_SUBJECTS, 
  SUBJECT_ENUM,
  QUESTION_SOURCE_ENUM,
  QUESTION_SOURCE_LABELS,
  QUESTION_DIMENSION_ENUM,
  QUESTION_DIMENSION_LABELS,
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_DIFFICULTY_LABELS
} from './constants';
import TrainingConfig from './TrainingConfig';


function SpecialTraining() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(SUBJECT_ENUM.READING);
  const [trainingConfig, setTrainingConfig] = useState({
    questionType: '全部',
    source: QUESTION_SOURCE_ENUM.ALL,
    dimension: QUESTION_DIMENSION_ENUM.ALL,
    difficulty: QUESTION_DIFFICULTY_ENUM.RANDOM,
    count: '5题'
    // viewMode: '随时查看答案和解析'
  });

  const handleConfigChange = (key, value) => {
    setTrainingConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 根据中文标签获取对应的英文枚举值
  const getEnumValueFromLabel = (labels, label) => {
    const entry = Object.entries(labels).find(([key, value]) => value === label);
    return entry ? entry[0] : label; // 如果找不到对应的枚举值，返回原值
  };

  const handleStartTraining = async () => {
    // 将中文选项值转换为英文枚举值
    const practiceParams = {
      questionCategory: activeSubject,
      questionSubCategory: trainingConfig.questionType === '全部' ? undefined : trainingConfig.questionType,
      difficulty: getEnumValueFromLabel(QUESTION_DIFFICULTY_LABELS, trainingConfig.difficulty),
      source: getEnumValueFromLabel(QUESTION_SOURCE_LABELS, trainingConfig.source),
      records: getEnumValueFromLabel(QUESTION_DIMENSION_LABELS, trainingConfig.dimension),
      size: parseInt(trainingConfig.count) || 5
    };

    console.log('开始训练，配置参数：', practiceParams);

    try {
      // 调用开始练习API
      const questions = await startPractice(practiceParams);
      console.log('获取到题目：', questions);

      // 直接使用返回的题目数组，因为startPractice已经返回了response.data
      console.log('提取题目数据：', questions);

      navigate('/practicing', { state: { questions } });
    } catch (error) {
      console.error('开始训练失败：', error);
      // 可以添加错误提示
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        
        {/* 科目选择Tab */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-xl p-1 rounded-2xl w-fit shadow-lg border border-white/20">
            {TRAINING_SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => {
                  setActiveSubject(subject.id);
                  setTrainingConfig({
                    questionType: '全部',
                    source: '全部',
                    dimension: '全部',
                    difficulty: '随机',
                    count: '5题'
                    // viewMode: '随时查看答案和解析'
                  });
                }}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeSubject === subject.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className={`${subject.icon} mr-2`}></i>
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* 训练配置区域 */}
        <TrainingConfig
          subject={activeSubject}
          config={trainingConfig}
          onConfigChange={handleConfigChange}
        />

        {/* 开始训练按钮 */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleStartTraining}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fas fa-rocket mr-3 relative z-10"></i>
            <span className="relative z-10">开始训练</span>
          </button>
        </div>

        {/* 训练说明 */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
            训练说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span>根据您的选择，系统将智能匹配相应的练习题目</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span>支持随时查看答案解析，帮助您及时理解错题</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span>系统会自动记录您的练习记录和错题集</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span>建议每天坚持练习，循序渐进提升能力</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialTraining;