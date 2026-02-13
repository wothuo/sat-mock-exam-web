import React from 'react';

function IntroScreen({ onContinue }) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center py-8 sm:py-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">Practice Test</h1>
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-8 max-w-2xl w-full space-y-6 sm:space-y-8">
          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="far fa-clock text-lg text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Timing</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Practice tests are timed, but you can pause them. To continue on another device, you have to start over. We delete incomplete practice tests after 90 days.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-file-signature text-lg text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Scores</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                When you finish the practice test, go to My Practice to see your scores and get personalized study tips.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="w-8 h-8 flex-shrink-0 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-check text-lg text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Assistive Technology</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                If you use assistive technology, try it out on the practice test so you know what to expect on test day.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="w-8 h-8 flex-shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-lock-open text-lg text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No Device Lock</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We don't lock your device during practice. On test day, you'll be blocked from accessing other programs or apps.
              </p>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex justify-center">
            <button
                type="button"
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 sm:px-16 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 transform"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
  );
}

export default IntroScreen;
