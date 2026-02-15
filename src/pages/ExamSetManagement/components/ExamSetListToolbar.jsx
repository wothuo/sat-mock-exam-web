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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onPressEnter={onSearch}
              prefix={<SearchOutlined className="text-red-400" />}
              className="w-full h-10 rounded-lg border-red-300 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200"
              allowClear
              onClear={onReset}
              size="middle"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              type="primary"
              onClick={onSearch}
              className="flex-1 sm:flex-none h-10 px-5 rounded-lg bg-red-600 hover:bg-red-700 border-0 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              size="middle"
            ><SearchOutlined className="mr-2" />搜索
            </Button>
            <Button
              onClick={onReset}
              className="flex-1 sm:flex-none h-10 px-5 rounded-lg border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200"
              size="middle"
            >
              重置
            </Button>
          </div>
        </div>

        {primaryAction && (
          <Button
            size="middle"
            icon={primaryAction.icon}
            onClick={handlePrimaryClick}
            className="h-10 px-5 rounded-lg border-2 border-red-500 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 font-bold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ExamSetListToolbar;