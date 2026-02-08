import React from 'react';

function TimeModeScreen({ timeMode, setTimeMode, onStart }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose a Time Mode for Your Practice
          </h1>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-medium text-gray-900">
                Timing <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">* = Required</span>
            </div>

            <div className="relative">
              <select
                value={timeMode}
                onChange={(e) => setTimeMode(e.target.value)}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="timed">✓ Timed</option>
                <option value="untimed">Untimed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onStart}
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Start Practice
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              <strong>Timed:</strong> Practice with time limits to simulate real exam conditions
            </p>
            <p className="mt-2">
              <strong>Untimed:</strong> Practice at your own pace without time pressure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeModeScreen;
