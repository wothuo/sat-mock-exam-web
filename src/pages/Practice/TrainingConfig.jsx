import React from 'react';

import {
  QUESTION_COUNTS,
  QUESTION_DIFFICULTIES, QUESTION_DIFFICULTY_ENUM, QUESTION_DIMENSION_ENUM,
  QUESTION_DIMENSIONS, QUESTION_SOURCE_ENUM,
  QUESTION_SOURCES, QUESTION_SUBCATEGORY_ENUM,
  QUESTION_TYPES
  // VIEW_MODES
} from './constants';
import FilterSection from './FilterSection';

function TrainingConfig({ subject, config, onConfigChange }) {
  // 确保每个配置都有默认值
  const safeConfig = {
    questionType: config.questionType || QUESTION_SUBCATEGORY_ENUM.ALL,
    source: config.source || QUESTION_SOURCE_ENUM.ALL,
    dimension: config.dimension || QUESTION_DIMENSION_ENUM.ALL,
    difficulty: config.difficulty || QUESTION_DIFFICULTY_ENUM.RANDOM,
    count: config.count || 5
  };

  const filterSections = [
    {
      id: 'questionType',
      title: '题目类型',
      icon: 'fas fa-list-ul',
      color: 'from-blue-500 to-cyan-600',
      options: QUESTION_TYPES[subject] ?? [],
      value: safeConfig.questionType,
      showIcons: true
    },
    {
      id: 'source',
      title: '题目来源',
      icon: 'fas fa-database',
      color: 'from-red-500 to-pink-600',
      options: QUESTION_SOURCES,
      value: safeConfig.source
    },
    {
      id: 'dimension',
      title: '题目维度',
      icon: 'fas fa-filter',
      color: 'from-purple-500 to-indigo-600',
      options: QUESTION_DIMENSIONS,
      value: safeConfig.dimension
    },
    {
      id: 'difficulty',
      title: '题目难度',
      icon: 'fas fa-chart-line',
      color: 'from-orange-500 to-red-600',
      options: QUESTION_DIFFICULTIES,
      value: safeConfig.difficulty
    },
    {
      id: 'count',
      title: '练习题数',
      icon: 'fas fa-hashtag',
      color: 'from-green-500 to-teal-600',
      options: QUESTION_COUNTS,
      value: safeConfig.count
    }
    // {
    //   id: 'viewMode',
    //   title: '选项选择',
    //   icon: 'fas fa-eye',
    //   color: 'from-cyan-500 to-blue-600',
    //   options: VIEW_MODES,
    //   value: safeConfig.viewMode
    // }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
      <div className="space-y-6">
        {filterSections.map((section) => (
          <FilterSection
            key={section.id}
            {...section}
            onChange={(value) => onConfigChange(section.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

export default TrainingConfig;