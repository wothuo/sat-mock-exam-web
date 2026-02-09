import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function ExamSetListToolbar({
  searchValue,
  onSearchChange,
  onSearch,
  onReset,
  searchPlaceholder = '请输入套题名称',
  primaryAction,
}) {
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (primaryAction?.to != null) {
      navigate(primaryAction.to);
    } else if (typeof primaryAction?.onClick === 'function') {
      primaryAction.onClick();
    }
  };

  return (
    <div className="mt-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onPressEnter={onSearch}
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              allowClear
              onClear={onReset}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="primary"
              onClick={onSearch}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <SearchOutlined className="mr-1" />搜索
            </Button>
            <Button
              onClick={onReset}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              重置
            </Button>
          </div>
        </div>

        {primaryAction && (
          <Button
            size="large"
            icon={primaryAction.icon}
            onClick={handlePrimaryClick}
            className="rounded-xl border-2 border-red-500 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-100"
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ExamSetListToolbar;
