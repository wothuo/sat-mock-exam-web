import React from 'react';

function IntroScreen({ onContinue }) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-serif text-gray-800 mb-12 tracking-tight">Practice Test</h1>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-2xl w-full space-y-12">
        <div className="flex items-start space-x-8">
          <div className="w-8 h-8 flex-shrink-0 mt-1">
            <i className="far fa-clock text-2xl text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Timing</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice tests are timed, but you can pause them. To continue on another device, you have to start over. We delete incomplete practice tests after 90 days.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-8">
          <div className="w-8 h-8 flex-shrink-0 mt-1">
            <i className="fas fa-file-signature text-2xl text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Scores</h3>
            <p className="text-gray-600 leading-relaxed">
              When you finish the practice test, go to My Practice to see your scores and get personalized study tips.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-8">
          <div className="w-8 h-8 flex-shrink-0 mt-1">
            <i className="fas fa-user-check text-2xl text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Assistive Technology</h3>
            <p className="text-gray-600 leading-relaxed">
              If you use assistive technology, try it out on the practice test so you know what to expect on test day.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-8">
          <div className="w-8 h-8 flex-shrink-0 mt-1">
            <i className="fas fa-lock-open text-2xl text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Device Lock</h3>
            <p className="text-gray-600 leading-relaxed">
              We don't lock your device during practice. On test day, you'll be blocked from accessing other programs or apps.
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <button
            type="button"
            onClick={onContinue}
            className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroScreen;
