import { Space, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

function PageHeader({ title, description, icon, extra }) {
  return (
    <div className="mb-8">
      <Space direction="vertical" size="small" className="w-full">
        <Space align="center" size="middle">
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              {icon}
            </div>
          )}
          <Title level={2} className="!mb-0">{title}</Title>
        </Space>
        {description && (
          <Text type="secondary" className="text-base">{description}</Text>
        )}
        {extra && <div className="mt-4">{extra}</div>}
      </Space>
    </div>
  );
}

export default PageHeader;