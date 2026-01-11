import React from 'react';

import { Card, Statistic } from 'antd';

function StatisticCard({ title, value, suffix, prefix, icon, valueStyle, className }) {
  return (
    <Card bordered={false} className={className}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={prefix}
        valueStyle={valueStyle}
      />
      {icon && (
        <div className="absolute top-4 right-4 text-3xl opacity-20">
          {icon}
        </div>
      )}
    </Card>
  );
}

export default StatisticCard;