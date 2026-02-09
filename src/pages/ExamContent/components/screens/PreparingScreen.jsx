import React from 'react';

function PreparingScreen() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-serif text-gray-800 mb-8 tracking-tight">
        We're Preparing Your Practice Test
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full flex flex-col items-center text-center">
        <div className="relative mb-10">
          <div className="w-24 h-24 flex items-center justify-center">
            <i className="fas fa-hourglass-half text-6xl text-red-500/80 animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 flex flex-col space-y-1">
            <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed max-w-[280px]">
          This may take up to a minute. Please don't refresh this page or quit the app.
        </p>
      </div>
    </div>
  );
}

export default PreparingScreen;

