import { Select, Space } from 'antd';
import React from 'react';

const { Option } = Select;

function FilterBar({ filters, onChange }) {
  return (
    <Space size="middle" wrap>
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onChange={(value) => onChange(filter.key, value)}
          style={{ width: filter.width || 150 }}
          placeholder={filter.placeholder}
        >
          {filter.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.icon && `${option.icon} `}{option.label}
            </Option>
          ))}
        </Select>
      ))}
    </Space>
  );
}

export default FilterBar;
