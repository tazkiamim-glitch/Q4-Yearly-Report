import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Blur background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7E8] to-white opacity-80 backdrop-blur-sm" />
      
      {/* Error content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-md">
        {/* Error icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Error message */}
        <div className="text-center">
          <h2 className="text-xl font-noto-bengali font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 font-noto-bengali text-sm mb-6">
            {error}
          </p>
          
          {/* Retry button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-shikho-pink text-white font-noto-bengali font-semibold rounded-full px-6 py-3 shadow-lg hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 