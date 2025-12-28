import React from 'react';


const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start items-start space-x-3">
      <img
        src="/images/logo.png"
        alt="Spur Logo"
        className="h-10 w-10 object-cover"
      />
      
      <div className="max-w-xs sm:max-w-md">
        <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
          <div className="flex items-center space-x-1">
         
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default TypingIndicator;