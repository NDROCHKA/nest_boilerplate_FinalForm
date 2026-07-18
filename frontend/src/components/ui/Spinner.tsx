import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2 border-t-accent',
    lg: 'w-12 h-12 border-3 border-t-accent',
  };

  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: size === 'sm' ? '1rem' : size === 'lg' ? '2.5rem' : '1.5rem',
        height: size === 'sm' ? '1rem' : size === 'lg' ? '2.5rem' : '1.5rem',
      }}
    />
  );
};
