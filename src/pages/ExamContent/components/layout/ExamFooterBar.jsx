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

        <Space size="small" className="w-full sm:w-auto justify-between sm:justify-end">
          <Button
            icon={<BarChartOutlined />}
            onClick={onOpenProgress}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden xs:inline">Progress</span>
          </Button>
          <Button
            icon={<LeftOutlined />}
            onClick={onPrev}
            disabled={isFirstQuestion}
            type="primary"
          >
            Back
          </Button>
          <Button
            icon={<RightOutlined />}
            onClick={onNext}
            disabled={isLastQuestion}
            type="primary"
          >
            Next
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={onEndExam}
          >
            结束考试
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default ExamFooterBar;

