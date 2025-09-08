import React from 'react';

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  onClick,
  className = '',
  style = {},
  ariaLabel,
}) => {
  // Flip for left
  const rotation = direction === 'left' ? 'rotate-180' : '';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (direction === 'left' ? 'Previous slide' : 'Next slide')}
      className={`group flex items-center justify-center focus:outline-none transition-all duration-150 ${className}`}
      style={{ width: 48, height: 48, ...style }}
    >
      <svg
        className={`transition-all duration-150 ${rotation}`}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="12,8 20,16 12,24"
          stroke="#CF278D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="group-hover:drop-shadow-md"
        />
      </svg>
    </button>
  );
}; 