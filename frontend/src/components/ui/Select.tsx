import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`form-group ${containerClassName}`} style={{ marginBottom: '1.25rem' }}>
        {label && <label>{label}</label>}
        <select
          ref={ref}
          className={`${className}`}
          style={error ? { borderColor: 'var(--color-danger)' } : {}}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--color-bg-secondary)' }}>
              {opt.label}
            </option>
          ))}
        </select>
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
  }
);

Select.displayName = 'Select';
