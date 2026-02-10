import React from 'react';
import { Button, Space } from 'antd';
import {
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  StopOutlined
} from '@ant-design/icons';

function ExamFooterBar({
  isFirstQuestion,
  isLastQuestion,
  onOpenProgress,
  onPrev,
  onNext,
  onEndExam
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-3 sm:py-5 z-40">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-600 text-sm"></i>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">张同学</div>
          </div>
        </div>

        <Space size="middle" className="w-full sm:w-auto justify-between sm:justify-end">
          <Button
            icon={<BarChartOutlined />}
            onClick={onOpenProgress}
            className="flex-1 sm:flex-none bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-200"
            size="middle"
          >
            <span className="hidden xs:inline font-medium">Progress</span>
          </Button>
          <Button
            icon={<LeftOutlined />}
            onClick={onPrev}
            disabled={isFirstQuestion}
            type="primary"
            className="min-w-[80px] bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            size="middle"
          >
            <span className="font-medium">Back</span>
          </Button>
          <Button
            icon={<RightOutlined />}
            onClick={onNext}
            disabled={isLastQuestion}
            type="primary"
            className="min-w-[80px] bg-gradient-to-r from-green-500 to-green-600 border-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            size="middle"
          >
            <span className="font-medium">Next</span>
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={onEndExam}
            className="min-w-[90px] bg-gradient-to-r from-red-500 to-red-600 border-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            size="middle"
          >
            <span className="font-medium">Finish</span>
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default ExamFooterBar;