import React from 'react';

import {
    QUESTION_COUNTS,
    QUESTION_DIFFICULTIES,
    QUESTION_DIMENSIONS,
    QUESTION_SOURCES,
    QUESTION_TYPES
    // VIEW_MODES
} from './constants';
import FilterSection from './FilterSection';

function TrainingConfig({ subject, config, onConfigChange }) {
  const filterSections = [
    {
      id: 'questionType',
      title: '题目类型',
      icon: 'fas fa-list-ul',
      color: 'from-blue-500 to-cyan-600',
      options: QUESTION_TYPES[subject],
      value: config.questionType,
      showIcons: true
    },
    {
      id: 'source',
      title: '题目来源',
      icon: 'fas fa-database',
      color: 'from-red-500 to-pink-600',
      options: QUESTION_SOURCES,
      value: config.source
    },
    {
      id: 'dimension',
      title: '题目维度',
      icon: 'fas fa-filter',
      color: 'from-purple-500 to-indigo-600',
      options: QUESTION_DIMENSIONS,
      value: config.dimension
    },
    {
      id: 'difficulty',
      title: '题目难度',
      icon: 'fas fa-chart-line',
      color: 'from-orange-500 to-red-600',
      options: QUESTION_DIFFICULTIES,
      value: config.difficulty
    },
    {
      id: 'count',
      title: '练习题数',
      icon: 'fas fa-hashtag',
      color: 'from-green-500 to-teal-600',
      options: QUESTION_COUNTS,
      value: config.count
    }
    // {
    //   id: 'viewMode',
    //   title: '选项选择',
    //   icon: 'fas fa-eye',
    //   color: 'from-cyan-500 to-blue-600',
    //   options: VIEW_MODES,
    //   value: config.viewMode
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

