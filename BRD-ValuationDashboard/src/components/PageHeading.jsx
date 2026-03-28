import React from 'react';

const PageHeading = ({ title, actions }) => {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex-1 xs:flex-none px-3 sm:px-4 py-2 rounded-lg text-white text-sm sm:text-base transition-transform duration-150
                transform hover:-translate-y-0.5 active:translate-y-0
                ${action.primary ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}
                shadow-lg hover:shadow-xl`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeading;