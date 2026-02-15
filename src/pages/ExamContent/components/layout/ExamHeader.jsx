import React, { useRef, useEffect } from 'react';
import { Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

function ExamHeader({
  title,
  timeMode,
  timeRemaining,
  hideTime,
  showTimeAsIcon,
  formatTime,
  directionsOpen,
  onToggleDirections,
  directionsContent,
  showReference,
  onOpenReference,
  onShowTimeAsIcon,
  onShowTimeAsText,
  onToggleHideTime
}) {
  const directionsRef = useRef(null);

  useEffect(() => {
    if (!directionsOpen) return;
    const handleClickOutside = (e) => {
      if (directionsRef.current && !directionsRef.current.contains(e.target)) {
        onToggleDirections();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [directionsOpen, onToggleDirections]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
          <div className="relative" ref={directionsRef}>
            <button
              type="button"
              onClick={onToggleDirections}
              className={`text-sm px-2 py-1 rounded-md font-normal ${directionsOpen ? 'text-blue-800 font-semibold underline' : 'text-blue-600 hover:text-blue-800 hover:underline'}`}
              aria-expanded={directionsOpen}
            >
              Directions
            </button>

            {/* 浮层常驻 DOM，通过透明度切换避免每次打开时重新挂载导致内容闪烁 */}
            <div
              className={directionsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              aria-hidden={!directionsOpen}
            >
              {/* Arrow pointing to Directions */}
              <div
                className="absolute left-1/2 top-full -translate-x-1/2 z-50"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '8px solid white',
                  filter: 'drop-shadow(0 -1px 0 rgb(229 231 235))'
                }}
              />
              <div className="absolute left-0 top-full mt-2 z-50 w-[480px] max-h-[70vh] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                  <div className="text-gray-800 text-base leading-relaxed">
                    {directionsContent}
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Click Directions above to view again</span>
                  <button
                    type="button"
                    onClick={onToggleDirections}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            {showReference && (
              <button
                type="button"
                onClick={onOpenReference}
                className="flex flex-col items-center text-gray-600 hover:text-gray-800 py-1"
              >
                <i className="fas fa-calculator text-sm" />
                <span className="text-xs leading-tight mt-0.5">Reference</span>
              </button>
            )}
            {/* <button type="button" className="flex flex-col items-center text-gray-600 hover:text-gray-800 py-1">
              <i className="fas fa-ellipsis-v text-sm" />
              <span className="text-xs leading-tight mt-0.5">More</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamHeader;

