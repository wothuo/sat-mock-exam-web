import React from 'react';

function PreparingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
            {/* 主容器 */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 max-w-sm w-full text-center">

                {/* 动画图标区域 */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <i className="fas fa-hourglass-half text-3xl text-white animate-pulse" />
                    </div>

                    {/* 加载动画点 */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>

                {/* 标题 */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Preparing Your Test
                </h1>

                {/* 描述文本 */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    This may take up to a minute. Please don't refresh this page or quit the app.
                </p>

                {/* 进度指示器 */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
                </div>

                <div className="text-xs text-gray-500">
                    Loading resources...
                </div>
            </div>
        </div>
    );
}

export default PreparingScreen;