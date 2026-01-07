import React from 'react';

function FilterSection({ 
  id, 
  title, 
  icon, 
  color, 
  options, 
  value, 
  onChange,
  showIcons = false 
}) {
  return (
    <div>
      <div className="flex items-center mb-3">
        <div className={`w-6 h-6 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mr-3`}>
          <i className={`${icon} text-white text-xs`}></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;
          
          if (showIcons) {
            return (
                <button
                  key={option.id}
                  onClick={() => onChange(option.id)}
                  className={`group relative px-3 py-3 sm:px-4 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 min-w-[80px] sm:min-w-[100px] flex-1 sm:flex-none ${
                    isSelected
                      ? `bg-gradient-to-br ${
                          option.id === '全部' 
                            ? 'from-blue-500 to-blue-600' 
                            : option.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                              option.color.includes('green') ? 'from-green-500 to-green-600' :
                              option.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                              option.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                              option.color.includes('pink') ? 'from-pink-500 to-pink-600' :
                              option.color.includes('indigo') ? 'from-indigo-500 to-indigo-600' :
                              option.color.includes('teal') ? 'from-teal-500 to-teal-600' :
                              option.color.includes('cyan') ? 'from-cyan-500 to-cyan-600' :
                              option.color.includes('red') ? 'from-red-500 to-red-600' :
                              option.color.includes('yellow') ? 'from-yellow-500 to-yellow-600' :
                              option.color.includes('lime') ? 'from-lime-500 to-lime-600' :
                              'from-gray-500 to-gray-600'
                        } text-white shadow-lg ring-2 ring-offset-2 ${
                          option.id === '全部' 
                            ? 'ring-blue-400' 
                            : option.color.includes('blue') ? 'ring-blue-400' :
                              option.color.includes('green') ? 'ring-green-400' :
                              option.color.includes('purple') ? 'ring-purple-400' :
                              option.color.includes('orange') ? 'ring-orange-400' :
                              option.color.includes('pink') ? 'ring-pink-400' :
                              option.color.includes('indigo') ? 'ring-indigo-400' :
                              option.color.includes('teal') ? 'ring-teal-400' :
                              option.color.includes('cyan') ? 'ring-cyan-400' :
                              option.color.includes('red') ? 'ring-red-400' :
                              option.color.includes('yellow') ? 'ring-yellow-400' :
                              option.color.includes('lime') ? 'ring-lime-400' :
                              'ring-gray-400'
                        }`
                      : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isSelected ? 'bg-white/20 backdrop-blur-sm' : option.color
                    }`}>
                      <i className={`${option.icon} text-xl ${isSelected ? 'text-white' : ''}`}></i>
                    </div>
                    <span className={`text-base font-bold text-center leading-tight px-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {option.name}
                    </span>
                  </div>
                </button>
            );
          }
          
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`group relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? `bg-gradient-to-br ${color} text-white shadow-lg`
                  : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  {isSelected ? (
                    <i className="fas fa-check text-white text-xs"></i>
                  ) : (
                    <i className="far fa-circle text-gray-400 group-hover:text-blue-500 text-xs"></i>
                  )}
                </div>
                <span className="relative">
                  {option.name}
                  {isSelected && (
                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white/30 rounded-full"></div>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterSection;

