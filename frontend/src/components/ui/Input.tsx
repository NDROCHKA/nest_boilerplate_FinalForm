import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, containerClassName = '', className = '', style, ...props },
    ref,
  ) => {
    return (
      <div
        className={`form-group ${containerClassName}`}
        style={{ marginBottom: '1.25rem' }}
      >
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={`${className}`}
          style={{
            ...style,
            ...(error ? { borderColor: 'var(--color-danger)' } : {}),
          }}
          {...props}
        />
        {error && (
          <p
            style={{
              color: 'var(--color-danger)',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
