import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
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
