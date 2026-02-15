import React from 'react';
import { Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

function ExamHeader({
  title,
  timeMode,
  timeRemaining,
  hideTime,
  showTimeAsIcon,
  formatTime,
  onOpenDirections,
  onOpenReference,
  onShowTimeAsIcon,
  onShowTimeAsText,
  onToggleHideTime
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
          <button
            type="button"
            onClick={onOpenDirections}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline p-0 h-auto font-normal"
          >
            Directions
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {timeMode === 'timed' && (
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
              {!hideTime && (
                <div className="flex items-center">
                  {showTimeAsIcon ? (
                    <Button
                      type="text"
                      icon={<ClockCircleOutlined style={{ fontSize: '20px' }} />}
                      onClick={onShowTimeAsText}
                      title={`剩余时间: ${formatTime(timeRemaining)}`}
                      className="flex items-center justify-center p-0 h-auto text-gray-700"
                    />
                  ) : (
                    <Button
                      type="text"
                      onClick={onShowTimeAsIcon}
                      className="text-xl font-mono font-black text-gray-800 p-0 h-auto leading-none hover:text-red-600 transition-colors"
                      title="点击切换为图标显示"
                    >
                      {formatTime(timeRemaining)}
                    </Button>
                  )}
                </div>
              )}
              {hideTime && (
                <ClockCircleOutlined style={{ fontSize: '20px', color: '#9ca3af' }} />
              )}
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button
                size="small"
                onClick={onToggleHideTime}
                className="h-7 px-3 rounded-lg bg-white border-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-wider hover:text-red-600 hover:border-red-200 transition-all shadow-none"
              >
                {hideTime ? 'Show' : 'Hide'}
              </Button>
            </div>
          )}
          {timeMode === 'untimed' && (
            <div className="text-lg font-medium text-gray-600">
              Untimed Practice
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenReference}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reference
            </button>
            <button type="button" className="text-sm text-gray-600 hover:text-gray-800">
              More
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
              <i className="fas fa-times" />
            </button>
            <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamHeader;

