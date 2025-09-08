import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Blur background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7E8] to-white opacity-80 backdrop-blur-sm" />
      
      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-gray-600 font-noto-bengali text-lg mb-2">
            {message}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-shikho-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-shikho-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-shikho-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 bg-shikho-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-shikho-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-shikho-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 